import type { Lesson } from '../types';

export const Lesson1: Lesson = {
    id: "1",
    title: "Lesson 1: Digital Inputs & Outputs",
    description: `
### 1. How a PLC Thinks (Scan Cycle)

A PLC does NOT run code only once.
It continuously executes the program in a **scan cycle**:

1. Read Inputs
2. Execute Logic
3. Update Outputs
4. Repeat (milliseconds)

Understanding this is **critical** for all PLC programming.

---

### 2. Digital Inputs (I) and Outputs (Q)

- **Inputs (I)**: Signals coming FROM the field (buttons, sensors).
- **Outputs (Q)**: Signals going TO the field (motors, lamps, valves).

Common addresses:
- \`I 0.0\` → Input byte 0, bit 0
- \`Q 0.0\` → Output byte 0, bit 0

---

### 3. Basic Logic Instructions

- **A (AND)**: Checks if an input is TRUE (1)
- **= (Assign)**: Writes the result to an output

#### Example: Button Controls Lamp
'''awl
A I 0.0     // Read Push Button
= Q 0.0     // Copy state to Lamp
'''

If the button is pressed → Lamp ON  
If released → Lamp OFF

---

### Your Task: Start Indicator Lamp

**Requirements:**
1. When Start Button (\`I 0.0\`) is pressed → Turn ON Lamp (\`Q 0.0\`)
2. When released → Lamp turns OFF automatically
`,
    initialCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // Task: Simple Button → Lamp Control
    
    // TODO: Read I 0.0 and assign it to Q 0.0
    
END_ORGANIZATION_BLOCK`,
    solutionCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // Solution: Button directly controls Lamp
    
    A I 0.0
    = Q 0.0
    
END_ORGANIZATION_BLOCK`,
    objectives: [
        "Understand PLC scan cycle",
        "Read a digital input",
        "Control a digital output"
    ]
};

