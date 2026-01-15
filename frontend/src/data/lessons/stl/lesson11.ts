import type { Lesson } from '../types';

export const Lesson11: Lesson = {
    id: "11",
    title: "Lesson 11: Word Logic (Hex & Masks)",
    description: `
### 1. Bitwise Operations

We can manipulate 16 bits at once using Word Logic.
- **'WAND'**: Word AND (Masking).
- **'WOR'**: Word OR (Merging).
- **'XOW'**: Word XOR (Toggling).

#### Example: Masking
Only keep the lower 4 bits of MW 10.
'''awl
L MW 10      // e.g. 2#1111_1111
L W#16#000F  // Mask 2#0000_1111
WAND
T MW 12      // Result 2#0000_1111
'''

---

### Your Task: Filter Status
We read a "Status Word" from Input Word 'IW 0'.
- We only care about **Bit 4** (Value 16 or 0x10).
- If Bit 4 is ON, turn on 'Q 0.0'.
- **Do not use 'A I 0.4'**. You must use Word Logic.
`,
    initialCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // Simulation: Force some inputs
    L 2#0001_0000
    T IW 0
    
    // TODO: Load IW 0
    // TODO: Load Mask for Bit 4 (Hex 10)
    // TODO: WAND
    // TODO: Compare if Result != 0
    
END_ORGANIZATION_BLOCK`,
    solutionCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // Solution: Filter Bit 4
    
    // Sim Input
    L 2#0001_0000
    T IW 0
    
    L IW 0
    L W#16#0010   // Mask for Bit 4
    WAND          // Result is 0x10 if bit is true, 0x00 if false
    
    L 0
    <>I           // Check if Result != 0
    = Q 0.0
    
END_ORGANIZATION_BLOCK`,
    objectives: ["Q 0.0 ON if IW 0 Bit 4 is High (using WAND)"]
};
