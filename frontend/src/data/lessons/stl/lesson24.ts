import type { Lesson } from '../types';

export const Lesson24: Lesson = {
    id: "24",
    title: "Lesson 24: Parameter-Based Timer Selection (Mode from MW)",
    description: `
### 1) Why Do We Need Mode-Based Timer Selection?

Some machines must run different timing sequences depending on:
- Operator selection  
- Recipe  
- Machine configuration  
- Process requirements  
- Production speed  

In Siemens PLCs (and your simulator), S5TIME values cannot be built from integers.  
Instead, we choose between fixed presets using comparisons and jumps.

This is the **correct industrial technique**.

---

### 2) Parameter MW for Mode Selection

We will use:

- **MW6 = ModeNumber**

If the operator (or OB100) sets:

- MW6 = 1 → 1-second TON  
- MW6 = 2 → 3-second TON  
- MW6 = 3 → 5-second TON  

You can extend the table later.

---

### 3) Our Task in This Lesson

We will:

1. Load a default ModeNumber into MW6 in OB100  
2. In OB1, select the timer preset based on MW6  
3. Drive output Q0.0 when the selected TON finishes  
4. The student will see *different timing behavior* depending on MW6

---

### 4) Why This Is Important

This is exactly how industrial machines work:
- Recipes
- Modes
- Parameter-based timing
- Multi-speed cycles
- Auto/Manual logic

All implemented before FCs and FBs.

`,

    initialCode: `// ------------------ OB100 (Startup - Set Default Mode) ------------------
ORGANIZATION_BLOCK OB 100
BEGIN
    // Default Mode = 2 (3-second timer)
    // TODO: L 2
    // TODO: T MW 6
END_ORGANIZATION_BLOCK



// ------------------ OB1 (Cyclic Program) ------------------
ORGANIZATION_BLOCK OB 1
BEGIN
    // -------------------------------------------------------
    // 1) Read ModeNumber (MW6) and jump to correct timer
    // -------------------------------------------------------

    // TODO: L MW 6
    // TODO: L 1
    // TODO: ==I
    // TODO: JC L1

    // TODO: L MW 6
    // TODO: L 2
    // TODO: ==I
    // TODO: JC L2

    // TODO: L MW 6
    // TODO: L 3
    // TODO: ==I
    // TODO: JC L3

    // Default fallback (Mode not valid)
    JU DONE



// ===== Mode 1: 1 second TON =====
L1: NOP 0
    // TODO: A I 0.0
    // TODO: L S5T#1S
    // TODO: SD T6
    JU DONE


// ===== Mode 2: 3 second TON =====
L2: NOP 0
    // TODO: A I 0.0
    // TODO: L S5T#3S
    // TODO: SD T6
    JU DONE


// ===== Mode 3: 5 second TON =====
L3: NOP 0
    // TODO: A I 0.0
    // TODO: L S5T#5S
    // TODO: SD T6
    JU DONE


// ===== Final Output =====
DONE: NOP 0
    // TODO: A T6
    // TODO: = Q 0.0

END_ORGANIZATION_BLOCK`,


    solutionCode: `// ------------------ OB100 (Set Default Mode) ------------------
ORGANIZATION_BLOCK OB 100
BEGIN
    // Default: Mode 2 → 3-second timer
    L 2
    T MW 6
END_ORGANIZATION_BLOCK



// ------------------ OB1 (Cyclic Mode Selection Logic) ------------------
ORGANIZATION_BLOCK OB 1
BEGIN
    // ------------------- Mode 1 -------------------
    L MW 6
    L 1
    ==I
    JC L1

    // ------------------- Mode 2 -------------------
    L MW 6
    L 2
    ==I
    JC L2

    // ------------------- Mode 3 -------------------
    L MW 6
    L 3
    ==I
    JC L3

    // Invalid mode → skip directly to DONE
    JU DONE



// ===== Mode 1: TON = 1 second =====
L1: NOP 0
    A I 0.0
    L S5T#1S
    SD T6
    JU DONE


// ===== Mode 2: TON = 3 seconds =====
L2: NOP 0
    A I 0.0
    L S5T#3S
    SD T6
    JU DONE


// ===== Mode 3: TON = 5 seconds =====
L3: NOP 0
    A I 0.0
    L S5T#5S
    SD T6
    JU DONE



// ===== Final Output =====
DONE: NOP 0
    A T6
    = Q 0.0

END_ORGANIZATION_BLOCK`,

    objectives: [
        "Use MW parameters to select machine modes",
        "Implement multi-branch logic using comparisons + JC + labels",
        "Drive timers based on selected mode",
        "Understand how real PLCs implement recipes and timing cycles",
        "Extend OB100 with parameter loading",
        "Prepare the student for modular programming (FCs)"
    ]
};
