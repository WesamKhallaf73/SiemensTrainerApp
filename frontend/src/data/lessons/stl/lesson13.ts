import type { Lesson } from '../types';

export const Lesson13: Lesson = {
    id: "13",
    title: "Lesson 13: Analog Scaling (RAW → Engineering Units)",
    description: `
### 1. Why Scaling Is Needed

Analog inputs (temperature, pressure, level) usually arrive to the PLC as **RAW integers** (counts).
Example: a sensor might send values from **0 to 27648** (or 0 to 32000 depending on hardware).

But engineers want to see **real units** like:
- °C
- bar
- %
- rpm

So we convert:
**RAW (INT) → Engineering Units (REAL)**

---

### 2. The Scaling Formula

A common linear scaling is:

\\[
EU = (RAW \\times K) + B
\\]

Where:
- **RAW** is an INT input word (e.g., IW2)
- **K** is a REAL scale factor
- **B** is a REAL offset

Example idea:
- RAW 0  → 0.0 bar
- RAW 20000 → 10.0 bar

So:

\\[
K = 10.0 / 20000 = 0.0005
\\]
\\[
B = 0.0
\\]

---

### 3. Important: INT → REAL Conversion

To do REAL math, we must convert the INT to REAL first.
Typical steps:
1) Load INT value (IW)
2) Convert to REAL
3) Multiply by REAL factor
4) Add REAL offset
5) Store into an MD location

---

### 4. Making It Visible in Simulation

We will simulate an analog RAW input using a switch:

- If \\(I0.0\\) is OFF → RAW = 0
- If \\(I0.0\\) is ON  → RAW = 20000

We store RAW in **MW10**, then scale it to bar and store result in **MD12**.

Expected result:
- If I0.0 = 0 → MD12 ≈ 0.0 bar
- If I0.0 = 1 → MD12 ≈ 10.0 bar

---

### Your Task: Scale RAW Pressure to bar

**Requirements**
1) Simulate RAW into **MW10**:
   - I0.0 OFF → MW10 = 0
   - I0.0 ON  → MW10 = 20000
2) Convert MW10 to REAL
3) Scale to bar using:
   - K = 0.0005
   - B = 0.0
4) Store final pressure (bar) into **MD12**

`,
    initialCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // 1) Simulate RAW analog value into MW10 using I0.0
    A I 0.0
    // TODO: If I0.0 == 0 -> L 0
    // TODO: If I0.0 == 1 -> L 20000
    // Hint: Use JCN and JU
    // TODO: T MW 10

    // 2) Convert MW10 (INT) to REAL and scale
    // EU(bar) = RAW * 0.0005 + 0.0

    // TODO: L MW 10
    // TODO: Convert INT to REAL (so REAL math works)
    // TODO: L 0.0005
    // TODO: *R
    // TODO: L 0.0
    // TODO: +R
    // TODO: T MD 12

END_ORGANIZATION_BLOCK`,
    solutionCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // Solution: Simulated RAW -> Scaled bar in MD12

        // 1) Simulate RAW into MW10 using I0.0
    A I 0.0
    JCN L0

    L 20000
    T MW 10
    JU L1

L0: NOP 0
    L 0
    T MW 10

L1: NOP 0
    // 2) Store K = 0.0005 into MD16 (REAL)
    L 0.0005
    T MD 16

    // 3) Convert MW10 (INT) to REAL
    L MW 10
    ITD
    DTR

    // 4) Scale: RAW * K
    L MD 16
    *R

    // 5) Store scaled pressure (bar) in MD12
    T MD 12

END_ORGANIZATION_BLOCK`,
    objectives: [
        "Understand why analog scaling is needed",
        "Convert integer RAW values to REAL",
        "Apply linear scaling with REAL math",
        "Store engineering units into an MD register"
    ]
};
