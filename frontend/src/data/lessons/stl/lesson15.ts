import type { Lesson } from '../types';

export const Lesson15: Lesson = {
    id: "15",
    title: "Lesson 15: Edge Detection (FP / FN) – One-Shot Events",
    description: `
### 1. Why Edge Detection Is Needed

A PLC executes your code many times per second (scan cycles).
If a pushbutton stays ON for 1 second, the PLC could execute the same logic hundreds of times.

Sometimes you need an action to happen **only once** when the signal changes:
- Count one package
- Count one button press
- Trigger a single event (one-shot)
- Start a sequence step only once

This is why we use **edge detection**.

---

### 2. FP and FN

- **FP M x.y** = Positive edge (0 → 1).  
  TRUE for **one scan** when the input rises.

- **FN M x.y** = Negative edge (1 → 0).  
  TRUE for **one scan** when the input falls.

Both instructions require a memory bit (M x.y) to store the previous state.

---

### 3. Making It Visible in Simulation

We will build a “one-shot counter”:

- Press and hold \\(I0.0\\) → the count increases by **1 only** (not continuously)
- Release \\(I0.0\\) → no counting
- Reset \\(I0.1\\) → clears the count to 0

We store the count in **MW10**, so the student can see it changing.

---

### Your Task: Count Button Presses (One-Shot)

**Requirements**
1) Use **FP** on \\(I0.0\\) to create a one-scan pulse per press.
2) Each pulse increments **MW10** by 1.
3) Reset button \\(I0.1\\) sets MW10 back to 0.

Try holding I0.0 ON: MW10 must NOT keep increasing.
It should increase only once per press.

`,
    initialCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // 0) Reset count if I0.1 pressed
    A I 0.1
    // TODO: JC L0

    // 1) Generate one-shot pulse on I0.0 (rising edge)
    A I 0.0
    // TODO: FP M 0.0
    // TODO: JC L1

    JU L2

L0: NOP 0
    // TODO: L 0
    // TODO: T MW 10
    JU L2

L1: NOP 0
    // TODO: Increment MW10 by 1:
    // TODO: L MW 10
    // TODO: L 1
    // TODO: +I
    // TODO: T MW 10

L2: NOP 0

END_ORGANIZATION_BLOCK`,
    solutionCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // Solution: One-shot counting using FP

    // Reset
    A I 0.1
    JC L0

    // Rising edge pulse on I0.0
    A I 0.0
    FP M 0.0
    JC L1

    JU L2

L0: NOP 0
    L 0
    T MW 10
    JU L2

L1: NOP 0
    L MW 10
    L 1
    +I
    T MW 10

L2: NOP 0
// hint : each time you change I0.0 from 0 to 1 watch the memory table
// to see changes 
// I0.1 changing fro 0 to 1 reset memory
END_ORGANIZATION_BLOCK`,
    objectives: [
        "Understand why PLC scan needs edge detection",
        "Use FP for rising-edge one-shot pulses",
        "Increment a counter once per press (no overcounting)",
        "Reset a value cleanly with jumps"
    ]
};
