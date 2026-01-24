import type { Lesson } from '../types';

export const Lesson9: Lesson = {
    id: "9",
    title: "Lesson 9: Comparisons (>=I, <I, ==I) – Threshold Alarms",
    description: `
### 1. Why Comparisons Matter

Most PLC decisions are based on values:
- Temperature too high
- Speed too low
- Tank level reached limit
- Count reached target

A comparison produces a TRUE/FALSE result (RLO),
which you can assign to an output.

---

### 2. The Comparison Pattern

The common AWL pattern is:

1) Load actual value
2) Load threshold
3) Compare (>=I, <I, ==I)
4) Use the result to drive an output

Example:

'''awl
L MW 10
L 80
>=I
= Q 0.0
'''

---

### 3. Making It Visible in Simulation

In a real plant, MW10 could come from an analog input or HMI.
In this lesson, we will simulate a value using a switch:

- If \`I 0.0\` is OFF → Temperature = 60
- If \`I 0.0\` is ON  → Temperature = 90

We store this temperature into **MW10** so the student can see it.
Then we compare MW10 with the threshold 80.

---

### Your Task: Over-Temperature Alarm

**Requirements**
1) Build a simulated temperature value into MW10:
   - \`I 0.0\` OFF → MW10 = 60
   - \`I 0.0\` ON  → MW10 = 90
2) If MW10 >= 80 → Turn ON Alarm \`Q 0.0\`
3) Otherwise → Alarm OFF

Try toggling \`I 0.0\` and watch MW10 and Q0.0.

`,
    initialCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // 1) Simulate temperature into MW10 using I0.0
    A I 0.0
    // TODO: If I0.0 == 0 -> load 60
    // TODO: If I0.0 == 1 -> load 90
    // Hint: Use JCN and JU (IF / ELSE)
    // TODO: T MW 10

    // 2) Compare MW10 with threshold 80
    // TODO: L MW 10
    // TODO: L 80
    // TODO: >=I
    // TODO: = Q 0.0

END_ORGANIZATION_BLOCK`,
    solutionCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // Solution: Simulated temperature + threshold alarm

    // --- 1) Build MW10 ---
    A I 0.0
    JCN TTT      // if I0.0 is 0 -> 60
    L 90
    JU SS

 TTT: NOP 0
    L 60

 SS: NOP 0
    T MW 10

    // --- 2) Compare and alarm ---
    L MW 10
    L 80
    >=I
    = Q 0.0

END_ORGANIZATION_BLOCK`,
    objectives: [
        "Load and compare integer values",
        "Use >=I to create a threshold alarm",
        "Create visible simulation values using MW1..MW20"
    ]
};


