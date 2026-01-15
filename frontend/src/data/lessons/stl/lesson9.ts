import type { Lesson } from '../types';

export const Lesson9: Lesson = {
    id: "9",
    title: "Lesson 9: Jumps & Loops",
    description: `
### 1. Conditional Jumps

Sometimes we want to skip code.
- **'JC Label'**: Jump if RLO is 1 (True).
- **'JCN Label'**: Jump if RLO is 0 (False).
- **'JU Label'**: Jump Unconditionally (Always).

#### Example: Skip Logic if Input is OFF
'''awl
    A I 0.0     // Check Input
    JCN SKIP    // If 0, Jump to SKIP
    S Q 0.0     // Else, Set Output
SKIP: NOP 0
'''

#### Warning: Output Persistence
If you jump over an assignment ('= Q 0.0'), the output **retains its last value**! It does not automatically turn off. You usually need to explicitly Reset it.

---

### Your Task: Manual Override
1. Low Oil Pressure Alarm ('Q 0.0') normally turns on if 'M 10.0' is True.
2. BUT, if Override Switch ('I 0.0') is ON, **Force the Alarm OFF**.
`,
    initialCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // 1. Simulation Setup: Force Oil Pressure Low (Alarm condition)
    // We use 'SET' to force the RLO to 1, ensuring 'S' works.
    SET
    S M 10.0
    
    // 2. Override Logic
    A I 0.0      // Override Switch
    
    // TODO: IF Override is ON -> Jump to 'SAFE' label
    // Hint: Use 'JC' (Jump Conditional)
    
    // 3. Normal Alarm Logic (Runs if Override is OFF)
    A M 10.0
    = Q 0.0
    
    // TODO: Jump over the 'SAFE' block so we don't turn off the alarm accidentally
    // Hint: Use 'JU' (Jump Unconditional) to 'END'
    
SAFE: NOP 0
    // TODO: Manual Override Action
    // Hint: Explicitly Turn OFF Q 0.0 here using 'R'
    
END: NOP 0
    
END_ORGANIZATION_BLOCK`,
    solutionCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // Solution: Manual Override
    
    // Setup
    SET
    S M 10.0
    
    // Logic
    A I 0.0     // Check Override
    JC SAFE     // Jump if True
    
    // Normal Operation
    A M 10.0
    = Q 0.0
    
    JU END      // Skip Safety Block
    
SAFE: 
    R Q 0.0     // Force OFF
    
END: NOP 0
    
END_ORGANIZATION_BLOCK`,
    objectives: ["Q 0.0 is ON when I 0.0 is OFF", "Q 0.0 is OFF (or skipped) when I 0.0 is ON"]
};
