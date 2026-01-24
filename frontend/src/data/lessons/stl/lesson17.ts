import type { Lesson } from '../types';

export const Lesson17: Lesson = {
    id: "17",
    title: "Lesson 17: Interlocks & Start Permissives",
    description: `
### 1. What Are Interlocks?

In real industrial machines, you cannot simply start a motor or a pump just because the operator presses the Start button.

You must also check **safety and process conditions**, called **interlocks** or **permissives**.

Typical permissives:
- Emergency stop NOT pressed
- Guard door closed
- Pressure OK
- Tank not empty
- Temperature within range
- Main power healthy

Only when **all** are TRUE, machine is allowed to start.

---

### 2. Interlock Logic Pattern

The standard structure is:

'''awl
A   StartButton
A   Permissive1
A   Permissive2
A   Permissive3
=   MotorOutput
'''

If *any* permissive is FALSE → MotorOutput stays OFF.

---

### 3. Our Training Scenario

We simulate a motor that may ONLY start if:
1. Start button (I0.0) is pressed
2. Emergency stop (I0.1) is **not pressed**
3. Tank low-level (I0.2) is FALSE (tank has enough material)
4. Temperature OK flag in M10.0 is TRUE

If all permissives OK → Q0.0 = Motor ON  
Else → Q0.0 remains OFF.

We will also show students how to **visually test failures**.

---

### Expected Behavior
| Input/Flag | Meaning | Result |
|-----------|---------|--------|
| I0.0 | Start pressed | Required |
| I0.1 = 1 | E-stop active | Motor MUST stay OFF |
| I0.2 = 1 | Low level | Motor MUST stay OFF |
| M10.0 = 0 | Temp too high/low | Motor OFF |
| All good | all permissives OK | Q0.0 ON |

`,

    initialCode: `ORGANIZATION_BLOCK OB 1
BEGIN

    // 0) Internal permissive generated inside PLC
    // TempOK marker follows I0.3
    A I 0.3
    = M 0.0
    // 1) Operator start
    A I 0.0

    // 2) Emergency stop must NOT be pressed
    // TODO: AN I 0.1

    // 3) Tank low-level must be OK (I0.2 = 0)
    // TODO: AN I 0.2

    // 4) Temperature OK flag 
    // TODO: A M 0.0

    // 5) Final result drives the motor
    // TODO: = Q 0.0

END_ORGANIZATION_BLOCK`,

    solutionCode: `ORGANIZATION_BLOCK OB 1
BEGIN
      // 0) Internal permissive generated inside PLC
    // TempOK marker follows I0.3
    A I 0.3
    = M 0.0

    // 1) Motor permissive chain
    A I 0.0      // Start
    AN I 0.1     // E-Stop NOT active
    AN I 0.2     // Low level NOT active
    A M 0.0      // Internal permissive (Temp OK)
    = Q 0.0

END_ORGANIZATION_BLOCK`,

    objectives: [
        "Build a permissive chain (interlock chain)",
        "Use UN for NOT conditions",
        "Combine operator input with safety conditions",
        "Understand real-world start logic"
    ]
};
