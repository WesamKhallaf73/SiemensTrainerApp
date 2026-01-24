import type { Lesson } from '../types';

export const Lesson14: Lesson = {
    id: "14",
    title: "Lesson 14: REAL Comparisons & Analog Alarms",
    description: `
### 1. Why REAL Comparisons Matter

Once an analog signal is scaled into engineering units (bar, °C, %, etc.),  
we can create alarms:

- **High Pressure Alarm**
- **High Temperature Alarm**
- **Level Too High**
- **Flow Too Low**

These alarms use REAL comparisons:
- \`>=R\`  → greater or equal
- \`>R\`   → greater than
- \`<R\`   → less than
- \`<=R\`  → less or equal

---

### 2. Scaling Reminder (From Lesson 13)

We already know how to convert RAW (INT) to REAL:

1. Load MW10 (RAW)
2. Convert INT → REAL with \`ITD\` + \`DTR\`
3. Multiply by REAL scale factor (0.0005)
4. Store the result in MD12 (pressure in bar)

Now we will compare MD12 with a threshold.

---

### 3. Your Task: High Pressure Alarm

**Requirements:**

1. Simulate RAW pressure into MW10:
   - If \\(I0.0 = 0\\) → RAW = 0
   - If \\(I0.0 = 1\\) → RAW = 20000  
     (Which gives ~10.0 bar after scaling)

2. Scale RAW → bar into MD12 (use REAL math)

3. Compare MD12 with **8.0 bar**
   - If MD12 ≥ 8.0 → turn ON alarm Q0.0
   - Else → Q0.0 OFF

You should see in memory:
- MD12 = 10.0 (41 20 00 00 hex) when I0.0 = 1  
- MD12 = 0.0 when I0.0 = 0  

Q0.0 should turn ON only when I0.0 = 1.

`,
    initialCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // 1) Simulate RAW analog value into MW10
    A I 0.0
    // TODO: JCN L0
    // TODO: L 20000
    // TODO: JU L1
L0: NOP 0
    // TODO: L 0
L1: NOP 0
    // TODO: T MW 10

    // 2) Scale RAW -> bar into MD12
    // TODO: L MW 10
    // TODO: ITD
    // TODO: DTR
    // TODO: L 0.0005
    // TODO: *R
    // TODO: T MD 12

    // 3) High alarm at 8.0 bar
    // TODO: L MD 12
    // TODO: L 8.0
    // TODO: >=R
    // TODO: = Q 0.0

END_ORGANIZATION_BLOCK`,
    solutionCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // Solution: Scaled pressure + high alarm

    // --- RAW simulation ---
    A I 0.0
    JCN L0
    L 20000
    JU L1
L0: NOP 0
    L 0
L1: NOP 0
    T MW 10

    // --- Scaling (bar) ---
    L MW 10
    ITD
    DTR
    L 0.0005
    *R
    T MD 12

    // --- High alarm at 8.0 bar ---
    L MD 12
    L 8.0
    >=R
    = Q 0.0

END_ORGANIZATION_BLOCK`,
    objectives: [
        "Use REAL comparisons (>=R)",
        "Build a high analog alarm",
        "Combine scaling and alarms in one program",
        "Interpret REAL values in memory (IEEE-754 format)"
    ]
};

