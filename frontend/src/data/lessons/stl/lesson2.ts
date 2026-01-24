import type { Lesson } from '../types';

export const Lesson2: Lesson = {
    id: "2",
    title: "Lesson 2: Memory & Latching",
    description: `
### 1. Why Memory Is Needed

Most push-buttons are **momentary**.
A motor must **stay ON** even after the button is released.

This requires **memory**.

---

### 2. Set & Reset Instructions

- **S (Set)**: Turns a bit ON and keeps it ON
- **R (Reset)**: Turns a bit OFF and keeps it OFF

Once set, the bit remains ON **until explicitly reset**.

---

### 3. Typical Industrial Start/Stop Logic

- Start Button → SET motor
- Stop Button → RESET motor

#### Example:
'''awl
A I 0.0
S Q 0.0

A I 0.1
R Q 0.0
'''

---

### Your Task: Conveyor Motor Starter

**Requirements:**
1. Green Button (\`I 0.0\`) → Start Motor (\`Q 0.0\`)
2. Red Button (\`I 0.1\`) → Stop Motor (\`Q 0.0\`)
3. Motor must remain ON after Start is released
`,
    initialCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // 1. Start Logic
    A I 0.0        // Green Button
    S Q 0.0        // Latch Motor
    
    // 2. Stop Logic
    // TODO: Reset Q 0.0 when I 0.1 is pressed
    
END_ORGANIZATION_BLOCK`,
    solutionCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // Solution: Start / Stop Motor
    
    A I 0.0
    S Q 0.0
    
    A I 0.1
    R Q 0.0
    
END_ORGANIZATION_BLOCK`,
    objectives: [
        "Understand PLC memory",
        "Use Set and Reset instructions",
        "Implement Start/Stop logic"
    ]
};
