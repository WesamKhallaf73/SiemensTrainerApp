import type { Lesson } from '../types';

export const Lesson10: Lesson = {
    id: "10",
    title: "Lesson 10: Edge Detection (One-Shots)",
    description: `
### 1. Rising & Falling Edges

Sometimes you only want to do something **once** when a button is pressed, not continuously while it is held.
- **'FP' (Positive Edge / Rising)**: Pulse when signal goes 0 -> 1.
- **'FN' (Negative Edge / Falling)**: Pulse when signal goes 1 -> 0.

Edges require a **Memory Bit** to store the previous state.

#### Example: Catching a Rising Edge
'''awl
A I 0.0
FP M 0.0    // M 0.0 stores history
= M 0.1     // M 0.1 is TRUE for exactly ONE cycle
'''

---

### Your Task: Toggle Switch
Make a button act like a Toggle (Push-On, Push-Off).
1. Detect Rising Edge of Button 'I 0.0'.
2. Use that edge to **XOR** the Output 'Q 0.0' (Flip its state).
`,
    initialCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // 1. Detect Rising Edge of I 0.0
    A I 0.0
    // TODO: Use 'FP' with a helper memory (e.g., M 10.0)
    // FP M 10.0
    // = M 10.1  (The Edge Pulse)

    // 2. Toggle Q 0.0
    // Logic: If (Edge is True) AND (Q 0.0 is False) -> Set Q 0.0
    //        If (Edge is True) AND (Q 0.0 is True)  -> Reset Q 0.0
    // Hint: Or use XOR word logic: L QB 0, XOW ..., T QB 0
    
    // Simpler Toggle Logic for you to implement:
    A M 10.1    // The Edge
    AN Q 0.0
    S M 10.2    // Request Set
    
    A M 10.1
    A Q 0.0
    S M 10.3    // Request Reset
    
    A M 10.2
    S Q 0.0
    R M 10.2
    
    A M 10.3
    R Q 0.0
    R M 10.3
    
END_ORGANIZATION_BLOCK`,
    solutionCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // Solution: Toggle Switch
    
    // 1. Edge Detection
    A I 0.0
    FP M 10.0
    = M 10.1    // One-Shot Pulse
    
    // 2. Toggle Logic (XOR approach)
    A M 10.1    // If Pulse...
    JCN END
    
    L QB 0      // Load Output Byte
    L 1         // Load Bit Mask (0000 0001)
    XOW         // XOR (Flips the bit)
    T QB 0      // Save back
    
END: NOP 0

END_ORGANIZATION_BLOCK`,
    objectives: ["Q 0.0 flips state each time I 0.0 is pressed"]
};
