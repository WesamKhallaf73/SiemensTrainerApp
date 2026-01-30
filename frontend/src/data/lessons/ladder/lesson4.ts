import type { Lesson } from '../types';

export const L4: Lesson = {
    id: "L4",
    type: "LAD",
    title: "Ladder 4: Set/Reset Coils (S/R Memory Control)",
    description: `
## Introduction
In previous lessons, you learned how to use NO contacts, NC contacts, and how to create a self-holding latch using a parallel branch.
Now we introduce a very important PLC concept: Set (S) and Reset (R) coils.

These coils provide controlled “memory” behavior:
- Set forces a bit to 1 and it stays 1
- Reset forces a bit to 0 and it stays 0
until the opposite instruction changes it again.

This is widely used in real control systems because it keeps your program readable when logic becomes larger.

---

## What Are Set and Reset Coils?

### Set (S)
- When the rung is TRUE, S makes the target bit TRUE (1).
- After that scan, the bit remains TRUE even if the rung becomes FALSE.
- It will remain TRUE until a Reset happens.

### Reset (R)
- When the rung is TRUE, R makes the target bit FALSE (0).
- After that scan, the bit remains FALSE until a Set happens again.

---

## Why Use S/R Instead of the Branch Latch?
The latch in Lesson 3 keeps the output ON using a feedback branch inside one rung.
S/R coils are useful when:
- Start logic and Stop logic are easier to read as separate rungs
- Multiple conditions can Set the same output
- Multiple conditions can Reset the same output
- You want clean structure in larger programs

Both styles are valid. This lesson adds a second professional tool to your ladder toolbox.

---

## Priority / Best Practice Note
If Set and Reset are both executed for the same bit in the same scan, the final result depends on execution order.
A common best practice is:
- Put the Reset rung AFTER the Set rung if you want Stop to dominate
- Or design the logic so Stop blocks Set

In this lesson, we keep it simple: the Stop rung is placed after the Start rung, so Stop effectively dominates.

---

## Task
Create two rungs:

### Rung 1 (Start)
If I0.0 is TRUE → Set output Q0.0

### Rung 2 (Stop)
If I0.1 is TRUE → Reset output Q0.0

---

## Expected Behavior
- Press I0.0 → Q0.0 turns ON and stays ON after release
- Press I0.1 → Q0.0 turns OFF and stays OFF after release
- Press Start again → Q0.0 turns ON again

---

## Real-World Uses
S/R coils are commonly used for:
- Motor run commands
- Pump control
- Alarm latching + reset pushbuttons
- Mode selection (Auto/Manual)
- Sequence steps (state bits)
`,
    initialCode: "",
    solutionCode: `A I0.0
S Q0.0

A I0.1
R Q0.0

------------------------
LADDER ILLUSTRATION
------------------------

RUNG 1 (SET):
|----[  I0.0  ]----( S Q0.0 )----|

RUNG 2 (RESET):
|----[  I0.1  ]----( R Q0.0 )----|`,
    objectives: [
        "Use Set (S) to latch an output ON",
        "Use Reset (R) to latch an output OFF",
        "Build Start/Stop memory using two separate rungs",
        "Understand why S/R is useful in larger ladder programs"
    ]
};
