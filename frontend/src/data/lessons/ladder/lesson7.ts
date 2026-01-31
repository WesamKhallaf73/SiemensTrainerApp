import type { Lesson } from '../types';

export const L7: Lesson = {
    id: "L7",
    type: "LAD",
    title: "Ladder 7: Priority Logic (STOP Overrides START)",
    description: `
## Introduction
Sometimes two signals affect the same action. In motor control, the classic example is:
- START requests the motor to run
- STOP requests the motor to stop

When both are active, the behavior must be predictable and safe:
> STOP must override START.

This lesson teaches a simple and correct priority method:
- START is allowed only when STOP is NOT active.

---

## Core Idea
To ensure STOP dominates, the run condition must include:
- START condition
- AND a blocking condition that STOP is not pressed

In logic form:
Q0.0 = I0.0 AND (NOT I0.1)

This guarantees:
- If STOP is pressed, the motor turns OFF immediately
- Even if START is pressed at the same time, STOP still blocks the output

---

## Task
Build one rung:
1. NO contact I0.0 (START)
2. NC contact I0.1 (STOP) as a series block
3. Coil Q0.0

---

## Expected Behavior
- Press START (I0.0=1) while STOP not pressed (I0.1=0) → Q0.0 ON
- Press STOP (I0.1=1) → Q0.0 OFF immediately
- If START and STOP are pressed together → Q0.0 stays OFF (STOP wins)

---

## Notes
This lesson focuses on priority, not memory.
If you want the motor to stay ON after releasing START, you will later combine this STOP priority with a latch (seal-in) or S/R logic.

`,
    initialCode: "",
    solutionCode: `A I0.0
AN I0.1
= Q0.0

------------------------
LADDER ILLUSTRATION
------------------------

RUNG (STOP overrides START):
|----[  I0.0  ]----[/ I0.1 ]----( Q0.0 )----|`,
    objectives: [
        "Implement STOP-over-START priority correctly",
        "Use an NC STOP contact to block the run command",
        "Predict behavior when START and STOP happen together",
        "Understand priority as a blocking condition"
    ]
};
