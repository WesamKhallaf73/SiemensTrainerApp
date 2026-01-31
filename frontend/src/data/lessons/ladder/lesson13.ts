import type { Lesson } from '../types';

export const L13: Lesson = {
    id: "L13",
    type: "LAD",
    title: "Ladder 13: TON Reset Behavior (Why the Timer Drops When Input Drops)",
    description: `
## Introduction
This lesson explains one of the most important timing behaviors in PLC programming:

> A TON timer **resets immediately** when its input becomes FALSE.

This behavior is intentional and is the foundation of how Siemens TON works.  
Understanding it prevents timing mistakes in real projects and helps students design reliable machine sequences.

---

## Why TON Resets Immediately
A TON timer is **non-retentive**.  
This means:
- It does not remember accumulated time  
- It does not continue counting after IN goes FALSE  
- It does not hold Q after IN goes FALSE

TON is designed this way to ensure precise timing that always reflects the **current state** of the input.

### Example scenario:
- I0.0 becomes TRUE  
- TON starts timing toward 5 seconds  
- After 3 seconds, I0.0 becomes FALSE  
- TON resets:
  - Elapsed time = 0  
  - Q = 0  

If I0.0 becomes TRUE again:
- Timer restarts from 0  
- Q will turn ON only after a full 5 seconds again  

---

## Why This Is Important in Real Automation
TON’s reset behavior is used for:

### 1. Safety Delays  
If the operator releases a start button early, the machine must **not** start unexpectedly later.

### 2. Stabilizing signals  
If a sensor flickers, the timer resets, preventing false activation.

### 3. Correct step sequencing  
Each step must receive a full, uninterrupted timing period.

### 4. Debouncing  
If a signal is not stable long enough, TON rejects it.

Without this reset behavior, machines would behave unpredictably.

---

## Task
Implement a TON timer with the following behavior:

- When **I0.0** is TRUE:
  - Start TON T4 with a **4-second delay**
- If I0.0 remains TRUE for the full 4 seconds:
  - Q0.0 turns ON
- If I0.0 becomes FALSE before the 4 seconds:
  - Timer resets immediately
  - Q0.0 remains OFF

This demonstrates the full-reset behavior.

---

## Expected Behavior
### Case 1 — Normal Delay ON
1. Press I0.0 → Timer starts  
2. Keep holding for 4 seconds  
3. Q0.0 becomes TRUE  

### Case 2 — Interrupted Signal
1. Press I0.0 → Timer starts  
2. Release after 1–3 seconds  
3. Timer resets  
4. Q0.0 never turns ON  

### Case 3 — Reattempt
1. Press again → Timer restarts from 0  
2. Requires full 4 seconds again  

### Summary
> TON does not “save progress.”  
> It must see a **continuous** ON period.

---

## Real-World Uses
- Delay-before-start logic  
- Reject unstable sensor readings  
- Protect motors from rapid cycling  
- Require operators to hold buttons deliberately  
- Ensure timing compliance in sequences

---

## Common Mistakes
- Expecting Q to turn ON after two partial presses  
- Thinking the timer should “pause” when IN drops  
- Using TON for retentive timing (RT / S_ODT are used for that)  
- Forgetting that Q drops instantly when IN drops  
`,
    initialCode: "",
    solutionCode: `A I0.0
L S5T#4S
SD T4

A T4
= Q0.0

------------------------
LADDER ILLUSTRATION
------------------------

RUNG A (TON Start - 4s Delay):
|----[  I0.0  ]--------( TON T4 , PT = 4s )----|

RUNG B (Use Timer Done Bit):
|----[   T4   ]--------(   Q0.0   )------------|`,
    objectives: [
        "Understand why TON resets immediately when input drops",
        "Observe non-retentive timing behavior",
        "Recognize the need for continuous input to complete timing",
        "Use TON reliably for safe and stable timing conditions"
    ]
};
