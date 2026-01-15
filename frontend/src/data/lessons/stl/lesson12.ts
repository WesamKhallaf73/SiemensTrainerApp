import type { Lesson } from '../types';

export const Lesson12: Lesson = {
    id: "12",
    title: "Lesson 12: Real Math (Floating Point)",
    description: `
### 1. Real Numbers (32-bit Float)

Integers have limits. Reals allow decimals (e.g., 3.14).
- **'L 3.14'**: Load Real constant.
- **'+R'**: Add Real.
- **'*R'**: Multiply Real.
- **'MD'**: Memory Double Word (32-bit) is required for Reals.

#### Example: Double a value
'''awl
L MD 0
L 2.0   // Must be 2.0, not 2
*R
T MD 4
'''

---

### Your Task: Circle Area
Calculate the Area of a Circle: $Area = Radius * Radius * 3.14$
1. Radius is in **'MD 0'** (Set it to 10.0).
2. Store Result in **'MD 4'**.
`,
    initialCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // 1. Setup Radius
    L 10.0
    T MD 0
    
    // TODO: Load Radius
    // TODO: Multiply by Radius
    // TODO: Load PI (3.14159)
    // TODO: Multiply
    // TODO: Transfer to MD 4
    
END_ORGANIZATION_BLOCK`,
    solutionCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // Solution: Circle Area
    
    L 10.0
    T MD 0
    
    L MD 0       // Radius
    L MD 0       // Radius
    *R           // r^2
    
    L 3.14159    // Pi
    *R           // Area
    T MD 4
    
END_ORGANIZATION_BLOCK`,
    objectives: ["MD 4 should be approx 314.159"]
};
