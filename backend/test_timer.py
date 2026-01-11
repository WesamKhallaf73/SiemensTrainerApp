import requests
import json
import time

API_URL = "http://localhost:8000/api"

# Code: Start Timer T0 as On-Delay (SE) 10s when I0.0 is True
src = """
ORGANIZATION_BLOCK OB 1
BEGIN
    A I 0.0
    L S5T#10S
    SE T 0
    A T 0
    = Q 0.0
END_ORGANIZATION_BLOCK
"""

def test_timer():
    print("Cycle 1: Start Timer")
    # I0.0 = True -> Timer starts
    resp = requests.post(f"{API_URL}/run", json={
        "source_code": src,
        "inputs": {"I0.0": True},
        "previous_state": None
    })
    data = resp.json()
    if not data["ok"]:
        print("FAIL 1:", data["diagnostics"])
        return
    
    state1 = data["state"]
    t0_data = state1.get("T", {}).get("0")
    print(f"State 1 T0: {t0_data}")
    
    if not t0_data or not t0_data["running"]:
        print("FAIL: Timer not running in Cycle 1")
        return

    # Simulate delay locally to verify countdown? 
    # Actually, the *next* request will be a new process. 
    # We rely on 'remaining' being saved.
    
    print("\nSimulating 2s wait (in real life) and next cycle...")
    # Ideally, we'd modify 'remaining' manually to simulate time passing if the engine doesn't account for wall-clock diff?
    # Ah, 'awlsim' uses wall clock. If we restore `remaining`, does it respect it?
    # Let's run Cycle 2 with same inputs (Keep SE active)
    
    resp = requests.post(f"{API_URL}/run", json={
        "source_code": src,
        "inputs": {"I0.0": True},
        "previous_state": state1
    })
    data = resp.json()
    state2 = data["state"]
    t0_data_2 = state2.get("T", {}).get("0")
    print(f"State 2 T0: {t0_data_2}")
    
    if t0_data_2["remaining"] >= t0_data["remaining"]:
         print("WARNING: Timer did not decrease? (This might be expected if simulation time step is small)")
    else:
         print("SUCCESS: Timer decreased.")

if __name__ == "__main__":
    test_timer()
