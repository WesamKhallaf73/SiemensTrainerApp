import type { Lesson } from '../types';

export const Lesson11: Lesson = {
    id: "11",
    title: "Lesson 11: Data Blocks (DB) – Storing Parameters",
    description: `
### 1. Why Data Blocks Exist

In real industrial projects, values like:
- Speed setpoints
- Limits (Max current, Max temperature)
- Recipe parameters
- Calibration values

should NOT be hard-coded inside OB1.  
Instead, they are stored in a **Data Block (DB)** so engineers can tune them later without rewriting logic.

Think of a DB as a small “parameter memory” or a “recipe book”.

---

### 2. DB Structure in Our Simulator

A DB contains variables declared like this:

'''awl
DATA_BLOCK DB 1
  STRUCT
     TargetSpeed : INT := 1500;
     MaxCurrent  : INT := 20;
  END_STRUCT
BEGIN
END_DATA_BLOCK
'''

Each variable occupies memory locations:

- First INT is stored at **DBW 0**
- Second INT is stored at **DBW 2**
(because INT = 2 bytes)

So:
- TargetSpeed → DBW 0
- MaxCurrent  → DBW 2

---

### 3. Reading Values from the DB

Inside OB1:
1) Open the DB using \`OPN DB 1\`
2) Load a value using \`L DBW x\`
3) Transfer it using \`T ...\`

Example:

'''awl
OPN DB 1
L DBW 0
T QW 4
'''

This sends the TargetSpeed parameter to output word QW4.

---

### Your Task: Use TWO Parameters from DB1

We will use two parameters:
1) **TargetSpeed** (DBW 0) → always sent to Motor Output Word \`QW 4\`
2) **MaxCurrent** (DBW 2) → if ActualCurrent (\`IW 2\`) is higher than MaxCurrent, turn ON Alarm \`Q 0.0\`

**Requirements**
1) Define DB1 with:
   - TargetSpeed = 1500
   - MaxCurrent  = 20
2) Always write TargetSpeed to \`QW 4\`
3) Compare \`IW 2\` with MaxCurrent:
   - If IW2 > MaxCurrent → Q0.0 = 1
   - Else → Q0.0 = 0

This makes DB usage visible:
- You can change DB values later and behavior changes.

`,
    initialCode: `DATA_BLOCK DB 1
  STRUCT
     TargetSpeed : INT := 1500;   // DBW 0
     MaxCurrent  : INT := 20;     // DBW 2
  END_STRUCT
BEGIN
END_DATA_BLOCK

ORGANIZATION_BLOCK OB 1
BEGIN
    // 1) Open DB1
    OPN DB 1

    // 2) Send TargetSpeed to motor drive output word
    // TODO: L DBW 0
    // TODO: T QW 4

    // 3) Overcurrent Alarm:
    // If IW2 > MaxCurrent (DBW 2) -> Q0.0 ON
    // TODO: L IW 2
    // TODO: L DBW 2
    // TODO: >I
    // TODO: = Q 0.0

END_ORGANIZATION_BLOCK`,
    solutionCode: `DATA_BLOCK DB 1
  STRUCT
     TargetSpeed : INT := 1500;   // DBW 0
     MaxCurrent  : INT := 20;     // DBW 2
  END_STRUCT
BEGIN
END_DATA_BLOCK

ORGANIZATION_BLOCK OB 1
BEGIN
    // Solution: Use parameters from DB1

    // 1) Open DB1
    OPN DB 1

    // 2) Send TargetSpeed -> QW4
    L DBW 0
    T QW 4

    // 3) Alarm if ActualCurrent (IW2) > MaxCurrent (DBW2)
    L IW 2
    L DBW 2
    >I
    = Q 0.0

END_ORGANIZATION_BLOCK`,
    objectives: [
        "Define a DB using STRUCT variables with initial values",
        "Understand DBW offsets (INT uses 2 bytes)",
        "Read parameters from DB and use them in logic",
        "Build a real industrial pattern: setpoint + limit alarm"
    ]
};



