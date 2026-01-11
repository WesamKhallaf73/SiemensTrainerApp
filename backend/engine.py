import awlsim.core.cpu
# Monkeypatching awlsim to fix missing references in cpu.py
try:
    from awlsim.awlcompiler.tokenizer import RawAwlOB, RawAwlFC, RawAwlFB, RawAwlDB
    awlsim.core.cpu.RawAwlOB = RawAwlOB
    awlsim.core.cpu.RawAwlFC = RawAwlFC
    awlsim.core.cpu.RawAwlFB = RawAwlFB
    awlsim.core.cpu.RawAwlDB = RawAwlDB
except ImportError:
    pass

from awlsim.core.main import AwlSim
from awlsim.awlcompiler.tokenizer import AwlParser
from awlsim.common.exceptions import AwlSimError
import base64
import traceback

class STLEngine:
    def __init__(self):
        self.sim = None

    def load_project(self, source_code: str):
        """
        Compiles the project and initializes the persistent simulation.
        Returns (success, diagnostics).
        """
        diagnostics = []
        try:
            parser = AwlParser()
            parser.parseText(source_code)
            tree = parser.getParseTree()
            
            self.sim = AwlSim()
            self.sim.load(tree)
            self.sim.cpu.build()
            self.sim.startup()
            
            return True, []
        except AwlSimError as e:
            diag = {
                "severity": "error",
                "message": e.getErrorMessage() if hasattr(e, 'getErrorMessage') else str(e),
                "file": "main.awl",
                "line": e.lineNumber if hasattr(e, 'lineNumber') else 0,
                "column": 0
            }
            diagnostics.append(diag)
            self.sim = None
            return False, diagnostics
        except Exception as e:
            diag = {
                "severity": "error",
                "message": str(e),
                "file": "system",
                "line": 0,
                "column": 0
            }
            diagnostics.append(diag)
            self.sim = None
            return False, diagnostics

    def compile_check(self, source_code: str):
        """
        Static checks only, does not affect running sim.
        """
        diagnostics = []
        try:
            parser = AwlParser()
            parser.parseText(source_code)
            tree = parser.getParseTree()
            sim = AwlSim()
            sim.load(tree)
            sim.cpu.build()
            return True, []
        except AwlSimError as e:
             diag = {
                "severity": "error",
                "message": e.getErrorMessage() if hasattr(e, 'getErrorMessage') else str(e),
                "file": "main.awl",
                "line": e.lineNumber if hasattr(e, 'lineNumber') else 0,
                "column": 0
            }
             diagnostics.append(diag)
             return False, diagnostics
        except Exception as e:
            diag = {
                "severity": "error",
                "message": str(e),
                "file": "system",
                "line": 0,
                "column": 0
            }
            diagnostics.append(diag)
            return False, diagnostics

    def run_cycle(self, inputs: dict):
        """
        Steps the existing simulation.
        Expects `load_project` to have been called successfully first.
        """
        if not self.sim:
            return {
                "ok": False,
                "diagnostics": [{
                    "severity": "error",
                    "message": "Simulation not loaded. Please validate/load code first.",
                    "file": "system",
                    "line": 0,
                    "column": 0
                }]
            }

        # Apply Inputs
        self._apply_inputs(self.sim, inputs)
        
        # Run Cycle
        try:
            self.sim.runCycle()
        except Exception as e:
            traceback.print_exc()
            return {
                "ok": False,
                "diagnostics": [{
                    "severity": "error",
                    "message": str(e),
                    "file": "system",
                    "line": 0,
                    "column": 0
                }]
            }

        # Extract State and Outputs
        new_state = self._extract_state(self.sim)
        output_updates = self._extract_outputs(self.sim)
        
        return {
            "ok": True,
            "state": new_state,
            "outputs": output_updates,
            "diagnostics": []
        }

    def reset(self):
        self.sim = None

    def _apply_inputs(self, sim, inputs):
        # inputs: { "I0.0": True, ... }
        for key, value in inputs.items():
            if key.startswith("I") and "." in key:
                try:
                    parts = key[1:].split(".")
                    byte_idx = int(parts[0])
                    bit_idx = int(parts[1])
                    # Read current byte to preserve other bits if needed
                    current_val = sim.cpu.fetchInputByte(byte_idx)
                    if value:
                        current_val |= (1 << bit_idx)
                    else:
                        current_val &= ~(1 << bit_idx)
                    sim.cpu.storeInputByte(byte_idx, current_val)
                except Exception as e:
                    print(f"Error applying input {key}: {e}")

    def _extract_state(self, sim):
        m_bytes = sim.cpu.flags.getDataBytes()
        q_bytes = sim.cpu.outputs.getDataBytes()
        
        # Extract Timers
        timers = {}
        for i, t in enumerate(sim.cpu.timers):
            if t.status != 0 or t.running:
                timers[str(i)] = {
                    "status": t.status,
                    "running": t.running,
                    "remaining": t.remaining,
                    "deadline": getattr(t, 'deadline', 0.0)
                }

        # Extract DataBlocks (DB)
        dbs = {}
        try:
            for db in sim.cpu.allDBs():
                if db and hasattr(db, 'structInstance') and hasattr(db.structInstance, 'memory'):
                    data = db.structInstance.memory.getDataBytes()
                    dbs[str(db.index)] = base64.b64encode(data).decode('ascii')
        except Exception as e:
            print(f"Error extracting DBs: {e}")

        return {
            "M": base64.b64encode(m_bytes).decode('ascii'),
            "Q": base64.b64encode(q_bytes).decode('ascii'),
            "T": timers,
            "DB": dbs
        }

    def _extract_outputs(self, sim):
        q_values = {}
        q_bytes = sim.cpu.outputs.getDataBytes()
        for i, val in enumerate(q_bytes):
            if val != 0:
                for bit in range(8):
                    if val & (1 << bit):
                        q_values[f"Q{i}.{bit}"] = True
                    else:
                        q_values[f"Q{i}.{bit}"] = False
        return q_values
