import type { Lesson } from '../types';

export const L21: Lesson = {
    id: "L21",
    type: "LAD",
    title: "Ladder 21: Debouncing a Sensor Using Pulse Timer (SE) + Clean Counter Event",
    description: `
## Introduction
Real industrial sensors often produce **noisy signals**:
- Photoelectric sensors flicker at object edges.
- Mechanical limit switches bounce for 10–30 ms.
- Pushbuttons chatter when pressed.
- Proximity sensors may oscillate near threshold.

If you feed such a signal **directly** into a counter, a single object may be counted
2, 3, or even 5 times. This is unacceptable in real machines.

The solution is **debouncing**.

---

## Why Debounce?
Debouncing ensures:
- **One object = one count**
- No double counting
- No false triggers
- Stable counter values

Without debounce, production counts will always drift and cause defects.

---

## Pulse Timer (SE) as Debounce Filter
A Pulse Timer (SE) generates a **fixed-duration pulse** no matter how long the input stays ON.

Flow:
1. I0.0 TRUE → immediately generate a short pulse (e.g., 50 ms)
2. While the timer is active, further sensor bounces are ignored
3. Counter increments **exactly once**

This is the industry standard method.

---

## What This Lesson Builds
We debounce input I0.0 and count clean pulses:

- I0.0 → noisy sensor
- T5 → 50 ms pulse timer debouncing input
- C5 → counter of clean events
- I0.1 → reset
- Q0.0 → ON when count >= 10

A very realistic factory pattern.

---

## Task
1. Detect any TRUE on I0.0 and start a 50ms pulse: SE T5
2. Count **only the pulse**, not the raw sensor
3. Reset counter using I0.1
4. Turn ON Q0.0 when counter reaches 10

---

## Expected Behavior
- One clean increment per object
- Sensor noise completely removed
- Counter stable and accurate
- Reset clears counter
- Output activates at target count

---

## Common Mistakes
- Connecting I0.0 directly to CTU (causes double counts)
- Using TON instead of SE
- Forgetting reset logic
- Comparing counter value incorrectly

`,
    initialCode: "",
    solutionCode: `// Debounce Sensor + Count Clean Pulses + Output on 10 Items

// Debounce Pulse (50 ms)
A I 0.0
L S5T#50MS
SE T 5

// Count the clean debounced pulse
A T 5
CU C 5

// Reset counter
A I 0.1
R C 5

// Compare: If C5 >= 10 then Q0.0 ON
L C 5
L 10
>=I
= Q0.0

------------------------
LADDER ILLUSTRATION
------------------------

RUNG A (Debounce using Pulse Timer):
|----[ I0.0 ]-----------------( PULSE T5 , 50ms )-----------|

RUNG B (Count clean pulse only):
|----[  T5  ]-----------------( CU C5 )----------------------|

RUNG C (Reset counter):
|----[ I0.1 ]-----------------( R C5 )-----------------------|

RUNG D (Output ON when count >= 10):
|----[ (C5 >= 10) ]-----------( Q0.0 )-----------------------|`,
    objectives: [
        "Use pulse timer (SE) to debounce noisy sensor inputs",
        "Count events only once per real object",
        "Reset counter cleanly",
        "Use comparator for counter threshold",
        "Combine timer, counter, and comparison logic in industrial manner"
    ]
};
