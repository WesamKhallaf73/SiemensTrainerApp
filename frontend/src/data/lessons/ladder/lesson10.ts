import type { Lesson } from '../types';

export const L10: Lesson = {
    id: "L10",
    type: "LAD",
    title: "Ladder 10: TON Timer Basics (On-Delay Timer)",
    description: `
## Introduction
This lesson introduces one of the most important PLC functions:  
the **TON (On-Delay) timer**.

A TON timer delays an output from turning ON until its input has been TRUE for a specified amount of time.  
It is used everywhere in automation:

- Delay motor start after a command  
- Wait before opening a valve  
- Stabilization time after a sensor triggers  
- Noise filtering and debouncing  
- Time-based sequencing  

Understanding TON behavior is essential to working with real Siemens PLC logic.

---

## How TON Works
A TON block has three important signals:

1. **IN** – The condition that starts the timer  
2. **Preset Time (PT)** – The delay period (e.g., 5 seconds)  
3. **Q (Done Bit)** – Becomes TRUE after the preset time expires  

### Behavior Summary
- When **IN = 1**, timer begins counting  
- When elapsed time ≥ preset time → **Q = 1**  
- If **IN becomes 0 before finishing**, the timer **resets**  
- When reset:
  - Elapsed time = 0  
  - Q = 0  

TON is **not retentive** — meaning it loses its accumulated time when IN goes FALSE.

---

## Ladder Structure (Conceptual)
A TON appears as a block, but your app uses STL, so the ladder teaching is conceptual:

- Input energizes the TON  
- TON's output Q drives a coil  
- Preset time is loaded before calling TON

---

## Task
Create a TON timer with the following behavior:

- When **I0.0** becomes TRUE:
  - Start TON T1 with a delay of **5 seconds**
  - After the 5-second delay, energize **Q0.0**

- When **I0.0** turns FALSE:
  - Timer resets immediately  
  - Q0.0 turns OFF  

This is the classic “delay ON” function.

---

## Expected Behavior
1. Press I0.0 → nothing happens yet  
2. After 5 seconds → Q0.0 turns ON  
3. Release I0.0 before 5s → timer resets, Q0.0 stays OFF  
4. Release I0.0 after Q0.0 ON → Q0.0 turns OFF immediately  
5. TON never latches on its own

---

## Real-World Use Cases
- Delaying the start of motors  
- Giving sensors time to stabilize  
- Avoiding false alarms  
- Timing sequences in conveyors or packaging machines  
- Delayed energizing of solenoids or fans  

---

## Common Mistakes
- Expecting TON to remember time after input drops (it resets)  
- Expecting Q output to remain ON after input drops (it won't)  
- Forgetting to load the S5T time before the timer instruction  

`,
    initialCode: "",
    solutionCode: `A I0.0
L S5T#5S
SD T1

A T1
= Q0.0

------------------------
LADDER ILLUSTRATION
------------------------

RUNG A (TON Start):
|----[ I0.0 ]--------( TON T1 , PT = 5s )----|

RUNG B (Use Timer Done Bit):
|----[  T1  ]--------(   Q0.0   )------------|`,
    objectives: [
        "Understand TON operation (delay ON, immediate reset)",
        "Start a TON using an input condition",
        "Use timer done bit (T1) to energize an output",
        "Use S5T formatted preset time"
    ]
};
