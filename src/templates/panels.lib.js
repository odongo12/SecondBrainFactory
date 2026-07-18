/* ============================================================================
   SECOND BRAIN FACTORY — PANEL LIBRARY
   Real implementations of the registry in 04-MORPHIC-PANELS.md.
   Every panel implements the same contract, so the bus wiring and the download
   layer never change between builds:

     { id, accepts:[busKeys], mount(el,cfg), render(state), export() }

   Claude Code: at Stage 5, copy ONLY the selected panels into app.html.
   Do not rewrite them. If a build needs a panel that isn't here, write it to
   this contract and append it — then log it in src/system/panel-ledger.md so the
   next build inherits it.
   ============================================================================ */

/* ---------- shared drawing helpers ---------- */
const css = k => getComputedStyle(document.documentElement).getPropertyValue(k).trim();
function ctx(cv){ const x = cv.getContext("2d"); x.clearRect(0,0,cv.width,cv.height); return x; }
function axes(x,W,H,pad){ x.strokeStyle=css('--line'); x.lineWidth=1; x.beginPath();
  x.moveTo(pad,H-pad); x.lineTo(W-4,H-pad); x.moveTo(pad,4); x.lineTo(pad,H-pad); x.stroke(); }
function plot(x,pts,W,H,pad,color){ x.strokeStyle=color; x.lineWidth=2; x.beginPath();
  const ys=pts.map(p=>p[1]), mx=Math.max(...ys)||1;
  pts.forEach(([px,py],i)=>{ const X=pad+px*(W-pad-6), Y=(H-pad)-(py/mx)*(H-pad-8);
    i?x.lineTo(X,Y):x.moveTo(X,Y); }); x.stroke(); return mx; }
function toCSV(header, rows){ return header.join(",")+"\n"+rows.map(r=>r.join(",")).join("\n"); }

/* ---------- math used by the quantitative panels ---------- */
const M = {
  logistic:(x,k=8,m=.5)=>1/(1+Math.exp(-k*(x-m))),
  poissonPMF:(k,l)=>{ let lf=0; for(let i=2;i<=k;i++) lf+=Math.log(i);
                      return Math.exp(-l + k*Math.log(l||1e-9) - lf); },
  normalPDF:(x,mu,sd)=>Math.exp(-((x-mu)**2)/(2*sd*sd))/(sd*Math.sqrt(2*Math.PI)),
  hill:(d,ec50,n)=>1/(1+Math.pow(ec50/(d||1e-9),n))
};

/* ============================ PANEL REGISTRY ============================== */
const PanelLib = {};

/* --- param-sliders : renders bus inputs as controls, writes back to the bus -- */
PanelLib["param-sliders"] = (cfg,Bus)=>({
  id:"param-sliders", accepts:cfg.inputs.map(i=>i.id),
  mount(el){ this.el=el;
    cfg.inputs.forEach(inp=>{
      const w=document.createElement("div"); w.className="field";
      if(inp.type==="slider"){
        w.innerHTML=`<label>${inp.label}<span class="val" id="pv-${inp.id}">${inp.def}${inp.unit||""}</span></label>
          <input type="range" min="${inp.min}" max="${inp.max}" step="${inp.step||1}" value="${inp.def}" aria-label="${inp.label}">`;
        w.querySelector("input").oninput=e=>{ const v=+e.target.value;
          w.querySelector(".val").textContent=v+(inp.unit||""); Bus.set({[inp.id]:v}); };
      } else {
        w.innerHTML=`<label>${inp.label}</label><select aria-label="${inp.label}">`+
          inp.options.map(o=>`<option ${o===inp.def?"selected":""}>${o}</option>`).join("")+`</select>`;
        w.querySelector("select").onchange=e=>Bus.set({[inp.id]:e.target.value});
      }
      el.appendChild(w);
    });
  },
  render(s){ this._json = cfg.inputs.reduce((a,i)=>(a[i.id]=s[i.id],a),{}); },
  export(){ return { json:this._json }; }
});

/* --- verdict-gauge : radial risk gauge, PASS/FLAG/FAIL bands ---------------- */
PanelLib["verdict-gauge"] = (cfg)=>({
  id:"verdict-gauge", accepts:["result"],
  mount(el){ this.cv=Object.assign(document.createElement("canvas"),{width:360,height:200}); el.appendChild(this.cv); },
  render(s){ const o=s.result||cfg.mockRun(s), x=ctx(this.cv), W=this.cv.width,H=this.cv.height;
    const cx=W/2, cy=H*.9, r=Math.min(W*.4,H*.85);
    for(let i=0;i<=180;i++){ const a=Math.PI+(i/180)*Math.PI, v=i/180;
      x.strokeStyle = v<.34?css('--pass'):v<.66?css('--amber'):css('--fail');
      x.lineWidth=16; x.beginPath(); x.arc(cx,cy,r,a-0.012,a); x.stroke(); }
    const a=Math.PI+o.score*Math.PI;
    x.strokeStyle=css('--ink'); x.lineWidth=3; x.beginPath(); x.moveTo(cx,cy);
    x.lineTo(cx+Math.cos(a)*r*.86, cy+Math.sin(a)*r*.86); x.stroke();
    x.textAlign="center"; x.fillStyle=css('--ink'); x.font="700 30px sans-serif";
    x.fillText(o.score.toFixed(2),cx,cy-8);
    x.font="600 13px sans-serif";
    x.fillStyle=o.band==="PASS"?css('--pass'):o.band==="FAIL"?css('--fail'):css('--amber');
    x.fillText(o.band,cx,cy-32);
    this._o=o; },
  export(){ return { png:this.cv, json:{score:this._o.score, band:this._o.band} }; }
});

/* --- factor-bars : per-input contribution to the outcome ------------------- */
PanelLib["factor-bars"] = (cfg)=>({
  id:"factor-bars", accepts:["result"],
  mount(el){ this.cv=Object.assign(document.createElement("canvas"),{width:360,height:200}); el.appendChild(this.cv); },
  render(s){ const o=s.result||cfg.mockRun(s), x=ctx(this.cv), W=this.cv.width,H=this.cv.height;
    const keys=Object.keys(o.factors||{}), bh=(H-16)/Math.max(1,keys.length);
    const rows=[];
    keys.forEach((k,i)=>{ const c=o.factors[k]*((o.weights&&o.weights[k])||.25);
      const w=(W-125)*Math.min(1,c*2.2);
      x.fillStyle=css('--teal'); x.fillRect(110,8+i*bh,w,bh*.58);
      x.font="12px sans-serif"; x.textAlign="right"; x.fillStyle=css('--ink-dim');
      x.fillText(k,102,8+i*bh+bh*.42);
      x.textAlign="left"; x.fillStyle=css('--ink'); x.fillText(c.toFixed(2),115+w,8+i*bh+bh*.42);
      rows.push([k,c.toFixed(3)]); });
    this._csv=toCSV(["factor","contribution"],rows); },
  export(){ return { png:this.cv, csv:this._csv }; }
});

/* --- threshold-slider-curve : draggable threshold; writes _thresh to the bus */
PanelLib["threshold-slider-curve"] = (cfg,Bus)=>({
  id:"threshold-slider-curve", accepts:["result","_thresh"], t:0.5,
  mount(el){ this.cv=Object.assign(document.createElement("canvas"),{width:360,height:200}); el.appendChild(this.cv);
    const set=e=>{ const r=this.cv.getBoundingClientRect();
      const cx=(e.touches?e.touches[0].clientX:e.clientX)-r.left;
      this.t=Math.max(0,Math.min(1,cx/r.width)); Bus.set({_thresh:this.t}); };
    let drag=false;
    this.cv.onmousedown=e=>{drag=true;set(e);}; window.addEventListener("mousemove",e=>drag&&set(e));
    window.addEventListener("mouseup",()=>drag=false);
    this.cv.ontouchstart=set; this.cv.ontouchmove=e=>{set(e);e.preventDefault();}; },
  render(s){ const o=s.result||cfg.mockRun(s), x=ctx(this.cv), W=this.cv.width,H=this.cv.height;
    axes(x,W,H,8);
    x.strokeStyle=css('--teal'); x.lineWidth=2; x.beginPath();
    for(let i=0;i<=W;i++){ const xn=i/W, y=M.logistic(xn); const py=(H-8)-y*(H-24); i?x.lineTo(i,py):x.moveTo(i,py); }
    x.stroke();
    const tx=this.t*W;
    x.fillStyle="rgba(232,102,61,.16)"; x.fillRect(tx,0,W-tx,H-8);
    x.strokeStyle=css('--flag'); x.setLineDash([5,4]); x.beginPath(); x.moveTo(tx,0); x.lineTo(tx,H-8); x.stroke(); x.setLineDash([]);
    x.fillStyle=css('--ink'); x.font="12px sans-serif"; x.textAlign="left";
    x.fillText(`flag ≥ ${this.t.toFixed(2)} · score ${o.score.toFixed(2)}${o.score>=this.t?"  ⚑":""}`,10,14);
    this._csv=toCSV(["x","risk"],Array.from({length:21},(_,i)=>[(i/20).toFixed(2),M.logistic(i/20).toFixed(3)])); },
  export(){ return { png:this.cv, csv:this._csv }; }
});

/* --- distribution-curve : Poisson or normal, reshaped by bus params -------- */
PanelLib["distribution-curve"] = (cfg)=>({
  id:"distribution-curve", accepts:["lambda","mu","sd","result"],
  mount(el){ this.cv=Object.assign(document.createElement("canvas"),{width:360,height:200}); el.appendChild(this.cv); },
  render(s){ const x=ctx(this.cv), W=this.cv.width,H=this.cv.height, pad=22; axes(x,W,H,pad);
    const rows=[];
    if(s.lambda!=null){ const L=+s.lambda, K=Math.max(8,Math.ceil(L*3));
      const pts=Array.from({length:K+1},(_,k)=>{ const p=M.poissonPMF(k,L); rows.push([k,p.toFixed(4)]); return [k/K,p]; });
      const mx=plot(x,pts,W,H,pad,css('--teal'));
      x.fillStyle=css('--ink-dim'); x.font="11px sans-serif"; x.textAlign="left";
      x.fillText(`Poisson λ=${L.toFixed(2)} · peak p=${mx.toFixed(3)}`,pad+4,14);
    } else { const mu=+(s.mu??.5), sd=+(s.sd??.15);
      const pts=Array.from({length:81},(_,i)=>{ const xv=i/80, p=M.normalPDF(xv,mu,sd);
        rows.push([xv.toFixed(3),p.toFixed(4)]); return [xv,p]; });
      plot(x,pts,W,H,pad,css('--teal'));
      x.fillStyle=css('--ink-dim'); x.font="11px sans-serif"; x.fillText(`Normal μ=${mu} σ=${sd}`,pad+4,14);
    }
    this._csv=toCSV(["x","p"],rows); },
  export(){ return { png:this.cv, csv:this._csv }; }
});

/* --- dose-curve : Hill sigmoid with EC50 marker ---------------------------- */
PanelLib["dose-curve"] = ()=>({
  id:"dose-curve", accepts:["ec50","hill","dose"],
  mount(el){ this.cv=Object.assign(document.createElement("canvas"),{width:360,height:200}); el.appendChild(this.cv); },
  render(s){ const x=ctx(this.cv), W=this.cv.width,H=this.cv.height, pad=22; axes(x,W,H,pad);
    const ec=+(s.ec50??50), n=+(s.hill??1.5), rows=[];
    const pts=Array.from({length:81},(_,i)=>{ const d=(i/80)*100, r=M.hill(d,ec,n);
      rows.push([d.toFixed(1),r.toFixed(4)]); return [i/80,r]; });
    plot(x,pts,W,H,pad,css('--teal'));
    const ex=pad+(ec/100)*(W-pad-6);
    x.strokeStyle=css('--amber'); x.setLineDash([4,4]); x.beginPath(); x.moveTo(ex,4); x.lineTo(ex,H-pad); x.stroke(); x.setLineDash([]);
    x.fillStyle=css('--amber'); x.font="11px sans-serif"; x.textAlign="left"; x.fillText(`EC50 ${ec}`,ex+4,16);
    if(s.dose!=null){ const dx=pad+(Math.min(100,+s.dose)/100)*(W-pad-6);
      x.fillStyle=css('--ink'); x.beginPath(); x.arc(dx,(H-pad)-M.hill(+s.dose,ec,n)*(H-pad-8),4,0,7); x.fill(); }
    this._csv=toCSV(["dose","response"],rows); },
  export(){ return { png:this.cv, csv:this._csv }; }
});

/* --- sensitivity-heat : 2-param outcome grid ------------------------------- */
PanelLib["sensitivity-heat"] = (cfg)=>({
  id:"sensitivity-heat", accepts:cfg.inputs.map(i=>i.id),
  mount(el){ this.cv=Object.assign(document.createElement("canvas"),{width:360,height:200}); el.appendChild(this.cv); },
  render(s){ const x=ctx(this.cv), W=this.cv.width,H=this.cv.height;
    const [a,b]=cfg.inputs.filter(i=>i.type==="slider").slice(0,2);
    if(!a||!b){ x.fillStyle=css('--ink-dim'); x.font="12px sans-serif"; x.fillText("needs 2 numeric inputs",10,20); return; }
    const N=24, cw=W/N, ch=H/N, rows=[];
    for(let i=0;i<N;i++) for(let j=0;j<N;j++){
      const va=a.min+(a.max-a.min)*(i/(N-1)), vb=b.min+(b.max-b.min)*(j/(N-1));
      const o=cfg.mockRun({...s,[a.id]:va,[b.id]:vb}), v=o.score;
      x.fillStyle = v<.34?"rgba(56,211,159,"+(.25+v)+")" : v<.66?"rgba(242,181,58,"+(.25+v)+")" : "rgba(232,102,61,"+(.25+v)+")";
      x.fillRect(i*cw,H-(j+1)*ch,cw+1,ch+1);
      if(i%6===0&&j%6===0) rows.push([va.toFixed(1),vb.toFixed(1),v.toFixed(3)]);
    }
    x.fillStyle=css('--ink'); x.font="11px sans-serif"; x.textAlign="left";
    x.fillText(`${a.label} →`,6,H-6); x.save(); x.translate(10,14); x.fillText(`↑ ${b.label}`,0,0); x.restore();
    this._csv=toCSV([a.id,b.id,"score"],rows); },
  export(){ return { png:this.cv, csv:this._csv }; }
});

/* --- outcome-table : renders result.table or a derived summary ------------- */
PanelLib["outcome-table"] = (cfg)=>({
  id:"outcome-table", accepts:["result"],
  mount(el){ this.el=el; },
  render(s){ const o=s.result||cfg.mockRun(s);
    const rows = o.table || Object.entries(o).filter(([,v])=>typeof v!=="object").map(([k,v])=>
      [k, typeof v==="number"?v.toFixed(3):v]);
    this.el.innerHTML = `<table><thead><tr><th>Field</th><th>Value</th></tr></thead><tbody>`+
      rows.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join("")+`</tbody></table>`;
    this._csv=toCSV(["field","value"],rows); },
  export(){ return { csv:this._csv }; }
});

/* --- before-after : text-transform input vs GPT output --------------------- */
PanelLib["before-after"] = ()=>({
  id:"before-after", accepts:["text","result"],
  mount(el){ this.el=el; },
  render(s){ const out=(s.result&&(s.result.text||s.result.output))||"—";
    this.el.innerHTML=`<div style="font-size:12px;color:var(--ink-dim);margin-bottom:4px">Input</div>
      <div style="background:#0a1512;border:1px solid var(--line);border-radius:8px;padding:8px;font-size:12px;margin-bottom:8px">${(s.text||"—")}</div>
      <div style="font-size:12px;color:var(--ink-dim);margin-bottom:4px">GPT output</div>
      <div style="background:#0a1512;border:1px solid var(--line);border-radius:8px;padding:8px;font-size:12px">${out}</div>`;
    this._html=this.el.innerHTML; },
  export(){ return { html:this._html }; }
});

/* --- stage-stepper : explainer stages from result.stages ------------------- */
PanelLib["stage-stepper"] = ()=>({
  id:"stage-stepper", accepts:["result","level"], i:0,
  mount(el){ this.el=el; },
  render(s){ const st=(s.result&&s.result.stages)||["Awaiting GPT stages…"];
    this.i=Math.min(this.i,st.length-1);
    this.el.innerHTML=`<div style="font-size:13px;line-height:1.55;min-height:64px">${st[this.i]}</div>
      <div style="display:flex;gap:6px;align-items:center;margin-top:8px">
        <button class="tool" id="pv">Prev</button><button class="tool" id="nx">Next</button>
        <span style="color:var(--ink-dim);font-size:12px">${this.i+1} / ${st.length}</span></div>`;
    this.el.querySelector("#pv").onclick=()=>{ this.i=(this.i-1+st.length)%st.length; this.render(s); };
    this.el.querySelector("#nx").onclick=()=>{ this.i=(this.i+1)%st.length; this.render(s); };
    this._json={stages:st,current:this.i}; },
  export(){ return { json:this._json }; }
});

/* --- stage-wheel : clickable N-stage wheel, the pipeline-designer core ----
   cfg.stages: [[title, desc, color], ...]. Writes `stage` to the bus; every
   other panel + the stepper list can read it to highlight the active stage.
   First implemented inline in rnai-precision-crop-designer; generalized here
   per the panel-ledger so the next pipeline-designer build inherits it. */
PanelLib["stage-wheel"] = (cfg,Bus)=>({
  id:"stage-wheel", accepts:["stage"], stage:0,
  mount(el){
    const size=Math.min(el.clientWidth||320,320), cx=size/2, cy=size/2, r0=size*0.24, r1=size*0.45;
    const svg=document.createElementNS("http://www.w3.org/2000/svg","svg");
    svg.setAttribute("viewBox",`0 0 ${size} ${size}`); svg.setAttribute("width","100%"); svg.style.display="block";
    const n=cfg.stages.length; this._segs=[];
    cfg.stages.forEach((st,i)=>{
      const a0=(i/n)*2*Math.PI-Math.PI/2+.035, a1=((i+1)/n)*2*Math.PI-Math.PI/2-.035;
      const P=(r,a)=>[cx+r*Math.cos(a),cy+r*Math.sin(a)];
      const [x0,y0]=P(r0,a0),[x1,y1]=P(r1,a0),[x2,y2]=P(r1,a1),[x3,y3]=P(r0,a1);
      const g=document.createElementNS("http://www.w3.org/2000/svg","g");
      g.setAttribute("tabindex","0"); g.setAttribute("role","button"); g.style.cursor="pointer";
      g.setAttribute("aria-label",`Stage ${i+1}: ${st[0]}`);
      const path=document.createElementNS("http://www.w3.org/2000/svg","path");
      path.setAttribute("d",`M${x0} ${y0} L${x1} ${y1} A${r1} ${r1} 0 0 1 ${x2} ${y2} L${x3} ${y3} A${r0} ${r0} 0 0 0 ${x0} ${y0} Z`);
      path.setAttribute("fill",st[2]); path.setAttribute("fill-opacity",".10");
      path.setAttribute("stroke",st[2]); path.setAttribute("stroke-width","1.4");
      g.appendChild(path);
      const am=(a0+a1)/2, [lx,ly]=P((r0+r1)/2,am);
      const t=document.createElementNS("http://www.w3.org/2000/svg","text");
      t.setAttribute("x",lx); t.setAttribute("y",ly); t.setAttribute("text-anchor","middle");
      t.setAttribute("font-size","10"); t.setAttribute("font-weight","700"); t.setAttribute("fill",st[2]);
      t.textContent=`${i+1}. ${st[0].split(" ").slice(0,2).join(" ")}`;
      g.appendChild(t);
      const pick=()=>{ this.stage=i; Bus.set({stage:i}); };
      g.addEventListener("click",pick);
      g.addEventListener("keydown",e=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); pick(); } });
      g._path=path; svg.appendChild(g); this._segs.push(g);
    });
    el.appendChild(svg); this._label=document.createElement("div");
    this._label.style.cssText="font-size:12px;color:var(--ink-dim,#64748b);margin-top:6px";
    el.appendChild(this._label);
  },
  render(s){ this.stage=Math.min(cfg.stages.length-1, s.stage??this.stage);
    this._segs.forEach((g,i)=>{ g._path.setAttribute("fill-opacity", i===this.stage?".55":".10");
      g._path.setAttribute("stroke-width", i===this.stage?"2.6":"1.4"); });
    this._label.textContent=`stage ${this.stage+1} · ${cfg.stages[this.stage][0].toLowerCase()}`; },
  export(){ return { json:{ stages:cfg.stages.map(s=>s[0]), current:this.stage } }; }
});

/* --- sequence-track : deterministic PRNG sequence + sliding-window
   composition chart. Retarget via cfg.sequenceTrack = { compositionId,
   lengthId, label, alphabetHigh, alphabetLow }; defaults match the biology
   case (GC%/length) it was first built for. -------------------------------- */
PanelLib["sequence-track"] = (cfg)=>{
  const opt=Object.assign({compositionId:"gc",lengthId:"len",label:"composition",unit:"%",
    alphabetHigh:["G","C"], alphabetLow:["A","T"]}, cfg.sequenceTrack||{});
  return { id:"sequence-track", accepts:[opt.compositionId,opt.lengthId],
    mount(el){ this.el=el;
      this.seqEl=document.createElement("div");
      this.seqEl.style.cssText="font-family:monospace;font-size:10.5px;word-break:break-all;opacity:.85;margin-bottom:6px";
      this.cv=Object.assign(document.createElement("canvas"),{width:340,height:120});
      this.readout=document.createElement("div"); this.readout.style.cssText="font-size:11.5px;color:var(--ink-dim,#64748b);margin-top:4px";
      el.appendChild(this.seqEl); el.appendChild(this.cv); el.appendChild(this.readout); },
    render(s){
      const comp=+s[opt.compositionId], len=Math.max(1,Math.round(+s[opt.lengthId]));
      let seed=(comp*7919+len*104729)>>>0;
      const rnd=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
      let seq=""; for(let i=0;i<len;i++){ const hi=rnd()<comp/100;
        seq += (hi?opt.alphabetHigh:opt.alphabetLow)[rnd()<.5?0:1]; }
      this.seqEl.textContent = seq.slice(0,180)+(len>180?"…":"");
      const x=ctx(this.cv), W=this.cv.width,H=this.cv.height, win=Math.max(4,Math.floor(len/40)), rows=[], pts=[];
      x.fillStyle=css('--panel-2')||"#f8fafc"; x.fillRect(0,0,W,H);
      x.strokeStyle=css('--line')||"#cbd5e1"; x.setLineDash([3,3]); x.beginPath();
      x.moveTo(0,H*.5); x.lineTo(W,H*.5); x.stroke(); x.setLineDash([]);
      for(let i=0;i+win<=len;i+=Math.max(1,Math.floor(len/60))){
        const seg=seq.slice(i,i+win), hi=[...seg].filter(c=>opt.alphabetHigh.includes(c)).length/win;
        pts.push([i/(len-win||1),hi]); rows.push([i,(hi*100).toFixed(1)]);
      }
      plot(x,pts,W,H,4,css('--teal')||"#16a34a");
      const actual=[...seq].filter(c=>opt.alphabetHigh.includes(c)).length/len*100;
      this.readout.textContent = `${len}${opt.lenUnit||"bp"} · ${opt.label} ${actual.toFixed(1)}${opt.unit}`;
      this._seq=seq; this._csv=toCSV(["window_start",opt.label+"_pct"],rows); },
    export(){ return { png:this.cv, csv:this._csv, json:{sequence:this._seq} }; }
  };
};

/* --- decay-curve : exponential decay of a result field, banded by risk ----
   Retarget via cfg.decayCurve = { rateField, bandField, days, label }.
   rateField is read from `result` as a half-life-like time constant. ------- */
PanelLib["decay-curve"] = (cfg)=>{
  const opt=Object.assign({rateField:"persist",bandField:"band",days:21,label:"days"}, cfg.decayCurve||{});
  return { id:"decay-curve", accepts:["result"],
    mount(el){ this.cv=Object.assign(document.createElement("canvas"),{width:340,height:150}); el.appendChild(this.cv);
      this.readout=document.createElement("div"); this.readout.style.cssText="font-size:11.5px;color:var(--ink-dim,#64748b);margin-top:4px";
      el.appendChild(this.readout); },
    render(s){ const o=s.result||(cfg.mockRun&&cfg.mockRun(s))||{};
      const rate=Math.max(.5,+o[opt.rateField]||1), band=o[opt.bandField]||"—";
      const col = band==="LOW"||band==="PASS" ? (css('--pass')||"#16a34a")
                : band==="HIGH"||band==="FAIL" ? (css('--fail')||"#dc2626")
                : (css('--amber')||"#d97706");
      const x=ctx(this.cv), W=this.cv.width,H=this.cv.height,p=8, rows=[], pts=[];
      for(let d=0; d<=opt.days; d++){ const v=Math.exp(-d/rate); pts.push([d/opt.days,v]); rows.push([d,(v*100).toFixed(2)]); }
      const mx=plot(x,pts,W,H,p,col);
      x.globalAlpha=.12; x.fillStyle=col; x.beginPath();
      pts.forEach(([a,b],i)=>{ const X=p+a*(W-p-4), Y=(H-p)-(b/mx)*(H-p-6); i?x.lineTo(X,Y):x.moveTo(X,Y); });
      x.lineTo(W-4,H-p); x.lineTo(p,H-p); x.closePath(); x.fill(); x.globalAlpha=1;
      x.fillStyle=col; x.fillRect(W-56,4,50,14);
      x.fillStyle="#fff"; x.font="700 9px sans-serif"; x.textAlign="center"; x.fillText(String(band),W-31,14);
      this.readout.textContent = `${opt.rateField} ≈ ${rate.toFixed(1)} ${opt.label} · ${opt.bandField} ${band}`;
      this._csv=toCSV(["day","residual_pct"],rows); },
    export(){ return { png:this.cv, csv:this._csv }; }
  };
};

/* ---------------- shared download layer (works for every panel) ------------ */
function saveBlob(b,n){ const u=URL.createObjectURL(b), a=document.createElement("a");
  a.href=u; a.download=n; a.click(); setTimeout(()=>URL.revokeObjectURL(u),400); }
function downloadPanel(p){ const o=p.export()||{};
  if(o.png)  o.png.toBlob(b=>saveBlob(b,p.id+".png"));
  if(o.csv)  saveBlob(new Blob([o.csv],{type:"text/csv"}), p.id+".csv");
  if(o.json) saveBlob(new Blob([JSON.stringify(o.json,null,2)],{type:"application/json"}), p.id+".json");
  if(o.html) saveBlob(new Blob([o.html],{type:"text/html"}), p.id+".html");
}
