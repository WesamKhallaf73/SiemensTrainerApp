import type { Lesson } from '../types';

export const Lesson4: Lesson = {
    id: "4",
    title: "Lesson 4: Negation & RLO (Result of Logic Operation)",
    description: `
### 1. Understanding the RLO (Result of Logic Operation)

Every instruction updates an internal value called the **RLO**.
Think of it as “the current TRUE/FALSE result”.

Example:
- \`A I 0.0\` loads the value of I 0.0 into the RLO.
- \`AN I 0.1\` means AND with **NOT I 0.1**.

---

### 2. Negation Instructions

You can invert a signal in two ways:

- **AN I 0.0** → AND the *inverse* of the input  
- **NOT** → Invert the existing RLO

---

### 3. Example: Run Motor Only When Sensor is NOT Active

'''awl
A I 0.0     // Start command
AN I 0.1    // Sensor NOT active
= Q 0.0
'''

If sensor is ON → Motor is blocked.

---

### Your Task: Fault-Inhibited Start

A machine can start only when:

1. Start Button (\`I 0.0\`) is pressed  
2. Fault (\`I 0.2\`) is NOT active  

If a fault appears at any time → Motor must turn OFF.

`,
    initialCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // TODO: Load Start Button
    
    // TODO: Block operation when Fault (I 0.2) is active
    
    // TODO: Assign to Q 0.0
    
END_ORGANIZATION_BLOCK`,
    solutionCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    A I 0.0     // Start
    AN I 0.2    // Fault NOT active
    = Q 0.0     // Motor
    
END_ORGANIZATION_BLOCK`,
    objectives: [
        "Use AN (AND-NOT)",
        "Understand RLO flow",
        "Implement negative logic"
    ]
};
