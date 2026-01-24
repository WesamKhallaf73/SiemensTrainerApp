import type { Lesson } from '../types';

export const Lesson8: Lesson = {
    id: "8",
    title: "Lesson 8: MOVE & TRANSFER (L / T) – Working with Values",
    description: `
### 1. Why We Need L / T (MOVE)

Until now we mainly worked with single bits (I/Q/M).
But in real PLC work you also handle **values**:
- Speed setpoints
- Temperature readings
- Counters and totals
- Operator parameters

To work with values in AWL we use:

- **L** (Load): brings a value into the accumulator
- **T** (Transfer): writes the accumulator value to memory

So this is the basic “MOVE” pattern:

'''awl
L MW 20
T MW 22
'''

Meaning: copy MW20 → MW22.

---

### 2. Making Values Visible in Simulation

In a real plant, MW20 might come from an HMI.
In our simulator lesson, we need a way to **change MW20** so the student can see the effect.

We will simulate an operator choosing a setpoint:

- If Select Switch \`I 0.0\` is OFF → Setpoint = 100
- If Select Switch \`I 0.0\` is ON  → Setpoint = 300

We store that setpoint in \`MW 20\`.
Then we copy it into \`MW 22\` as the “working value”.

---

### 3. Safety Override Pattern (E-Stop)

If E-Stop \`I 0.1\` is ON, we must force the working value to 0
(even if the setpoint is 100 or 300).

This is a classic industrial pattern:
- normal calculation
- then safety override

---

### Your Task: Build a Visible Parameter Copy

**Requirements**
1. Use \`I 0.0\` to choose the value stored in MW20:
   - OFF → MW6 = 100
   - ON  → MW10 = 300
2. Copy MW6 → MW10 using L/T
3. If E-Stop \`I 0.1\` is ON → force MW22 = 0

You should be able to SEE MW6 and MW10 changing in the process window.

`,
    initialCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // 1) Simulate operator selecting a setpoint into MW6
    A I 0.0
    // TODO: If I0.0 is ON -> load 300, else load 100
    // Hint: Use JCN for ELSE behavior
    // TODO: T MW 6

    // 2) Normal copy: MW6 -> MW10
    // TODO: L MW 6
    // TODO: T MW 10

    // 3) Safety override: If E-Stop ON -> MW22 = 0
    A I 0.1
    // TODO: JC ZERO
    JU END

ZERO: NOP 0
    // TODO: L 0
    // TODO: T MW 10

END: NOP 0

END_ORGANIZATION_BLOCK`,
    solutionCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // Solution: Visible parameter + copy + safety override

    // --- 1) Build MW20 (operator setpoint) using I0.0 ---
A I 0.0
    JCN RR
        // if I0.0 == 0 -> set 100
    L 300
    JU SP

RR: NOP 0
    L 100

SP: NOP 0
    T MW 6

    // --- 2) Copy MW20 into MW22 (MOVE) ---
    L MW 6
    T MW 10

    // --- 3) Safety override (E-Stop) ---
    A I 0.1
    JC ZERO
    JU END

ZERO: NOP 0
    L 0
    T MW 10

END: NOP 0

END_ORGANIZATION_BLOCK`,
    objectives: [
        "Use L and T to move values (MW)",
        "Simulate an HMI/setpoint inside the lesson",
        "Use JCN/JU to implement IF/ELSE",
        "Apply an E-Stop override to force a safe value"
    ]
};

