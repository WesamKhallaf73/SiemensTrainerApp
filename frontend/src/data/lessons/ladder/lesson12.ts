import type { Lesson } from '../types';

export const L12: Lesson = {
    id: "L12",
    type: "LAD",
    title: "Ladder 12: Pulse Timer (Monostable SE) – Generating a Fixed Pulse",
    description: `
## Introduction
This lesson introduces the concept of a **monostable pulse timer** — often known as a **TP (pulse)** timer in Siemens PLCs.

A pulse timer produces a **fixed-duration output pulse** when its input is activated.  
Your app displays this timer as a block with a **PT (preset time)** label, which is correct for ladder diagrams.

In the Statement List (STL) behind the scenes, this app uses the instruction **SE Tn** to implement the pulse behavior.  
Functionally, this behaves like a Siemens TP timer:  
- A rising edge on IN triggers a pulse  
- Q turns ON for exactly the preset duration  
- Pulse length never changes based on how long IN is pressed  
- Repeated activations produce repeated pulses

This is one of the most important timing tools in automation.

---

## How the Pulse Timer Works
When the input signal turns TRUE:
1. A pulse begins immediately  
2. Q stays TRUE for the preset time  
3. After time expires → Q turns OFF  
4. Keeping the input TRUE does **not** extend the pulse  
5. A new pulse is produced only when the input returns to 0 and then goes 1 again

This makes it ideal for:
- One-shot actions  
- Debouncing buttons  
- Triggering counters  
- Producing time-limited actions  
- Stabilizing noisy sensor transitions  

---

## Task
Create a pulse timer that behaves as follows:

- When **I0.0** becomes TRUE:
  - Start a **2-second pulse** using timer T3  
- Q0.0 turns ON immediately  
- Q0.0 stays ON for exactly **2 seconds**  
- Even if I0.0 remains pressed:
  - Q0.0 must still turn OFF at the end of the pulse  
- Pressing I0.0 again will trigger another 2-second pulse

---

## Expected Behavior
1. Press I0.0 → Q0.0 turns ON instantly  
2. Q0.0 remains ON for 2 seconds  
3. After 2 seconds → Q0.0 goes OFF  
4. Hold I0.0 continuously → still only one pulse  
5. Release and press I0.0 again → new pulse begins  

This is the standard monostable timing pattern.

---

## Real-World Uses
Pulse timers are used widely:
- Incrementing counters once per event  
- Sending controlled bursts to solenoids  
- Starting a machine cycle with a clean pulse  
- Ensuring alarms receive a fixed-length acknowledgment signal  
- Converting button presses into clean, noise-free triggers  

---

## Common Mistakes
- Expecting the pulse to remain ON while the input stays TRUE  
- Expecting a repeating pulse (it fires only on an input edge)  
- Confusing the pulse timer with TON (delay ON)  
- Attempting to use the pulse timer for latching (it cannot latch itself)

`,
    initialCode: "",
    solutionCode: `A I0.0
L S5T#2S
SE T3

A T3
= Q0.0

------------------------
LADDER ILLUSTRATION
------------------------

RUNG A (Pulse Timer - Monostable):
|----[  I0.0  ]--------( PULSE T3 , PT = 2s )----|

RUNG B (Use Pulse Output):
|----[   T3   ]--------(   Q0.0   )--------------|`,
    objectives: [
        "Generate a fixed-duration pulse when an input becomes TRUE",
        "Understand monostable timing behavior",
        "Use SE instruction to create a TP-style pulse in STL",
        "Control an output using a timer's pulse result"
    ]
};
