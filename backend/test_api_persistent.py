import requests
import time

API_URL = "http://localhost:8000/api"

# Code: Start Timer T0 as On-Delay (SE) 10s when I0.0 is True
src = """
ORGANIZATION_BLOCK OB 1
BEGIN
    A I 0.0
    L S5T#5S
    SE T 0
    A T 0
    = Q 0.0
END_ORGANIZATION_BLOCK
"""

def test_api_persistent():
    print("Cycle 1: Start Timer")
    # I0.0 = True -> Timer starts.
    # We send "Reset" first to be clean.
    requests.post(f"{API_URL}/reset")
    
    # Run loop
    for i in range(10):
        # We simulate 10 cycles, waiting 0.5s between each. Total 5s.
        resp = requests.post(f"{API_URL}/run", json={
            "source_code": src,
            "inputs": {"I0.0": True},
            "previous_state": None # Should be ignored now
        })
        
        if resp.status_code != 200:
            print("HTTP Error:", resp.text)
            break
            
        data = resp.json()
        if not data["ok"]:
            print("FAIL:", data["diagnostics"])
            break
        
        state = data["state"]
        t0 = state.get("T", {}).get("0", {})
        q0_on = data["outputs"].get("Q0.0", False) if data["outputs"] else False
        
        rem = t0.get("remaining", -1)
        running = t0.get("running", False)
        
        print(f"Cycle {i}: T0 Rem={rem:.3f}, Run={running}, Q0={q0_on}")
        
        time.sleep(0.5)

if __name__ == "__main__":
    test_api_persistent()
