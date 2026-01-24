import type { Lesson } from '../types';

export const Lesson19: Lesson = {
    id: "19",
    title: "Lesson 19: Fault Latching & Manual Reset",
    description: `
### 1. Why Fault Latching?

In real machines:
- A **fault** must remain visible.
- It must NOT reset when the signal clears.
- The operator must press a **RESET button** to clear it.

Example faults:
- Overload
- Overtemperature
- Low-level
- Jam detected
- Emergency stop active

We will build a classic fault latch.

---

### 2. Fault Latch Behavior

1) If \`I0.3 = 1\` → FAULT detected → Latch turns ON  
2) Even if \`I0.3 = 0\`, fault stays ON  
3) When \`I0.4 = 1\` → operator Reset → latch clears  

We store the latched fault in \`M0.4\`.

---

### 3. Visible Output
\`Q0.0\` = FAULT lamp  
Shows the student the fault condition.

---

### Expected Results

- Press I0.3 → Q0.0 = 1 (fault ON)
- Release I0.3 → Q0.0 stays 1
- Press I0.4 → Q0.0 becomes 0 (fault cleared)

This is the same behavior used in real MCCs and PLC alarm systems.

`,

    initialCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // -----------------------------
    // 1) Detect fault condition
    // TODO: A I 0.3
    // TODO: S M 0.4       // latch fault

    // -----------------------------
    // 2) Manual reset
    // TODO: A I 0.4
    // TODO: R M 0.4       // clear latch

    // -----------------------------
    // 3) Fault lamp
    // TODO: A M 0.4
    // TODO: = Q 0.0

END_ORGANIZATION_BLOCK`,

    solutionCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // ----------- 1) Fault detection -----------
    A I 0.3        // Fault signal
    S M 0.4        // Latch fault


    // ----------- 2) Manual reset -----------
    A I 0.4        // Reset button
    R M 0.4


    // ----------- 3) Fault lamp -----------
    A M 0.4
    = Q 0.0        // FAULT indicator

END_ORGANIZATION_BLOCK`,

    objectives: [
        "Build a persistent fault latch",
        "Understand why faults must not auto-reset",
        "Practice Set/Reset logic in safety context",
        "Implement manual reset button logic"
    ]
};
