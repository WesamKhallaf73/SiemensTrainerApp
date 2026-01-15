import sys
import os
import time

# Add current dir to path
sys.path.append(os.getcwd())

from engine import STLEngine

CODE = """
ORGANIZATION_BLOCK OB 1
BEGIN
    A I 0.0
    L 10
    SD T 1
    
    A T 1
    = Q 0.0
END_ORGANIZATION_BLOCK
"""

def main():
    engine = STLEngine()
    success, diags = engine.load_project(CODE)
    if not success:
        print("Compilation Failed:", diags)
        return

    print("Project Loaded. Running 10 rapid cycles...")
    
    start_time = time.time()
    
    for i in range(10):
        res = engine.run_cycle({"I0.0": True})
        
        # Extract remaining time from timer '1'
        # engine.py returns "remaining" in seconds (float) usually
        t_data = res['state']['T'].get('1', {})
        remaining = t_data.get('remaining', 0.0)
        status = t_data.get('status', 0)
        q0 = res['outputs'].get('Q0.0', False)
        
        print(f"Cycle {i}: RealTime={time.time()-start_time:.4f}s | T1 Rem={remaining} | Q0={q0}")
        
        # Simulate slight delay (e.g., 10ms per request)
        # If we run instantly, let's see what happens
        # time.sleep(0.01)

    print("Done.")

if __name__ == "__main__":
    main()
