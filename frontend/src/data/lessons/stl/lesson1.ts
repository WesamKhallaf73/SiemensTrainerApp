import type { Lesson } from '../types';

export const Lesson1: Lesson = {
    id: "1",
    title: "Lesson 1: Basic Logic (AND / OR)",
    description: `
### 1. Introduction to Boolean Logic

In PLC programming, we use logic gates to make decisions.
- **'A' (AND)**: Checks if inputs are TRUE *in series*.
- **'O' (OR)**: Checks if inputs are TRUE *in parallel*.
- **'=' (Assign)**: Writes the result to an Output.

#### Example: A Simple Light Switch
'''awl
A I 0.0   // Check Switch
= Q 0.0   // Write to Light
'''

---

### Your Task: The "Two-Hand" Safety Press
To operate a dangerous press machine safely, an operator must press **two buttons simultaneously**.

**Requirements:**
1. Turn on the Press Motor ('Q 0.0') **ONLY** when:
   - Left Button ('I 0.0') is ON
   - **AND**
   - Right Button ('I 0.1') is ON.
`,
    initialCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // TODO: Implement Safety Logic
    
    A I 0.0  // Left Button
    // Add logic here to check Right Button (I 0.1)
    
    // Assign to Output Q 0.0
    
END_ORGANIZATION_BLOCK`,
    solutionCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // Solution: Two-Hand Safety Press
    
    A I 0.0  // Check Left Button
    A I 0.1  // AND Check Right Button
    = Q 0.0  // Assign to Press Motor
    
END_ORGANIZATION_BLOCK`,
    objectives: ["Turn on Q 0.0 only when I 0.0 AND I 0.1 are both TRUE."]
};
