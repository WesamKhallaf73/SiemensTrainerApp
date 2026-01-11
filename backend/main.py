from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional, Any
from engine import STLEngine

app = FastAPI(title="SIMATIC STL Trainer Pro API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = STLEngine()
# Track last loaded code to decide when to reload simulation
last_loaded_code = None

class Diagnostic(BaseModel):
    severity: str
    message: str
    file: str
    line: int
    column: int

class ValidationRequest(BaseModel):
    source_code: str
    cpu_type: str = "300"

class ValidationResponse(BaseModel):
    ok: bool
    diagnostics: List[Diagnostic]

class RunRequest(BaseModel):
    source_code: str
    inputs: Dict[str, bool] # "I0.0": true
    # previous_state is deprecated/ignored by backend but accepted for compatibility
    previous_state: Optional[Dict[str, Any]] = None 

class RunResponse(BaseModel):
    ok: bool
    diagnostics: List[Diagnostic]
    outputs: Optional[Dict[str, bool]] = None
    state: Optional[Dict[str, Any]] = None

@app.get("/")
def read_root():
    return {"message": "SIMATIC STL Trainer Pro Backend is running"}

@app.post("/api/validate", response_model=ValidationResponse)
def validate_project(request: ValidationRequest):
    print(f"DEBUG: validate source len: {len(request.source_code)}")
    ok, diags = engine.compile_check(request.source_code)
    return ValidationResponse(ok=ok, diagnostics=[Diagnostic(**d) for d in diags])

@app.post("/api/run", response_model=RunResponse)
def run_simulation(request: RunRequest):
    global last_loaded_code
    
    # Reload project if code changed or first run
    if last_loaded_code != request.source_code or engine.sim is None:
        print("Loading new source code...")
        ok, diags = engine.load_project(request.source_code)
        if not ok:
            return RunResponse(
                ok=False,
                diagnostics=[Diagnostic(**d) for d in diags]
            )
        last_loaded_code = request.source_code

    try:
        # Step simulation
        result = engine.run_cycle(request.inputs)
        # result has { ok, diagnostics, state, outputs }
        return RunResponse(
            ok=result["ok"],
            diagnostics=[Diagnostic(**d) for d in result.get("diagnostics", [])],
            outputs=result.get("outputs"),
            state=result.get("state")
        )
    except Exception as e:
        # Fallback for unexpected errors
        return RunResponse(
            ok=False,
            diagnostics=[Diagnostic(severity="error", message=str(e), file="system", line=0, column=0)]
        )

@app.post("/api/reset")
def reset_simulation():
    global last_loaded_code
    engine.reset()
    last_loaded_code = None
    return {"state": {}}
