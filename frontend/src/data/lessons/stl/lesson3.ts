import type { Lesson } from '../types';

export const Lesson3: Lesson = {
    id: "3",
    title: "Lesson 3: Internal Memory (Markers)",
    description: `
### 1. What Are Marker Bits (M)?

Markers are **internal PLC memory bits**.
They are NOT connected to hardware.

Used for:
- Internal states
- Conditions
- Interlocks
- Sequences

Example:
- \`M 0.0\` → Internal flag
- \`M 10.0\` → Alarm condition

---

### 2. Why Use Markers?

Instead of controlling outputs directly, we:
1. Compute logic into a marker
2. Use the marker to control outputs

This makes programs:
- Cleaner
- Easier to debug
- Easier to expand

---

### 3. Example: Condition → Marker → Output

'''awl
A I 0.0
= M 0.0

A M 0.0
= Q 0.0
'''

---

### Your Task: Safety Interlock

**Scenario:**
- Door Switch (\`I 0.1\`)
- Motor (\`Q 0.0\`)
- Internal Safety Flag (\`M 1.0\`)

**Requirements:**
1. If Door is CLOSED (\`I 0.1 = 1\`) → Set Safety Flag
2. Motor runs ONLY when Safety Flag is TRUE
`,
    initialCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // 1. Safety Evaluation
    // TODO: Copy I 0.1 into M 1.0
    
    // 2. Motor Control
    // TODO: Use M 1.0 to control Q 0.0
    
END_ORGANIZATION_BLOCK`,
    solutionCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // Solution: Safety Interlock
    
    A I 0.1
    = M 1.0
    
    A M 1.0
    = Q 0.0
    
END_ORGANIZATION_BLOCK`,
    objectives: [
        "Understand internal memory bits",
        "Separate logic from outputs",
        "Create safety interlocks"
    ]
};

