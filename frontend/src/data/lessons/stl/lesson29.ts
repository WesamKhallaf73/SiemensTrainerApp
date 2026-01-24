import type { Lesson } from '../types';

export const Lesson29: Lesson = {
    id: "29",
    title: "Lesson 29: Reusable Counter Using FC + IN_OUT (Soft Counter)",
    description: `
### 1) Why Build a Counter Inside an FC?

Siemens PLCs have hardware counters (C0, C1, …),  
but in real industrial programming we often need **custom counters** because:

- We want more counters than the hardware provides  
- We want a counter per motor, per operation, per sequence  
- We want logic that works the same way in simulation and real PLC  
- We want full control of count direction, resets, limits, etc.

A **Soft Counter** written inside an FC provides:

- Infinite number of counters  
- Fully customizable behavior  
- Safe, modular code  
- Stored state using **IN_OUT parameters**

This lesson prepares the student to build real systems like:
- Piece counters  
- Step counters  
- Machine cycle counters  
- Reject/OK counters  
- Operator action counters  

---

### 2) What We Build in Lesson 29

## ⭐ FC50: SoftCounter
Uses IN, IN_OUT, and OUT parameters.

**Inputs**
- \`Pulse\` (BOOL) — rising-edge pulse triggers count +1  
- \`Reset\` (BOOL) — reset counter to zero

**IN_OUT**
- \`Value\` (INT) — the current counter value  
- \`Prev\` (BOOL) — stores last pulse state (for rising-edge detection)

**Outputs**
- \`Reached10\` (BOOL) — TRUE when counter reaches 10

---

### 3) How OB1 Will Use It

We will:
- Detect a pulse from input I0.1  
- Feed pulse + reset button (I0.2) to FC50  
- Store counter in MW10  
- Store \`Prev\` in M6.3  
- Turn on Q0.1 when counter reaches 10  
- Show counter in memory (MW10)

---

### Example Behavior

1. Each press of I0.1 increments counter by 1  
2. Holding I0.1 does not count repeatedly  
3. Reset button I0.2 clears counter  
4. When counter = 10 → Q0.1 = 1  

---

### 4) Important Design Note

We implement rising-edge detection *inside the FC*,  
so OB1 remains clean and simple, same as the toggle lesson.

`,

    initialCode: `// ------------------ FC50: Soft Counter ------------------
FUNCTION FC 50 : VOID
VAR_INPUT
    Pulse : BOOL;     // Button or signal to count
    Reset : BOOL;     // Reset command
END_VAR
VAR_IN_OUT
    Value : INT;      // Counter value (0…32767)
    Prev  : BOOL;     // Store last pulse for rising edge
END_VAR
VAR_OUTPUT
    Reached10 : BOOL; // TRUE when counter reaches 10
END_VAR
BEGIN
    // TODO:
    // 1. Rising edge = Pulse AND NOT Prev
    // 2. If Reset=1 -> Value := 0
    // 3. If rising edge -> increment Value
    // 4. Reached10 = TRUE if Value >= 10
    // 5. Update Prev := Pulse
END_FUNCTION



// ------------------ OB100: Initialize Counter ------------------
ORGANIZATION_BLOCK OB 100
BEGIN
    // TODO: Reset Value, Prev, and output Q0.1
END_ORGANIZATION_BLOCK



// ------------------ OB1: Test FC50 ------------------
ORGANIZATION_BLOCK OB 1
BEGIN
    // TODO:
    // CALL FC50 with:
    // Pulse := I0.1
    // Reset := I0.2
    // Value := MW10
    // Prev := M6.3
    // Reached10 := M6.4

    // Drive Q0.1 using M6.4
END_ORGANIZATION_BLOCK`,


    solutionCode: `// ------------------ FC50: Soft Counter ------------------
FUNCTION FC 50 : VOID
VAR_INPUT
    Pulse : BOOL;
    Reset : BOOL;
END_VAR
VAR_IN_OUT
    Value : INT;
    Prev  : BOOL;
END_VAR
VAR_OUTPUT
    Reached10 : BOOL;
END_VAR
BEGIN
    // ----- Reset -----
    A #Reset
    JC L2        // If reset → skip counting and do reset

    // ----- Rising Edge Detection -----
    A #Pulse
    AN #Prev
    JCN L1       // No rising edge → skip increment

    // ----- Increment -----
    L #Value
    L 1
    +I
    T #Value

L1: NOP 0
    // Continue below after increment


    // ----- Check threshold -----
    L #Value
    L 10
    >=I
    = #Reached10
    JU L3


// ----- Reset path -----
L2: NOP 0
    L 0
    T #Value
    R #Reached10


// ----- Update Prev := Pulse -----
L3: NOP 0
    A #Pulse
    = #Prev
END_FUNCTION



// ------------------ OB100 ------------------
ORGANIZATION_BLOCK OB 100
BEGIN
    L 0
    T MW 10

    R M 6.3
    R M 6.4
    R Q 0.1
END_ORGANIZATION_BLOCK



// ------------------ OB1 ------------------
ORGANIZATION_BLOCK OB 1
BEGIN
    CALL FC 50 (
        Pulse := I 0.1,
        Reset := I 0.2,
        Value := MW 10,
        Prev := M 6.3,
        Reached10 := M 6.4
    )

    // Output alarm when count >= 10
    A M 6.4
    = Q 0.1
END_ORGANIZATION_BLOCK`,

    objectives: [
        "Learn how to build a reusable software counter",
        "Use IN_OUT to store persistent counter state",
        "Implement rising-edge detection inside the FC",
        "Control outputs based on counted values",
        "Practice modular PLC design using FCs"
    ]
};
