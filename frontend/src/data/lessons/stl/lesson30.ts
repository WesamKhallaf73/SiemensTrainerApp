import type { Lesson } from '../types';

export const Lesson30: Lesson = {
    id: "30",
    title: "Lesson 30: Multi-Step Sequence Control (Step Sequencer in FC)",
    description: `
### 1) Why Do We Need a Step Sequencer?

Many machines operate in steps:
1. Fill tank  
2. Mix  
3. Heat  
4. Pump  
5. Drain  

Or:
1. Extend cylinder  
2. Wait for sensor  
3. Retract cylinder  
4. Complete  

These cannot be done with a single rung.  
We need **stateful logic** that moves from Step 0 → Step 1 → Step 2, etc.

In Siemens, beginners often use:
- Many markers
- Many nested conditions
- Messy OB1 code

Professionals use a **Step Sequencer**:
- Clean  
- Single variable holding the current step number  
- Functions easily extended  
- Debug-friendly  

We implement it using **FC + IN_OUT**, same as previous lessons.

---

### 2) What We Build Today

## ⭐ FC60: StepSequencer

**Inputs**
- \`Start\` — begins the sequence  
- \`Reset\` — returns to Step 0  
- \`SensorA\`, \`SensorB\`, \`SensorC\` — confirm each step is done

**IN_OUT**
- \`Step\` — holds the current step number (0–3)

**Outputs**
- \`ActA\` — active during Step 1  
- \`ActB\` — active during Step 2  
- \`ActC\` — active during Step 3  

### Sequence:
- Step 0: Idle  
  - If Start=1 → move to Step 1  
- Step 1: ActA=1  
  - When SensorA=1 → Step 2  
- Step 2: ActB=1  
  - When SensorB=1 → Step 3  
- Step 3: ActC=1  
  - When SensorC=1 → back to Step 0 (cycle complete)

This is an extremely common pattern in real plants.

---

### 3) How OB1 Will Use It

Inputs:
- I0.0 = Start  
- I0.1 = Reset  
- I0.2 = SensorA  
- I0.3 = SensorB  
- I0.4 = SensorC  

Memory:
- MW20 = Step number  
- M7.0 = ActA  
- M7.1 = ActB  
- M7.2 = ActC  

Outputs:
- Q0.0 = ActA  
- Q0.1 = ActB  
- Q0.2 = ActC  

---

### 4) Expected Behavior

1. Press Start → Step changes from 0 → 1  
2. SensorA = 1 → Step moves to 2  
3. SensorB = 1 → Step moves to 3  
4. SensorC = 1 → Step returns to 0  
5. Reset at any time → Step = 0  

Clear, predictable, industrial-grade logic.

`,

    initialCode: `// ------------------ FC60: Step Sequencer ------------------
FUNCTION FC 60 : VOID
VAR_INPUT
    Start   : BOOL;
    Reset   : BOOL;
    SensorA : BOOL;
    SensorB : BOOL;
    SensorC : BOOL;
END_VAR
VAR_IN_OUT
    Step : INT;        // 0..3
END_VAR
VAR_OUTPUT
    ActA : BOOL;
    ActB : BOOL;
    ActC : BOOL;
END_VAR
BEGIN
    // TODO:
    // 1. If Reset -> Step := 0
    // 2. Case Step of:
    //    0: if Start -> Step := 1
    //    1: ActA=1; if SensorA -> Step := 2
    //    2: ActB=1; if SensorB -> Step := 3
    //    3: ActC=1; if SensorC -> Step := 0
END_FUNCTION



// ------------------ OB100 (Initialize Step) ------------------
ORGANIZATION_BLOCK OB 100
BEGIN
    // TODO: L 0
    // TODO: T MW20
END_ORGANIZATION_BLOCK



// ------------------ OB1 (Call Sequencer) ------------------
ORGANIZATION_BLOCK OB 1
BEGIN
    // TODO: CALL FC60 with signals
    // TODO: Drive Q0.0 / Q0.1 / Q0.2
END_ORGANIZATION_BLOCK`,


    solutionCode: `// ------------------ FC60: Step Sequencer ------------------
FUNCTION FC 60 : VOID
VVAR_INPUT
    Start   : BOOL;
    Reset   : BOOL;
    SensorA : BOOL;
    SensorB : BOOL;
    SensorC : BOOL;
END_VAR
VAR_IN_OUT
    Step : INT;
END_VAR
VAR_OUTPUT
    ActA : BOOL;
    ActB : BOOL;
    ActC : BOOL;
END_VAR
BEGIN
    // ------- Reset -------
    A #Reset
    L 0
    T MW 7
  

    JC L9
    JU L0

L9: NOP 0
    L 0
    T #Step
    JU L8


// -------- Sequence Logic --------
L0: NOP 0
    // ----- Step 0 (Idle) -----
    L #Step
    L 0
    ==I
    JCN L1
    // If Start -> go to 1
    A #Start
    JC L10
    JU L8

L10: NOP 0
    L 1
    T #Step
    JU L8


// ----- Step 1 -----
L1: NOP 0
    L #Step
    L 1
    ==I
    JCN L2
    // Output ActA
    SET
    = #ActA
    // Move to step 2 if SensorA
    A #SensorA
    JC L11
    JU L8

L11: NOP 0
    L 2
    T #Step
    JU L8


// ----- Step 2 -----
L2: NOP 0
    L #Step
    L 2
    ==I
    JCN L3
    // Output ActB
    SET
    = #ActB
    A #SensorB
    JC L12
    JU L8

L12: NOP 0
    L 3
    T #Step
    JU L8


// ----- Step 3 -----
L3: NOP 0
    L #Step
    L 3
    ==I
    JCN L8
    // Output ActC
    SET
    = #ActC
    A #SensorC
    JC L13
    JU L8

L13: NOP 0
    L 0
    T MW 7
    L 0
    T #Step


// -------- End Label --------
L8: NOP 0
END_FUNCTION



// ------------------ OB100 ------------------
ORGANIZATION_BLOCK OB 100
BEGIN
    L 0
    T MW10
   

    R Q 0.0
    R Q 0.1
    R Q 0.2
END_ORGANIZATION_BLOCK



// ------------------ OB1 ------------------
ORGANIZATION_BLOCK OB 1
BEGIN
    CALL FC 60 (
        Start := I 0.0,
        Reset := I 0.1,
        SensorA := I 0.2,
        SensorB := I 0.3,
        SensorC := I 0.4,
        Step := MW 10,
        ActA := M 7.0,
        ActB := M 7.1,
        ActC := M 7.2
    )

    A M 7.0
    = Q 0.0

    A M 7.1
    = Q 0.1

    A M 7.2
    = Q 0.2
END_ORGANIZATION_BLOCK`,

    objectives: [
        "Create a real industrial step sequencer",
        "Use FC + IN_OUT to store step state",
        "Organize multi-step logic with clean transitions",
        "Drive different outputs depending on step number",
        "Understand the basis of state machines and sequences"
    ]
};

