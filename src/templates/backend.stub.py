# Minimal FastAPI backend the Custom GPT Action AND the infographic both call.
# Deploy on HuggingFace Spaces (Docker) or any host; put the URL in BOTH the
# GPT's Actions config and build.spec.json.gpt.action_base_url.
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(title="GPT Action Backend")
# CORS is required so the infographic (served from a different origin) can call /run
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["POST"], allow_headers=["*"])

class RunInput(BaseModel):
    # mirror action.schema.json RunInput
    ...

class RunOutput(BaseModel):
    # mirror action.schema.json RunOutput
    ...

@app.post("/run", response_model=RunOutput)
def run(inp: RunInput) -> RunOutput:
    # deterministic / schema-constrained logic here
    ...
