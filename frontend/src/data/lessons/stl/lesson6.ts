import type { Lesson } from '../types';

export const Lesson6: Lesson = {
    id: "6",
    title: "Lesson 6: OFF-Delay Timer (TOF)",
    description: `
### 1. What TOF Does

A **TOF** keeps the output ON *after* the input turns OFF.

Useful for:
- Cooling fans  
- Exhaust ventilation  
- Delayed shutdown sequences  

---

### 2. TOF Structure

- IN → Timer starts counting when IN = 0  
- Q → Remains TRUE for PT duration after IN goes FALSE  

---

### Example: Fan Runs 4 Seconds After Heater Turns Off

'''awl
A I 0.0       // Heater ON
L S5T#4S
SD T2         // TOF
    
A T2
= Q 0.0       // Fan
'''

---

### Your Task: Conveyor Cool-Down Timer

1. Conveyor runs normally when Running Signal (\`I 0.1\`) is TRUE.
2. When Running Signal goes FALSE:
   - Keep Motor (\`Q 0.0\`) ON for **3 extra seconds**.

`,
    initialCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // TODO: Load running signal I 0.1
    // TODO: Use SD instruction with T3
    
    // TODO: Use T3 to hold Q 0.0
    
END_ORGANIZATION_BLOCK`,
    solutionCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    A I 0.1
    L S5T#3S
    SD T3
    
    A T3
    = Q 0.0
    
END_ORGANIZATION_BLOCK`,
    objectives: [
        "Use TOF timers",
        "Create delayed shutdown",
        "Manage shutdown sequences"
    ]
};

