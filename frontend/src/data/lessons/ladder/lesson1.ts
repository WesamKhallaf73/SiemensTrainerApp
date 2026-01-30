import type { Lesson } from '../types';

export const L1: Lesson = {
    id: "L1",
    type: "LAD",
    title: "Ladder 1: Basic Circuits (NO Contact → Coil)",
    description: `
## Introduction
This is your very first ladder logic exercise.  
In this lesson, you will learn the most fundamental building block in PLC programming: **using a Normally Open (NO) contact to control a coil**.  

Even advanced industrial systems—motors, valves, pumps, alarms, machine sequences—are all built from this same idea.  
So mastering this pattern is essential before moving into latching, timers, counters, or more advanced logic.

---

## Understanding the NO Contact
A **Normally Open Contact** (represented as \`| | \`) acts like a simple electrical switch:
- When the input is **FALSE (0)** → the contact is **open**, so power cannot flow.
- When the input becomes **TRUE (1)** → the contact **closes**, allowing power flow.

In Siemens addressing:
- \`I 0.0\` is a digital input.
- When you press the simulated button in the UI, the value becomes **1**.

---

## Understanding the Output Coil
A **coil** \`( )\` represents a digital output:
- When the rung's logic is TRUE → the coil energizes, turning ON the corresponding output.
- When the rung is FALSE → the coil turns OFF.

In Siemens notation:
- \`Q 0.0\` is the output you will energize.

This behavior matches how real relays, motor starters, and actuators work.

---

## How the PLC Scan Works (Important Concept)
Each scan, the PLC:
1. Reads all inputs into the **process image**.
2. Executes your program from top to bottom.
3. Updates all outputs based on the logic results.

This means your coil \`Q 0.0\` updates in real time as the input \`I 0.0\` changes.

---

## Task
Create a simple rung:
1. Place a **Normally Open (NO) contact**.
2. Assign it the input address **I 0.0**.
3. Connect it to an **output coil**.
4. Assign the coil address **Q 0.0**.

### Expected Behavior
- When **I 0.0** is pressed → **Q 0.0 turns ON**.
- When **I 0.0** is released → **Q 0.0 turns OFF**.

This is the absolute foundation of everything in ladder logic.

---

## Real-World Meaning
This type of circuit exists in every industrial machine:
- A start pushbutton turning on a lamp.
- A sensor enabling a solenoid.
- A limit switch turning on an indicator.

Learning this means you are ready for more complex circuits like latching and timers.

`,
    initialCode: ``,
    solutionCode: `A I 0.0
= Q 0.0`,
    objectives: [
        "Understand how NO contact works",
        "Link an input (I 0.0) to an output (Q 0.0)",
        "Observe output change immediately with input"
    ]
};

