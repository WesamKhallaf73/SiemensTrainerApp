import type { Lesson } from '../types';

export const Lesson5: Lesson = {
    id: "5",
    title: "Lesson 5: ON-Delay Timer (TON)",
    description: `
### 1. Purpose of Timers

Timers introduce delays and duration control.

A **TON** (On-Delay) waits for a signal to stay TRUE continuously before activating.

---

### 2. TON Structure

- **IN** → Input condition  
- **PT** → Preset time  
- **Q** → Output (TRUE when timer finishes)  
- **ET** → Elapsed time  

---

### 3. Example: Turn On a Fan 3 Seconds After Start

'''awl
A I 0.0
L S5T#3S
SE T1

A T1
= Q 0.0
'''

---

### Your Task: Delayed Start for Motor

**Requirements:**

1. When Start Button (\`I 0.0\`) is pressed, start a 5-second TON (\`T5\`).
2. After the 5 seconds, turn ON Motor (\`Q 0.0\`).
3. Releasing the button should cancel the timer.

`,
    initialCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // TODO: Timer Input (I 0.0)
    
    // TODO: Load preset 5 seconds
    
    // TODO: Start TON T5
    
    // TODO: After T5 completes, activate Q 0.0
    
END_ORGANIZATION_BLOCK`,
    solutionCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    A I 0.0
    L S5T#5S
    SE T5
    
    A T5
    = Q 0.0
    
END_ORGANIZATION_BLOCK`,
    objectives: [
        "Use TON timer",
        "Load time constants",
        "Delay motor activation"
    ]
};

