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
        pass

    def compile(self, source_code: str):
        diagnostics = []
        try:
            parser = AwlParser()
            parser.parseText(source_code)
            tree = parser.getParseTree()
            sim = AwlSim()
            sim.load(tree)
            sim.cpu.build()
            return True, [], tree
        except AwlSimError as e:
            diag = {
                "severity": "error",
                "message": e.getErrorMessage() if hasattr(e, 'getErrorMessage') else str(e),
                "file": "main.awl",
                "line": e.lineNumber if hasattr(e, 'lineNumber') else 0,
                "column": 0
            }
            diagnostics.append(diag)
            return False, diagnostics, None
        except Exception as e:
            traceback.print_exc()
            diag = {
                "severity": "error",
                "message": str(e),
                "file": "system",
                "line": 0,
                "column": 0
            }
            diagnostics.append(diag)
            return False, diagnostics, None

    def run_cycle(self, source_code: str, inputs: dict, previous_state: dict):
        success, diags, tree = self.compile(source_code)
        if not success:
            return {
                "ok": False,
                "diagnostics": diags
            }

        sim = AwlSim()
        sim.load(tree)
        sim.cpu.build()
        sim.startup()
        
        # Restore state
        self._restore_state(sim, previous_state)
        
        # Apply Inputs
        self._apply_inputs(sim, inputs)
        
        # Run Cycle
        trace = []
        try:
            sim.runCycle()
        except Exception as e:
            traceback.print_exc()
            return {
                "ok": False,
                "diagnostics": [{
                    "severity": "error",
                    "message": str(e),
                    "line": 0,
                    "column": 0
                }]
            }

        # Extract State and Outputs
        new_state = self._extract_state(sim)
        output_updates = self._extract_outputs(sim)
        
        return {
            "ok": True,
            "state": new_state,
            "outputs": output_updates,
            "diagnostics": []
        }

    def _restore_state(self, sim, state):
        if not state:
            return
            
        m_b64 = state.get("M")
        if m_b64:
            try:
                m_bytes = base64.b64decode(m_b64)
                # Ensure size matches? sim.cpu.flags.setDataBytes only writes available size
                sim.cpu.flags.setDataBytes(bytearray(m_bytes))
            except:
                pass

        # TODO: Restore DBs
        
        # Restore Outputs (Q) - effectively inputs to the next cycle calculation but usually Q is overwritten.
        # However, for latching, Q state matters if read?
        # S7 `U A 0.0` reads from process image output.
        q_b64 = state.get("Q")
        if q_b64:
             try:
                q_bytes = base64.b64decode(q_b64)
                sim.cpu.outputs.setDataBytes(bytearray(q_bytes))
             except:
                pass


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
        
        return {
            "M": base64.b64encode(m_bytes).decode('ascii'),
            "Q": base64.b64encode(q_bytes).decode('ascii')
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
