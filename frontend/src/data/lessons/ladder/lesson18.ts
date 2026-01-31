import type { Lesson } from '../types';

export const L18: Lesson = {
    id: "L18",
    type: "LAD",
    title: "Ladder 18: CTD Counter (Count Down) with SC (Set Counter) + Comparator",
    description: `
## Introduction
A **count-down counter** is used when you want to track “how many are left”.

Examples:
- Remaining items in a batch (produce 5 items, then stop)
- Remaining attempts (3 retries left)
- Remaining cycles before automatic shutdown
- Remaining packages in a carton

In classic Siemens-style counter logic:
- **CD** decreases the counter by 1 per valid event
- The counter does not automatically stop at zero
- To detect “finished,” the program uses a **comparator**

In this lesson, the counter is also **initialized (loaded) using SC (Set Counter)**.

---

## SC (Set Counter) – Loading the Starting Value
A count-down counter must start from a known number.

To load the starting value (example: 5):
1. Load the number into the accumulator
2. Set the counter using SC (Set Counter)

STL idea:
- L 5
- S C 1

This means: “Set counter C1 to start at 5.”

---

## What This Lesson Builds
You will build a countdown batch:

- Press **I0.1** to load the counter to 5 (start a batch)
- Each pulse on **I0.0** counts down by 1
- When the counter reaches 0 (or less), **Q0.0 turns ON**
- Loading again (I0.1) restarts the batch at 5 and turns Q0.0 OFF

This is the simplest correct “remaining items” pattern.

---

## Task
1. Use **I0.1** to initialize the counter C1 to **5** using SC.
2. Use **I0.0** to decrement C1 by 1 using CD.
3. Compare the counter value with 0:
   - If C1 <= 0 then Q0.0 = 1
   - Otherwise Q0.0 = 0

---

## Expected Behavior
1. Press I0.1 → counter is loaded to 5 → Q0.0 OFF
2. Press I0.0 five times:
   - After 1st -> 4
   - After 2nd -> 3
   - After 3rd -> 2
   - After 4th -> 1
   - After 5th -> 0 -> Q0.0 ON
3. Press I0.1 again → counter returns to 5 → Q0.0 OFF

---

## Common Mistakes
- Forgetting to load the counter before counting down
- Expecting CD to stop at zero automatically
- Not using a comparator to detect completion
- Holding I0.0 continuously instead of generating event pulses

`,
    initialCode: "",
    solutionCode: `A I0.1
L 5
S C 1

A I0.0
CD C 1

L C 1
L 0
<=I
= Q0.0

------------------------
LADDER ILLUSTRATION
------------------------

RUNG A (SC: Load Counter C1 = 5):
|----[ I0.1 ]--------------------( SC C1 := 5 )----|

RUNG B (CD: Count Down on I0.0):
|----[ I0.0 ]--------------------( CD C1 )---------|

RUNG C (Comparator: if C1 <= 0 then Q0.0 ON):
|----[  (C1 <= 0)  ]-------------( Q0.0 )----------|`,
    objectives: [
        "Initialize a countdown counter using SC (Set Counter) with a value",
        "Decrement the counter using CD on each event",
        "Detect completion using a comparator (C1 <= 0)",
        "Build a simple batch countdown pattern used in industry"
    ]
};
