import type { Lesson } from '../types';

export const L19: Lesson = {
    id: "L19",
    type: "LAD",
    title: "Ladder 19: Using Counters for Machine Cycle Counting (Event Counter + Reset Logic)",
    description: `
## Introduction
Counters are often used not just to count button presses, but to count **machine cycles**:
- How many cycles a machine completed
- How many parts a robot placed
- How many times a valve actuated
- How many times a conveyor completed a full loop

In real systems, each cycle is usually detected by a **sensor pulse**, such as:
- A limit switch
- A proximity sensor
- An encoder zero-pulse
- A reed switch or optical flag

This lesson teaches how to build a **cycle counter**:
- Count each full machine cycle
- When a cycle target is reached, raise a signal (Q0.0)
- Provide a manual reset (I0.2) to start a new cycle batch

This is the most common pattern in real production lines.

---

## Problem Description
You have:
- **I0.0** → Cycle sensor (pulse per machine cycle)
- **I0.1** → System enable
- **I0.2** → Manual reset
- **C2** → Counter

The system must:
1. Count a cycle whenever:
   - I0.1 (enable) = TRUE  
   - I0.0 gives a pulse  
2. When the counter reaches **5 cycles**, set **Q0.0 = ON**
3. Reset the counter when I0.2 is pressed

This creates a classic “Cycle Complete After 5 Cycles” pattern.

---

## Real-World Uses
- Robot arm performs 5 welds → trigger next sequence
- Conveyor completes 5 loops → stop for inspection
- Hydraulic press makes 5 strokes → stop automatically
- Packaging machine fills 5 cartons → advance to next step

---

## Key Logic Concepts
### 1) Counter increments on real events  
A cycle sensor produces a **single clean pulse**, not a long ON signal.  
This ensures:
- One cycle = one increment  
No accidental multiple counts.

### 2) Counting only when enabled  
If the machine is disabled (I0.1 = 0), counting must not occur.

### 3) Using a comparator for completion  
Classic Siemens counters require a comparator to detect when the cycle limit is reached.

### 4) Manual reset  
The operator must be able to restart the cycle batch.

---

## Task
Implement a cycle counter:
- Only increment when I0.1 (enable) is TRUE
- Count each event on I0.0
- Count up using CU C2
- When C2 >= 5 → Q0.0 turns ON
- Reset count to 0 when I0.2 = TRUE

---

## Expected Behavior
### Example Run:
- Enable = 1  
- Sensor pulses → C2 = 1, 2, 3, 4  
- Pulse 5 → C2 = 5 → Q0.0 turns ON  
- Additional pulses: C2 continues counting  
- Press reset → C2 = 0 → Q0.0 turns OFF

---

## Common Mistakes
- Forgetting to AND the enable input before CU
- Expecting CU to stop at the limit
- Forgetting to reset counter value
- Using Q0.0 without checking C2 value properly

`,
    initialCode: "",
    solutionCode: `A I0.1
A I0.0
CU C 2

A I0.2
R C 2

L C 2
L 5
>=I
= Q0.0

------------------------
LADDER ILLUSTRATION
------------------------

RUNG A (Enable + Sensor Pulse → Count Up):
|----[ I0.1 ]----[ I0.0 ]------( CU C2 )--------------|

RUNG B (Manual Reset → Reset C2):
|----[ I0.2 ]------------------( R  C2 )--------------|

RUNG C (Comparator: If cycles >= 5 → Q0.0 ON):
|----[  (C2 >= 5)  ]----------( Q0.0 )----------------|`,
    objectives: [
        "Count machine cycles using CU C2",
        "Use an enable condition before the counter",
        "Reset the counter manually using I0.2",
        "Activate an output when C2 reaches a target value",
        "Apply counters to real-world machine cycle counting"
    ]
};
