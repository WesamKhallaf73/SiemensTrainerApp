import type { Lesson } from '../types';

export const L8: Lesson = {
    id: "L8",
    type: "LAD",
    title: "Ladder 8: Start/Stop Latch with Priority (Seal-In + STOP Dominates)",
    description: `
## Introduction
In Lesson 7 you learned a critical rule: **STOP must override START**.
But Lesson 7 did not include memory. In many real machines, the motor must keep running after you release the START pushbutton.

So in this lesson you will build the most common industrial motor circuit:

- Press START once → motor runs (latched)
- Release START → motor continues running
- Press STOP → motor stops immediately
- STOP overrides everything (even if START is pressed)

This pattern is called:
- Seal-in circuit
- Self-hold latch
- Start/Stop latch

---

## Core Idea
To add “memory” without using S/R coils, we use a **parallel branch**:

- One branch contains the START button (I0.0)
- The other branch contains a holding contact of the motor output (Q0.0)

But to make STOP dominate, we place the STOP contact (NC) **in series before the branch**.

Logic form:
Q0.0 = (NOT I0.1) AND (I0.0 OR Q0.0)

Meaning:
- If STOP is pressed → NOT I0.1 becomes FALSE → output forced OFF
- If STOP is not pressed:
  - Pressing START turns ON Q0.0
  - Then Q0.0 holds itself ON through the parallel branch

---

## Task
Build one rung with these elements:

1. NC contact: I0.1 (STOP) in series at the left
2. A parallel branch containing:
   - Top branch: NO contact I0.0 (START)
   - Bottom branch: NO contact Q0.0 (Seal-in / holding contact)
3. Coil: Q0.0

---

## Expected Behavior
### Normal run
- STOP released (I0.1 = 0)
- Press START (I0.0 = 1) → Q0.0 turns ON
- Release START (I0.0 = 0) → Q0.0 stays ON because the holding branch is TRUE

### Stop action (priority)
- Press STOP (I0.1 = 1) → Q0.0 turns OFF immediately
- Even if START is pressed at the same time, STOP still forces OFF
- Release STOP → Q0.0 remains OFF until START is pressed again

This is the standard motor starter behavior.

---

## Real-World Notes
- This is a control pattern, not a safety-rated circuit.
- In real panels, emergency stop is hardwired via safety relays or safety PLC.
- But the logic here is exactly what you will see in most PLC programs for a run command.

---

## Common Mistakes
- Putting STOP inside the branch (then one branch may bypass STOP)
- Forgetting to use Q0.0 as a holding contact
- Using NC/NO incorrectly for STOP
- Expecting the motor to restart automatically after STOP release (it should not)

`,
    initialCode: "",
    solutionCode: `AN I0.1
A(
    A I0.0
    O Q0.0
)
= Q0.0

------------------------
LADDER ILLUSTRATION
------------------------

RUNG (Latch + STOP dominates):
|----[/ I0.1 ]----+----[  I0.0  ]----+----( Q0.0 )----|
|                 |                  |                 |
|                 +----[  Q0.0  ]----+-----------------|`,
    objectives: [
        "Build a seal-in (self-hold) latch that keeps an output ON after START is released",
        "Ensure STOP dominates by placing NC STOP in series before the branch",
        "Understand the logic: Q = NOT STOP AND (START OR Q)",
        "Create correct industrial motor Start/Stop behavior"
    ]
};
