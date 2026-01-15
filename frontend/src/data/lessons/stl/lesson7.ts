import type { Lesson } from '../types';

export const Lesson7: Lesson = {
    id: "7",
    title: "Lesson 7: Math Operations",
    description: `
### 1. Integer Math

- **'+I'**: Add
- **'-I'**: Subtract
- **'*I'**: Multiply

#### Example: Add 5 to MW 0
'''awl
L MW 0
L 5
+I
T MW 0
'''

---

### Your Task: Product Totals
We have two production lines.
- Line A count: 'MW 0'.
- Line B count: 'MW 2'.
- Calculate Total: 'MW 4 = MW 0 + MW 2'.
`,
    initialCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // Setup Test Values
    L 10
    T MW 0
    L 5
    T MW 2
    
    // TODO: Calculate Total
    L MW 0
    L MW 2
    // +I
    // T MW 4
    
END_ORGANIZATION_BLOCK`,
    solutionCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // Solution: Math
    
    // Setup Values
    L 10
    T MW 0
    L 5
    T MW 2
    
    // Calculate Total
    L MW 0
    L MW 2
    +I      // Add Accumulator 1 + Accumulator 2
    T MW 4  // Store Result
    
END_ORGANIZATION_BLOCK`,
    objectives: ["MW 4 should equal 15"]
};
