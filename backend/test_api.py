from fastapi.testclient import TestClient
from main import app
import base64

client = TestClient(app)

def test_validate_success():
    print("Testing Validation Success...")
    src = """
    ORGANIZATION_BLOCK OB 1
    BEGIN
        NOP 0
    END_ORGANIZATION_BLOCK
    """
    resp = client.post("/api/validate", json={"source_code": src})
    assert resp.status_code == 200
    assert resp.json()["ok"] is True
    print("Pass")

def test_validate_fail():
    print("Testing Validation Fail...")
    src = """
    ORGANIZATION_BLOCK OB 1
    BEGIN
        %%% GARBAGE %%%
    END_ORGANIZATION_BLOCK
    """
    resp = client.post("/api/validate", json={"source_code": src})
    assert resp.status_code == 200
    data = resp.json()
    if data["ok"]:
        print("Unexpected success with GARBAGE!")
    assert data["ok"] is False
    print("Pass")

def test_run_logic():
    print("Testing Run Logic (I0.0 -> Q0.0)...")
    src = """
    ORGANIZATION_BLOCK OB 1
    BEGIN
        U I 0.0
        = Q 0.0
    END_ORGANIZATION_BLOCK
    """
    
    resp = client.post("/api/run", json={
        "source_code": src,
        "inputs": {"I0.0": True}
    })
    assert resp.status_code == 200
    assert resp.json()["outputs"].get("Q0.0") is True
    print("Pass")

if __name__ == "__main__":
    try:
        test_validate_success()
        test_validate_fail()
        test_run_logic()
        print("ALL TESTS PASSED")
    except Exception as e:
        print(f"FAILED: {e}")
