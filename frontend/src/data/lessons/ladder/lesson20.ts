import type { Lesson } from '../types';

export const L20: Lesson = {
    id: "L20",
    type: "LAD",
    title: "Ladder 20: Counter-Triggered Timed Pulse (C3 Reaches 5 → 2s Output)",
    description: `
## Introduction
In many industrial machines, an action must happen **after a certain number of events**, and it must happen **for a limited time only**.

Examples:
- After 5 products pass a sensor → activate a reject solenoid for 2 seconds
- After 10 machine cycles → run lubrication valve for 3 seconds
- After 20 strokes → turn on a warning lamp briefly
- After N items → sound a buzzer for a short duration

This is a very common pattern:

> Count events → when the count reaches a threshold → generate a timed pulse.

---

## Why a Pulse Timer Is Needed
If we used a TON (delay-on) timer, the timer “done bit” could stay ON as long as the trigger condition stays TRUE.

But in this lesson we need a different behavior:

✅ **Q0.0 must turn ON for 2 seconds only, then turn OFF automatically.**

So we use the **Pulse timer** (monostable) which your simulator implements using the STL instruction:

- **SE T4** (Pulse timer with PT preset)

This behaves like a TP-style pulse:
- Trigger once → output stays TRUE for PT time → then returns FALSE automatically.

---

## How This Lesson Works
Inputs:
- **I0.0**: Event pulse (e.g., sensor or button) to increment the counter
- **I0.1**: Reset batch (clear everything and restart)
- **I0.2**: Enable (system must be enabled to count)

Counter:
- **C3** counts pulses on I0.0 (only while enabled and not already triggered)

Pulse Timer:
- **T4** generates a **2-second pulse** using SE when the count reaches the limit

Memory bit:
- **M0.0** is used as a “triggered latch”
  - M0.0 = 0 → not triggered yet (allowed to trigger)
  - M0.0 = 1 → already triggered (block retrigger until reset)

---

## Task
Build logic that satisfies all rules:
1. While **I0.2** is TRUE and the batch has not triggered yet (M0.0 = 0):
   - Each pulse on **I0.0** increments **C3**
2. When **C3 >= 5** (and M0.0 = 0):
   - Generate a **2-second pulse** with **SE T4**
   - Turn ON **Q0.0** during that pulse
3. Prevent repeated pulsing:
   - Once triggered, set **M0.0 = 1**
4. Pressing **I0.1** resets the whole batch:
   - C3 returns to 0
   - M0.0 returns to 0
   - System is ready for a new batch

---

## Expected Behavior
- Enable I0.2 = 1
- Pulse I0.0 five times → counter reaches 5
- Immediately, Q0.0 turns ON for 2 seconds
- After 2 seconds, Q0.0 turns OFF automatically
- No further pulses occur even if C3 remains >= 5 (because M0.0 blocks retrigger)
- Press I0.1 reset → system is ready to count again from 0

---

## Common Mistakes
- Using TON instead of Pulse timer (output stays ON)
- Forgetting to block retriggering after the threshold is reached
- Resetting only M0.0 but not the counter (causes immediate retrigger)
- Counting without an enable condition
`,
    initialCode: "",
    solutionCode: `A I 0.2
AN M0.0
A I 0.0
CU C 3

A I 0.1
R C 3
R M0.0

AN M0.0
L C 3
L 5
>=I
L S5T#2S
SE T 4

AN M0.0
L C 3
L 5
>=I
S M0.0

A T 4
= Q 0.0

------------------------
LADDER ILLUSTRATION
------------------------

RUNG A (Count only if enabled AND not triggered yet):
|----[ I0.2 ]----[/ M0.0 ]----[ I0.0 ]----( CU C3 )----|

RUNG B (Reset batch):
|----[ I0.1 ]------------------( R C3 )-----------------|
|----[ I0.1 ]------------------( R M0.0 )---------------|

RUNG C (When C3 >= 5 -> generate a 2s pulse):
|----[/ M0.0 ]----[ (C3 >= 5) ]----( PULSE T4 , PT = 2s )----|

RUNG D (Latch "triggered" so it happens once per batch):
|----[/ M0.0 ]----[ (C3 >= 5) ]----( S M0.0 )---------------|

RUNG E (Output follows pulse timer):
|----[  T4  ]--------------------( Q0.0 )--------------------|`,
    objectives: [
        "Count events using CU and a classic comparator threshold",
        "Trigger a timed action using a pulse timer (SE)",
        "Prevent repeated triggering using a latch bit (M0.0)",
        "Reset counter and latch cleanly for a new batch",
        "Build a real industrial 'count then pulse' automation pattern"
    ]
};

