"""
Vector Trial Governance Navigator — local LLM backend.

Implements the /run contract from ../action.schema.json (the same contract
a live Custom GPT Action would call) and a /chat contract for free-text
conversation, both grounded in the same knowledge distillate the actual
ChatGPT Custom GPT uses. This is a *separate* call to the Anthropic API
using the GPT's own instructions + knowledge file as context — there is no
public API to invoke a specific ChatGPT Custom GPT programmatically, so
this is the closest equivalent, not literally the same hosted GPT object.

Run:
    uvicorn app:app --host 127.0.0.1 --port 8766 --reload

Requires ANTHROPIC_API_KEY (see .env.example).
"""
from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Literal

import anthropic
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

load_dotenv(Path(__file__).parent / ".env")

ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY")
MODEL = os.environ.get("NAVIGATOR_MODEL", "claude-sonnet-5")
NAVIGATOR_SHARED_SECRET = os.environ.get("NAVIGATOR_SHARED_SECRET")

if not NAVIGATOR_SHARED_SECRET:
    print(
        "[navigator-backend] WARNING: NAVIGATOR_SHARED_SECRET is not set — /run and /chat are "
        "unauthenticated. Fine for pure localhost use; set this before exposing the backend "
        "publicly (e.g. via a cloudflared tunnel) so random internet traffic can't burn your "
        "Anthropic API key."
    )


def require_secret(x_navigator_secret: str | None = Header(default=None)) -> None:
    if NAVIGATOR_SHARED_SECRET and x_navigator_secret != NAVIGATOR_SHARED_SECRET:
        raise HTTPException(status_code=401, detail="Missing or invalid X-Navigator-Secret header.")

GPT_CONFIG_PATH = Path(r"C:\Users\HP\ArbitrageVault\gpts\vector-trial-governance-navigator\gpt-config.md")
DISTILLATE_PATH = Path(r"C:\Users\HP\ArbitrageVault\gpts\vector-trial-governance-navigator\distillate.md")


def _load_grounding() -> str:
    if not GPT_CONFIG_PATH.exists() or not DISTILLATE_PATH.exists():
        raise RuntimeError(
            f"Grounding files not found — expected {GPT_CONFIG_PATH} and {DISTILLATE_PATH}. "
            "This backend only makes sense running on the machine where the ArbitrageVault lives."
        )
    config = GPT_CONFIG_PATH.read_text(encoding="utf-8")
    distillate = DISTILLATE_PATH.read_text(encoding="utf-8")
    return (
        "You are the Vector Trial Governance Navigator, exactly as configured below. "
        "Ground every answer strictly in the knowledge distillate provided — do not use "
        "outside knowledge about current regulatory events, and never invent facts not in "
        "the distillate.\n\n=== GPT CONFIGURATION ===\n" + config +
        "\n\n=== KNOWLEDGE DISTILLATE (your only source of truth) ===\n" + distillate
    )


SYSTEM_PROMPT = _load_grounding()

app = FastAPI(title="Vector Trial Governance Navigator backend")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # local dev tool only — not exposed publicly
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["*"],
)

client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY) if ANTHROPIC_API_KEY else None


def _require_client() -> anthropic.Anthropic:
    if client is None:
        raise HTTPException(
            status_code=500,
            detail="ANTHROPIC_API_KEY is not set. Copy .env.example to .env and add your key.",
        )
    return client


class RunInput(BaseModel):
    mechanism: Literal[
        "Pesticide-like (active ingredient kills/sterilizes pest)",
        "Drug-like (something administered to the organism)",
    ]
    productType: Literal[
        "Population-suppression (RIDL / Wolbachia-style)",
        "Population-modification / self-propagating gene drive",
    ]
    engagement: Literal[
        "Informational meeting only (no stated decision role)",
        "Meeting + designated decision-input channel",
        "Representative survey / deliberative poll",
    ]
    opposition: float = Field(ge=0, le=100)


class RunOutput(BaseModel):
    pathway: str
    timelineYears: float
    score: float = Field(ge=0, le=1)
    band: Literal["LOW", "MODERATE", "HIGH"]
    factors: dict[str, float]
    weights: dict[str, float]
    nearestPrecedent: str
    table: list[list[str]]


RUN_OUTPUT_SCHEMA_HINT = """Return ONLY a single JSON object (no markdown fencing, no commentary) with exactly these fields:
{
  "pathway": "<nearest historical jurisdiction pathway analogy, one sentence>",
  "timelineYears": <number>,
  "score": <number 0-1, controversy-risk score>,
  "band": "LOW" | "MODERATE" | "HIGH",
  "factors": { "<factor name>": <0-1>, ... 4 factors ... },
  "weights": { "<same factor names>": <0-1 weight>, ... },
  "nearestPrecedent": "<which historical case (Oxitec/OX513A or MosquitoMate/Debug Fresno) this resembles>",
  "table": [["Field", "Value"], ["Nearest precedent", "..."], ... 5-7 rows of real historical detail from the distillate for the matched precedent ...]
}"""


@app.post("/run", response_model=RunOutput, dependencies=[Depends(require_secret)])
def run(inp: RunInput) -> RunOutput:
    c = _require_client()
    user_msg = (
        f"A user is evaluating a proposed US field trial with these parameters:\n"
        f"- Mechanism framing: {inp.mechanism}\n- Population effect: {inp.productType}\n"
        f"- Planned public engagement: {inp.engagement}\n- Anticipated local opposition: {inp.opposition}%\n\n"
        + RUN_OUTPUT_SCHEMA_HINT
    )
    resp = c.messages.create(
        model=MODEL,
        max_tokens=1024,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_msg}],
    )
    text = "".join(block.text for block in resp.content if block.type == "text").strip()
    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
    try:
        data = json.loads(text)
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=502, detail=f"Model did not return valid JSON: {e}\nRaw: {text[:500]}")
    return RunOutput(**data)


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatInput(BaseModel):
    message: str
    history: list[ChatMessage] = Field(default_factory=list)


class ChatOutput(BaseModel):
    reply: str


@app.post("/chat", response_model=ChatOutput, dependencies=[Depends(require_secret)])
def chat(inp: ChatInput) -> ChatOutput:
    c = _require_client()
    messages = [{"role": m.role, "content": m.content} for m in inp.history]
    messages.append({"role": "user", "content": inp.message})
    resp = c.messages.create(
        model=MODEL,
        max_tokens=1024,
        system=SYSTEM_PROMPT,
        messages=messages,
    )
    reply = "".join(block.text for block in resp.content if block.type == "text").strip()
    return ChatOutput(reply=reply)


@app.get("/healthz")
def healthz() -> dict[str, bool]:
    return {"ok": True, "api_key_configured": client is not None}
