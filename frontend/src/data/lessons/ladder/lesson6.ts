import type { Lesson } from '../types';

export const L6: Lesson = {
    id: "L6",
    type: "LAD",
    title: "Ladder 6: Interlocking Two Outputs (Mutual Exclusion)",
    description: `
## Introduction
Many real machines contain components that must **never** run at the same time.  
Examples include:

- Forward and Reverse motor commands  
- Heating and Cooling elements  
- Filling and Draining valves  
- Two pumps sharing a common line  
- Two modes where only one may be active

This situation requires an **interlock**, also known as **mutual exclusion logic**.

In ladder, an interlock is implemented by preventing one output from turning ON while the other output is already ON.

---

## What Is an Interlock?
An interlock is a safety or logic condition that ensures:

- If Output A is ON → Output B cannot turn ON  
- If Output B is ON → Output A cannot turn ON

This guarantees that both outputs are never energized at the same time.

---

## Core Idea
Each output’s rung contains:
1. A **start condition**  
2. A **NO contact of the other output**, acting as the interlock

Example:
- Q0.0 can only turn ON if Q0.1 is OFF  
- Q0.1 can only turn ON if Q0.0 is OFF

This prevents simultaneous activation.

---

## Ladder Logic Concept (Before Seeing STL)
Two rungs:

### Rung 1 (Output Q0.0)
- Start condition: I0.0  
- Interlock: Q0.1 must be OFF  

### Rung 2 (Output Q0.1)
- Start condition: I0.1  
- Interlock: Q0.0 must be OFF  

Using a NO contact of the opposite output ensures you cannot energize both.

---

## Why This Matters in Industry
Mutual exclusion is everywhere in automated systems.  
These patterns help prevent:

- Motor damage  
- Valve conflicts  
- Overpressure  
- Product contamination  
- Mechanical collisions

Understanding interlocks prepares you for mode selection, sequencing, pumps, and motion control later in the course.

---

## Task
Create two rungs:

### Rung A (Control Q0.0)
1. Operator command I0.0  
2. Interlock: Q0.1 must be OFF  
3. Output: Q0.0

### Rung B (Control Q0.1)
1. Operator command I0.1  
2. Interlock: Q0.0 must be OFF  
3. Output: Q0.1

This forces the PLC to choose **only one** output at a time.

---

## Expected Behavior
- Turn ON Q0.0 → Q0.1 will refuse to turn ON  
- Turn ON Q0.1 → Q0.0 will refuse to turn ON  
- If both commands are pressed at the same time, each output only activates if the interlock allows it  
- Turning OFF one output allows the other to turn ON

---

## Common Mistakes
- Using NC contacts incorrectly (should use NO for “other output is ON”)  
- Missing the interlock on one rung  
- Incorrectly placing the interlock before the start command  
- Forgetting that outputs used as contacts refer to the *process image*, not the real wiring

`,
    initialCode: "",
    solutionCode: `A I0.0
AN Q0.1
= Q0.0

A I0.1
AN Q0.0
= Q0.1

------------------------
LADDER ILLUSTRATION
------------------------

RUNG A (Q0.0 interlocked by Q0.1):
|----[  I0.0  ]----[/ Q0.1 ]----( Q0.0 )----|

RUNG B (Q0.1 interlocked by Q0.0):
|----[  I0.1  ]----[/ Q0.0 ]----( Q0.1 )----|`,
    objectives: [
        "Create mutual exclusion between two outputs",
        "Use output contacts as interlocks",
        "Ensure two opposing outputs can never energize at the same time",
        "Translate interlock logic into STL and ladder structures"
    ]
};

