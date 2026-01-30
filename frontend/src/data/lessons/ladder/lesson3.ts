import type { Lesson } from '../types';

export const L3: Lesson = {
    id: "L3",
    type: "LAD",
    title: "Ladder 3: Start/Stop Latching Circuit (Self-Hold Pattern)",
    description: `
## Introduction
In this lesson we combine everything learned in the first two lessons to build one of the most fundamental and widely used patterns in ladder logic:  
the **self-holding (latching) circuit**, often called the **Start/Stop circuit**.

This pattern is the backbone of motor starters, pumps, fans, conveyors, and almost every industrial machine.  
Mastering this concept is essential before moving to timers, counters, and full machine sequences.

---

## What Problem Are We Solving?
If you simply use a Normally Open contact for a Start button:
- The output will stay ON **only while the button is physically pressed**.  
But in real systems, a machine should continue running **even after the operator releases the Start button**.

### Example:
- You press Start for 0.2 seconds  
- The motor should continue running for hours (unless stopped)

So we must teach the PLC:  
> “When started once, keep running until a Stop input turns it off.”

This is the purpose of the **latching circuit**.

---

## Core Idea of the Latch
We use the output **Q 0.0** itself as a feedback path (a “holding” branch) to keep the rung true even after the Start input is released.

### The rung contains:
1. A **Start button** → Normally Open (NO) → I 0.0  
2. A **Stop button** → Normally Closed (NC) → I 0.1  
3. A **self-holding branch** using the coil **Q 0.0**

In ladder form (conceptually):

\`\`\`
     I0.1 (NC) ----+---- I0.0 (NO) ----( Q0.0 )
                   |
                   +---- Q0.0 (NO) ----+
\`\`\`

---

## How It Works (Step by Step)
### 1. Machine is idle
- Stop (I0.1) = TRUE (NC)  
- Start (I0.0) = FALSE  
- Q0.0 = OFF  
- No self-hold yet

### 2. Operator presses Start
- Start = TRUE → rung becomes TRUE  
- Q0.0 turns ON

### 3. Operator releases Start
- Start returns to FALSE  
- BUT Q0.0 is now ON, so the **self-hold branch** keeps the rung TRUE  
- Output keeps running without the button being held

### 4. Operator presses Stop
- Stop = 1 → NC contact opens  
- Entire rung becomes FALSE  
- Q0.0 turns OFF  
- Self-hold disappears  
- Machine stops

This is the exact behavior required in motor control.

---

## Important Notes
### ✔ Stop always dominates  
Even if Start is pressed, if Stop is pressed the circuit turns OFF instantly.

### ✔ This is not a safety circuit  
Real safety uses:  
- dual-channel E-stop  
- safety relay  
- safety PLC  

But logically, this is the standard control rung.

---

## Task
Build the classical Start/Stop latch:
1. **I 0.0 (Start)** → NO contact  
2. **I 0.1 (Stop)** → NC contact  
3. A **parallel branch** using the output **Q 0.0** as a NO contact  
4. Output coil **Q 0.0**

### Expected Behavior
- Press Start → Q 0.0 turns ON and remains ON  
- Release Start → Q 0.0 stays ON  
- Press Stop → Q 0.0 immediately turns OFF  
- Releasing Stop does not restart the circuit

This is the exact behavior of a motor run command.

---

## Real-World Uses
This latching pattern is the foundation for:
- Motor run commands  
- Pumps  
- Compressors  
- Conveyor start circuits  
- Any maintained command requiring intentional Stop

Once you understand this behavior, all future ladder patterns become easier.

`,
    initialCode: "",
    solutionCode: `AN I 0.1
A( 
    A I 0.0
    O Q 0.0
)
= Q 0.0`,
    objectives: [
        "Build the classic Start/Stop latching circuit",
        "Use Q0.0 as a self-holding contact",
        "Ensure Stop (NC) always overrides Start"
    ]
};

