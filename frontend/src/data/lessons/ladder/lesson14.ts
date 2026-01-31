import type { Lesson } from '../types';

export const L14: Lesson = {
    id: "L14",
    type: "LAD",
    title: "Ladder 14: Cascaded Timers (Step-by-Step Time Sequencing)",
    description: `
## Introduction
This lesson demonstrates how to build a **time-based sequence** using **two timers in series**.  
This is one of the most common real-world PLC patterns:

- Step 1 runs for a certain amount of time  
- When Step 1 finishes → Step 2 begins  
- Each step waits for the previous one to complete  

This is how timed sequences in conveyors, packaging, washing systems, and many industrial cycles are built.

---

## Concept: Cascaded Timing
A cascade means:

> Timer 2 can only start after Timer 1 has completely finished.

In ladder logic:
- Timer T5 begins when **Start condition is TRUE**  
- Timer T6 begins only when **T5.DN (done bit) is TRUE**  

This creates a sequence:
1. Step 1 → T5 timing  
2. Step 2 → T6 timing  

Both steps run one after another automatically.

---

## Behavior Summary
For this lesson we implement the following:

1. **Step 1**  
   - Starts when I0.0 = TRUE  
   - T5 runs for **3 seconds**  
   - Q0.0 turns ON after T5 finishes  

2. **Step 2**  
   - Begins only after T5 is done  
   - T6 runs for **4 seconds**  
   - Q0.1 turns ON after T6 finishes  

Both outputs demonstrate that the sequence is progressing correctly.

---

## Why Cascaded Timers Matter
This pattern appears in many real systems:

- Washing machines (Fill → Wash → Drain → Spin)  
- Conveyor lines (Entry delay → Move → Exit delay)  
- Oven/curing machines (Preheat → Bake → Cool)  
- Chemical dosing (Delay → Dose → Mix → Flush)  
- Start-up cycles (Purge → Ignite → Ramp-up)  

It is the foundation of creating automated **multi-step sequences**.

---

## Task
Build a two-step timed sequence:

### Step 1  
- Input: I0.0  
- Timer: T5 with PT = 3 seconds  
- Output: Q0.0 turns ON when T5 is done  

### Step 2  
- Trigger: T5 (timer done)  
- Timer: T6 with PT = 4 seconds  
- Output: Q0.1 turns ON when T6 is done  

Both timers should reset immediately if I0.0 turns FALSE.

---

## Expected Behavior
### When I0.0 becomes TRUE:
1. T5 begins timing  
2. After 3 seconds → Q0.0 turns ON  
3. T6 begins timing  
4. After 4 seconds → Q0.1 turns ON  

### When I0.0 becomes FALSE:
- Both timers reset  
- Q0.0 and Q0.1 turn OFF  
- Sequence restarts next time I0.0 is pressed

---

## Common Mistakes
- Starting both timers from the same input (breaks the sequence)  
- Forgetting that timers reset when I0.0 drops  
- Using OR instead of AND when chaining done bits  
- Attempting to place both timer blocks in one rung (incorrect structure)

`,
    initialCode: "",
    solutionCode: `A I0.0
L S5T#3S
SD T5

A T5
L S5T#4S
SD T6

A T5
= Q0.0

A T6
= Q0.1

------------------------
LADDER ILLUSTRATION
------------------------

RUNG A (Step 1 - Timer T5):
|----[ I0.0 ]--------( TON T5 , PT = 3s )----|

RUNG B (Step 2 - Timer T6 triggered by T5):
|----[  T5  ]--------( TON T6 , PT = 4s )----|

RUNG C (Output for Step 1):
|----[  T5  ]--------(  Q0.0  )--------------|

RUNG D (Output for Step 2):
|----[  T6  ]--------(  Q0.1  )--------------|`,
    objectives: [
        "Build a multi-step sequence using cascaded timers",
        "Trigger a timer using another timer's done bit",
        "Understand sequential timing logic",
        "Reset all steps when the start condition becomes FALSE"
    ]
};
