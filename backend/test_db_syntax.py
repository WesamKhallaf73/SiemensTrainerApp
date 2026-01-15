import sys
import os
sys.path.append(os.getcwd())
from engine import STLEngine

# Test Code: Define DB 1 and try to write to it using fully qualified syntax
CODE = """
DATA_BLOCK DB 1
    STRUCT
        Val : INT := 0;
    END_STRUCT
BEGIN
END_DATA_BLOCK

ORGANIZATION_BLOCK OB 1
BEGIN
    L 55
    T DB1.DBW 0   // Testing this syntax
END_ORGANIZATION_BLOCK
"""

def main():
    engine = STLEngine()
    success, diags = engine.load_project(CODE)
    if not success:
        print("Compilation Failed:", diags)
        return

    print("Compilation Success. Running cycle...")
    res = engine.run_cycle({})
    
    # Check if DB 1 has value 55 (ASCII '7' is 55? No, int value)
    # The engine returns base64 encoded byte arrays for DBs
    # We just want to ensure it didn't crash.
    
    if res['ok']:
        print("Cycle Ran Successfully.")
    else:
        print("Cycle Failed:", res['diagnostics'])

if __name__ == "__main__":
    main()
