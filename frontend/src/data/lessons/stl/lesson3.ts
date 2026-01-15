import type { Lesson } from '../types';

export const Lesson3: Lesson = {
    id: "3",
    title: "Lesson 3: Organization Blocks (OBs)",
    description: `
### 1. The PLC Operating System

- **'OB 1'**: Main Cycle (Loop).
- **'OB 100'**: Startup (Setup).

#### Example: Initialization
'''awl
ORGANIZATION_BLOCK OB 100
BEGIN
    L 50
    T MW 0
END_ORGANIZATION_BLOCK
'''

---

### Your Task: System Ready Status
**Requirements:**
1. Use **'OB 100'** to set the "Ready Flag" ('M 0.0') to TRUE (1) on power-up.
2. Use **'OB 1'** to copy that flag to the Green Light ('Q 0.0').
`,
    initialCode: `// Runs ONCE at startup
ORGANIZATION_BLOCK OB 100
BEGIN
    // TODO: Set M 0.0 to 1
    
END_ORGANIZATION_BLOCK

// Runs Repeatedly
ORGANIZATION_BLOCK OB 1
BEGIN
    // TODO: Copy M 0.0 to Q 0.0
    
END_ORGANIZATION_BLOCK`,
    solutionCode: `// Solution: System Ready Status

ORGANIZATION_BLOCK OB 100
BEGIN
    // Set Ready Flag at Startup
    SET      // Force RLO=1
    S M 0.0
END_ORGANIZATION_BLOCK

ORGANIZATION_BLOCK OB 1
BEGIN
    // Copy Flag to Light
    A M 0.0
    = Q 0.0
END_ORGANIZATION_BLOCK`,
    objectives: ["Set M 0.0 in OB 100", "Verify Q 0.0 is ON at startup"]
};
