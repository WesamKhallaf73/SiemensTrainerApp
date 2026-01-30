import type { Lesson } from '../types';

export const L2: Lesson = {
    id: "L2",
    type: "LAD",
    title: "Ladder 2: Normally Closed Contact (Basic Stop Logic)",
    description: `
## Introduction
In this lesson, we explore the second fundamental element in ladder programming: the **Normally Closed (NC) contact**.  
You used a Normally Open contact in Lesson 1 to turn an output ON when an input becomes TRUE.  
Now we introduce the opposite behavior — a contact that is TRUE **by default** and becomes FALSE only when activated.

Understanding NC contacts is essential because real industrial machines often use NC signals for:
- Stop pushbuttons  
- Door/guard switches  
- System permissives (pressure OK, temp OK, guard closed)  
- Fault inputs  
- Safety interlocks (non-safety-rated)

But before going deeper, it’s important to clarify something engineers often misunderstand:

> **NC vs NO has nothing to do with PLC processor failure or PLC–I/O communication loss.**  
> If the PLC CPU crashes or loses connection with the I/O module, the **output module itself** (not your input contact type) determines whether the machine stops.  
> Most PLCs simply drop all outputs in that case, regardless of NO/NC.

### So what is NC *actually* used for?
NC contacts are mainly used to detect **field wiring problems** — not PLC CPU failures.

---

## Behavior of an NC Contact
A Normally Closed contact (\`|/|\`) works like this:
- When the input bit is **0** → NC evaluates to **TRUE** (closed).
- When the input bit is **1** → NC evaluates to **FALSE** (opened).

This makes it the opposite of the NO contact you used earlier.

### Practical meaning
- If the STOP button is **not pressed**, the contact remains closed → the machine is allowed to run.
- When the STOP button is **pressed**, the NC contact opens → the machine is forced to stop.

---

## Why NC is used for STOP / Interlocks
With NC wiring:
- A broken wire  
- Loose terminal  
- Bad contact  
- Corroded switch  
- Loss of 24V in the input loop  

all behave like a pressed STOP → the machine stops.

This is why NC is preferred for conditions that must **fail toward STOP** in case of wiring problems.

### And what about PLC failure?
If the CPU stops scanning:
- The output module typically drops all outputs  
- The machine stops  
- This behavior is *independent* of whether the STOP button was NO or NC

So we do **not** choose NC for PLC-failure safety — instead:
- Safety relays  
- Safety PLC (1200F/1500F)  
- Redundant circuits  

handle that part.

---

## Your Task
Create a rung that uses **I 0.1** as a STOP input through an NC contact:
1. Add a **Normally Closed (NC)** contact.
2. Assign it to **I 0.1**.
3. Link it to the coil **Q 0.0**.

### Expected Behavior
- When **I 0.1 = 0** → NC contact is TRUE → **Q 0.0 turns ON**.  
- When **I 0.1 = 1** (STOP pressed) → NC opens → **Q 0.0 turns OFF**.

This is the classic STOP logic pattern used in simple (non-safety-rated) PLC programs.

---

## Real-World Examples
NC logic is used for:
- Stop pushbuttons  
- Low-pressure “not OK” inputs  
- Door open detection  
- Sensor faults and permissives  
- Overtravel limit switches  

Whenever an input must **default to ON** and go OFF only when something changes, NC is usually the right choice.

This prepares you for the next lesson: the **Start/Stop latch circuit**, combining NO and NC together.

`,
    initialCode: "",
    solutionCode: `AN I 0.1
= Q 0.0`,
    objectives: [
        "Understand NC contact behavior in ladder logic",
        "Use I 0.1 as a STOP condition",
        "Observe the output turning OFF when NC contact opens"
    ]
};
