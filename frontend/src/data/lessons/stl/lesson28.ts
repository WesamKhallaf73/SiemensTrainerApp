import type { Lesson } from '../types';

export const Lesson28: Lesson = {
    id: "28",
    title: "Lesson 28: FC with IN_OUT — Toggle Function with Memory",
    description: `
### 1) Why IN_OUT Parameters?

Until now, we used:
- **IN** parameters for reading inputs.
- **OUT** parameters for writing results.

But real PLC functions often need **internal state** that must persist between scans:
- A toggle button
- A counter
- A step-sequencer
- A soft latch

Because FCs do not have internal memory (unlike FBs), we store state **outside** the FC using:

### ⭐ VAR_IN_OUT (bidirectional parameter)

This lets the FC:
- Read a memory bit
- Modify it
- Write it back
- And the value persists next scan

---

### 2) What We Build in This Lesson

A reusable toggle function:

## ⭐ FC40: ToggleBit
- When the button makes a **rising edge (0→1)**, the output toggles.
- Holding the button does **not** toggle repeatedly.
- Releasing and pressing again toggles again.

**Parameters:**
- IN:  \`Btn\` — the button input
- IN_OUT: \`State\` — the output that toggles
- IN_OUT: \`Prev\` — stores last cycle’s button state (for edge detection)

---

### 3) How OB1 Tests the Function

We will:
- Read button I0.0
- Pass it into FC40
- FC40 updates State (M6.1) and Prev (M6.2)
- We display the toggle result on Q0.0

---

### Expected Behavior

| Press Sequence | Q0.0 |
|----------------|------|
| Start at rest  | 0    |
| Press button   | 1    |
| Hold button    | 1    |
| Release        | 1    |
| Press again    | 0    |
| Press again    | 1    |

Perfect toggle logic.

`,

    initialCode: `// ------------------ FC40: Toggle Function ------------------
FUNCTION FC 40 : VOID
VAR_INPUT
    Btn : BOOL;    // Button input
END_VAR
VAR_IN_OUT
    State : BOOL;  // Toggled output (stored outside FC)
    Prev  : BOOL;  // Previous button state (for edge detection)
END_VAR
BEGIN
    // TODO:
    // Rising Edge = Btn AND NOT Prev
    // If edge → toggle State
    // After that, always update Prev := Btn
END_FUNCTION



// ------------------ OB100 (Optional Startup Reset) ------------------
ORGANIZATION_BLOCK OB 100
BEGIN
    // TODO: R M 6.1     // Reset State
    // TODO: R M 6.2     // Reset Prev
    // TODO: R Q 0.0     // Clear output
END_ORGANIZATION_BLOCK



// ------------------ OB1 (Call FC and Output Result) ------------------
ORGANIZATION_BLOCK OB 1
BEGIN
    // TODO: CALL FC40 with:
    // Btn   := I0.0
    // State := M6.1
    // Prev  := M6.2

    // TODO: Output State to Q0.0
END_ORGANIZATION_BLOCK`,


    solutionCode: `// ------------------ FC40: Toggle Function ------------------
FUNCTION FC 40 : VOID
VAR_INPUT
    Btn : BOOL;
END_VAR
VAR_IN_OUT
    State : BOOL;
    Prev  : BOOL;
END_VAR
BEGIN
    // ----- Rising Edge Detection -----
    A #Btn
    AN #Prev
    JCN L2            // If no rising edge => skip toggle

    // ----- Toggle Logic -----
    A #State
    JC L1             // If State = 1 => reset it

    // State was 0 => set it
    S #State
    JU L2

L1: NOP 0
    // State was 1 => reset it
    R #State

L2: NOP 0
    // ----- Update Prev := Btn -----
    A #Btn
    = #Prev
END_FUNCTION



// ------------------ OB100: Initialize Memory ------------------
ORGANIZATION_BLOCK OB 100
BEGIN
    R M 6.1   // Reset toggle state
    R M 6.2   // Reset previous button state
    R Q 0.0   // Clear output
END_ORGANIZATION_BLOCK



// ------------------ OB1: Use FC40 ------------------
ORGANIZATION_BLOCK OB 1
BEGIN
    CALL FC 40 (
        Btn := I 0.0,
        State := M 6.1,
        Prev := M 6.2
    )

    A M 6.1
    = Q 0.0
END_ORGANIZATION_BLOCK`,

    objectives: [
        "Learn how FCs store state using VAR_IN_OUT",
        "Implement a toggle function without oscillation",
        "Use rising-edge detection inside the FC",
        "Call an FC with multiple IN_OUT parameters",
        "Observe persistent memory behavior between scans"
    ]
};

