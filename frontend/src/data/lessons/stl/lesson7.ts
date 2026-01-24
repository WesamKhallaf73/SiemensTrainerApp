import type { Lesson } from '../types';

export const Lesson7: Lesson = {
    id: "7",
    title: "Lesson 7: Jumps (JC / JCN / JU) & Program Flow",
    description: `
### 1. Why Jumps Exist

A PLC scan executes your code from top to bottom.
Sometimes you need to:
- Skip a block of code
- Execute logic only in certain conditions
- Create IF / ELSE behavior
- Prevent assignments from running

Jumps are the AWL way to build **IF conditions** and clean program flow.

---

### 2. The Three Main Jump Instructions

- **JC Label**  : Jump if RLO = 1 (True)
- **JCN Label** : Jump if RLO = 0 (False)
- **JU Label**  : Jump always (Unconditional)

Important: Jumps depend on the **RLO** (Result of Logic Operation).
So you usually do:
1) Build a condition using A/AN/O/...  
2) Jump based on the RLO  

---

### 3. Example: IF (I0.0) THEN turn on Q0.0 ELSE turn it off

'''awl
A I 0.0
JCN OFF        // If NOT pressed -> go OFF
S Q 0.0        // Else -> ON
JU END

OFF: NOP 0
R Q 0.0
END: NOP 0
'''

---

### 4. Warning: Output Persistence

If you jump over an assignment like \`= Q 0.0\`,
the output may keep its last value unless you explicitly reset/assign it.
So for safe logic, always ensure outputs get a defined value in all paths.

---

### Your Task: Manual Override (Classic Industrial Pattern)

Alarm output \`Q 0.0\` normally follows a fault marker \`M 10.0\`.

**Requirements**
1) If Override switch \`I 0.0\` is ON → Force alarm OFF.
2) If Override is OFF → Alarm = M 10.0 (normal behavior).

(We will simulate M 10.0 = 1 using SET/S.)

`,
    initialCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // 1) Simulation setup: Force Fault ON (M 10.0 = 1)
    SET
    S M 10.0

    // 2) Override check
    A I 0.0
    // TODO: If override is ON -> Jump to SAFE

    // 3) Normal alarm logic
    A M 10.0
    = Q 0.0

    // TODO: Jump to END so we don't execute SAFE by mistake

SAFE: NOP 0
    // TODO: Force alarm OFF here

END: NOP 0

END_ORGANIZATION_BLOCK`,
    solutionCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // Solution: Manual Override

    // Setup: simulate fault = 1
    SET
    S M 10.0

    // If Override ON -> go SAFE
    A I 0.0
    JC SAFE

    // Normal behavior
    A M 10.0
    = Q 0.0
    JU END

SAFE: NOP 0
    R Q 0.0

END: NOP 0

END_ORGANIZATION_BLOCK`,
    objectives: [
        "Understand RLO-based branching",
        "Use JC, JCN, JU correctly",
        "Implement IF / ELSE style logic safely"
    ]
};



