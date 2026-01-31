import type { Lesson } from '../types';

export const L15: Lesson = {
    id: "L15",
    type: "LAD",
    title: "Ladder 15: Blinking Output (Flasher Using Two TON Timers)",
    description: `
## Introduction
A blinking (flashing) output is used in almost every industrial system:

- Alarm lamps that blink to attract attention
- Status indicators (RUN / FAULT)
- Warning beacons
- Maintenance reminders
- “Heartbeat” signals that prove the control logic is alive

A blinking output is simply an output that repeatedly turns ON and OFF with a stable timing pattern.

This lesson builds a clean and reliable blinker using:
- Two TON timers (T1 and T2)
- One internal memory bit (M0.0) to represent the current phase

This approach is very common in practice because it is predictable and easy to troubleshoot.

---

## Target Behavior
While **I0.0** is TRUE (Enable):
- **Q0.0** blinks continuously:
  - ON for 1 second
  - OFF for 1 second
  - Repeats forever

When **I0.0** becomes FALSE:
- Blinking stops immediately
- Q0.0 turns OFF
- The phase memory resets

---

## Core Idea (Two-Phase Blink)
The blinker has two phases:

### Phase A (ON phase)
- M0.0 = 1
- Q0.0 is ON
- TON T1 times 1 second
- When T1 is done → switch to OFF phase (reset M0.0)

### Phase B (OFF phase)
- M0.0 = 0
- Q0.0 is OFF
- TON T2 times 1 second
- When T2 is done → switch to ON phase (set M0.0)

M0.0 is the “phase bit” that decides which timer runs and whether the lamp is ON or OFF.

---

## Task
Build a blinking output with:
- Enable input: **I0.0**
- Output: **Q0.0**
- ON time: 1 second using **T1**
- OFF time: 1 second using **T2**
- Phase bit: **M0.0**

---

## Expected Behavior
- Turn I0.0 ON → Q0.0 starts blinking
- Leave I0.0 ON → blinking continues indefinitely
- Turn I0.0 OFF → Q0.0 stops blinking and stays OFF
- Turn I0.0 ON again → blinking restarts cleanly

---

## Common Mistakes
- Driving Q0.0 directly from a timer without a stable phase bit
- Forgetting to reset the phase bit when disabled
- Trying to blink with only one timer without a proper toggle event
- Using OR logic where mutual alternation is required

`,
    initialCode: "",
    solutionCode: `AN I0.0
R M0.0

A I0.0
A M0.0
L S5T#1S
SD T1

A T1
R M0.0

A I0.0
AN M0.0
L S5T#1S
SD T2

A T2
S M0.0

A I0.0
A M0.0
= Q0.0

------------------------
LADDER ILLUSTRATION
------------------------

RUNG 1 (Disable -> reset phase):
|----[/ I0.0 ]--------------------( R M0.0 )----|

RUNG 2 (ON phase timing - TON T1 runs when M0.0 = 1):
|----[ I0.0 ]----[  M0.0 ]--------( TON T1 , PT = 1s )----|

RUNG 3 (When T1 done -> go to OFF phase):
|----[  T1  ]----------------------( R M0.0 )--------------|

RUNG 4 (OFF phase timing - TON T2 runs when M0.0 = 0):
|----[ I0.0 ]----[/ M0.0 ]--------( TON T2 , PT = 1s )----|

RUNG 5 (When T2 done -> go to ON phase):
|----[  T2  ]----------------------( S M0.0 )--------------|

RUNG 6 (Output ON only during ON phase):
|----[ I0.0 ]----[  M0.0 ]--------( Q0.0 )-----------------|`,
    objectives: [
        "Generate a stable blinking output using two TON timers",
        "Use M0.0 as a phase/state bit to alternate timing",
        "Blink Q0.0 with a predictable ON/OFF cycle (1s ON / 1s OFF)",
        "Stop and reset the blinker cleanly when I0.0 is disabled"
    ]
};

