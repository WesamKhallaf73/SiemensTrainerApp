import type { Lesson } from '../types';

export const L22: Lesson = {
    id: "L22",
    type: "LAD",
    title: "Ladder 22: Counter-Controlled Output (Count ≥ Preset)",
    description: `
## Introduction
In many PLC programs, the counter is not the final goal by itself.
Instead, the counter value is used to **enable or disable outputs**.

This is one of the most common production patterns:

> Count items → when the count reaches a target → activate an output.

This lesson is the bridge between:
- simple “counting”
and
- machine steps / batch logic / data-driven automation.

In classic Siemens-style STL counters:
- The counter instruction (CU/CD) just changes the counter value.
- To make decisions (like “reached target”), we use the **counter’s current value (CV)** with a **comparator**.

---

## What You Will Build
You will build a batch counter that controls a motor output.

Inputs:
- **I0.0** = Item sensor pulse (one pulse per item)
- **I0.1** = Reset batch

Counter:
- **C6** counts items

Output:
- **Q0.0** turns ON when the production batch is complete

Target:
- When **C6 >= 6**, batch is complete → Q0.0 ON

This is the simplest version of “batch complete” logic.

---

## Task
1. Count items using I0.0:
   - Each pulse increments counter C6 using CU
2. Use I0.1 to reset counter C6
3. Compare the counter value to a preset number:
   - If **C6 >= 6**, then Q0.0 ON
   - Otherwise Q0.0 OFF

---

## Expected Behavior
- At start: C6 = 0 → Q0.0 OFF
- After 1 pulse: C6 = 1 → Q0.0 OFF
- ...
- After 6 pulses: C6 = 6 → Q0.0 ON
- More pulses: C6 continues (7,8,...) → Q0.0 stays ON
- Press reset: C6 = 0 → Q0.0 OFF again

This matches real batch behavior: once the target is reached, a “batch complete” signal stays active until reset.

---

## Real-World Uses
- Stop a conveyor after N items pass
- Trigger packaging step after N products
- Enable a robot pick operation after N detections
- Maintenance required after N cycles
- Alarm after N failed attempts

---

## Common Mistakes
- Expecting CU to include a built-in preset limit
- Forgetting to reset the counter, which keeps the output ON forever
- Comparing incorrectly (using == instead of >= can miss the moment)
- Using raw sensor instead of a clean pulse input (bounce causes double count)

`,
    initialCode: "",
    solutionCode: `A I0.0
CU C 6

A I0.1
R C 6

L C 6
L 6
>=I
= Q0.0

------------------------
LADDER ILLUSTRATION
------------------------

RUNG A (Count Up on each item pulse):
|----[ I0.0 ]--------------------( CU C6 )------------------|

RUNG B (Reset batch counter):
|----[ I0.1 ]--------------------( R  C6 )------------------|

RUNG C (Counter-controlled output: C6 >= 6):
|----[ (C6 >= 6) ]---------------( Q0.0 )-------------------|`,
    objectives: [
        "Use a counter’s current value (CV) to control an output",
        "Use >= comparator to detect reaching a batch target reliably",
        "Reset the batch cleanly so the system can run again",
        "Understand how counters become machine-step conditions"
    ]
};
