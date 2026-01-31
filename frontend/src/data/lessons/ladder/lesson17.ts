import type { Lesson } from '../types';

export const L17: Lesson = {
    id: "L17",
    type: "LAD",
    title: "Ladder 17: CTU Counter Basics (Count Up + Comparator)",
    description: `
## Introduction
Timers control behavior based on time.
Counters control behavior based on events.

Counters are used everywhere in automation:
- Counting products on a conveyor
- Counting machine cycles
- Counting pump starts
- Batch counting (run until N items are completed)

This lesson introduces the classic Siemens-style Count Up counter:
- The instruction CU increases the counter value by 1 per valid count event
- To stop at a target (like 3), the program checks the counter value using a comparator

---

## Key Idea: CU Increments, Comparator Decides
In classic STL logic, the CU instruction does one job:
- Increment the counter (C1)

To know you reached a target:
- Load the counter value
- Compare it with a constant (example: 3)
- Use the result to control an output

---

## Counting Events (Not Continuous Signals)
A counter should increase once per event (like a button press or sensor pulse).

The CU instruction increments on a rising edge of the rung condition (RLO):
- If the rung stays TRUE continuously, it should not count endlessly
- When it transitions from FALSE to TRUE, that is one count event

---

## Task
Build a simple batch counter:

- I0.0 is the count input
- Each press/pulse increments counter C1
- When the counter value becomes 3 or more, Q0.0 turns ON
- I0.1 resets the counter back to 0 and turns OFF Q0.0

---

## Expected Behavior
- First press of I0.0  -> C1 = 1 -> Q0.0 OFF
- Second press of I0.0 -> C1 = 2 -> Q0.0 OFF
- Third press of I0.0  -> C1 = 3 -> Q0.0 ON
- More presses          -> C1 = 4,5,... -> Q0.0 stays ON
- Press I0.1 reset      -> C1 = 0 -> Q0.0 OFF

---

## Real-World Uses
- Stop after producing N items
- Trigger an alarm after N retries
- Maintenance counters (service after N cycles)
- Batch processing and packaging

---

## Common Mistakes
- Expecting CU to have a built-in preset limit
- Forgetting to compare the counter value
- Using a steady signal that does not behave like an event
- Forgetting a reset method

`,
    initialCode: "",
    solutionCode: `A I0.0
CU C1

A I0.1
R C1

L C1
L 3
>=I
= Q0.0

------------------------
LADDER ILLUSTRATION
------------------------

RUNG A (Count Up on I0.0):
|----[ I0.0 ]--------------------( CU C1 )----|

RUNG B (Reset Counter on I0.1):
|----[ I0.1 ]--------------------( R  C1 )----|

RUNG C (Comparator: if C1 >= 3 then Q0.0 ON):
|----[  (C1 >= 3)  ]-------------( Q0.0 )-----|`,
    objectives: [
        "Use CU to increment a counter on events",
        "Reset the counter using R",
        "Use a comparator (C1 >= 3) to trigger an output",
        "Understand that the limit check is done in logic, not inside CU"
    ]
};
