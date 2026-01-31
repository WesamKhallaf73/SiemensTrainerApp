import type { Lesson } from '../types';

export const L11: Lesson = {
    id: "L11",
    type: "LAD",
    title: "Ladder 11: TOFF Timer Basics (Off-Delay Timer)",
    description: `
## Introduction
This lesson introduces the **TOFF (Off-Delay) timer**, the opposite of TON.

Where a TON delays turning ON,
a **TOFF delays turning OFF**.

TOFF timers are used in situations where you want an output to stay ON for a short time after the input signal disappears.

Typical uses:
- Keep a fan running after a motor stops (cooling)
- Keep a valve energized briefly after flow stops
- Maintain alarm output until condition stabilizes
- Delay stopping a conveyor after sensor loss

Understanding TOFF completes your foundation in basic time control.

---

## How TOFF Works
A TOFF timer has similar signals to TON:

1. **IN** – When TRUE, Q becomes TRUE instantly  
2. **Preset Time (PT)** – Delay before turning OFF  
3. **Q (Done Bit)** – Stays TRUE until the off-delay expires  

### Behavior Summary
- When IN = 1 → Q = 1 immediately  
- When IN turns 0 → timer begins counting  
- After preset expires → Q turns 0  
- If IN returns to 1 before preset expires:
  - Timer resets  
  - Q stays ON  

TOFF **does not delay the turn ON**, only the turn OFF.

---

## Task
Build a TOFF timer with this behavior:

- While **I0.0** is TRUE:
  - Q0.0 is immediately ON  
- When **I0.0** becomes FALSE:
  - TOFF timer T2 starts a **3-second delay**  
  - After 3 seconds → Q0.0 turns OFF  

If I0.0 becomes TRUE again during the delay:
- Timer resets
- Q0.0 stays ON  

---

## Expected Behavior
1. Press I0.0 → Q0.0 instantly ON  
2. Release I0.0 → Q0.0 remains ON for 3 seconds  
3. After 3 seconds → Q0.0 turns OFF  
4. If you press I0.0 again during the 3-s countdown → timer resets and Q0.0 continues ON  

This is classic **Off-Delay** logic.

---

## Real-World Uses
- Ventilation fans that run after machine stops  
- Solenoid valves that maintain pressure briefly  
- Allowing slow-moving materials to clear a conveyor  
- Anti-chatter controls (sensor dropouts)

---

## Common Mistakes
- Expecting TOFF to delay the turn ON (it does not)  
- Forgetting that Q = 1 immediately when IN = 1  
- Expecting timer to continue counting if IN goes back ON (it resets)  

`,
    initialCode: "",
    solutionCode: `A I0.0
L S5T#3S
SF T2

A T2
= Q0.0

------------------------
LADDER ILLUSTRATION
------------------------

RUNG A (TOFF Start):
|----[ I0.0 ]--------( TOFF T2 , PT = 3s )----|

RUNG B (Use Timer Done Bit):
|----[  T2  ]--------(   Q0.0   )-------------|`,
    objectives: [
        "Understand TOFF timer operation",
        "Delay turning OFF an output while allowing immediate ON",
        "Use T2 done bit to energize an output",
        "Recognize reset behavior when IN returns TRUE"
    ]
};
