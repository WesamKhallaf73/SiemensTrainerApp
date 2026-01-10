from fastapi.testclient import TestClient
from main import app
import json

client = TestClient(app)

def test_run_logic():
    print("Testing Run Logic (A I 0.0 -> = Q 0.0)...")
    src = """
    ORGANIZATION_BLOCK OB 1
    BEGIN
        A I 0.0
        = Q 0.0
    END_ORGANIZATION_BLOCK
    """
    
    resp = client.post("/api/run", json={
        "source_code": src,
        "inputs": {"I0.0": True}
    })
    print("Response:", resp.json())
    assert resp.status_code == 200
    assert resp.json()["ok"] is True
    assert resp.json()["outputs"].get("Q0.0") is True
    print("Pass")

if __name__ == "__main__":
    try:
        test_run_logic()
    except Exception as e:
        print(f"FAILED: {e}")
