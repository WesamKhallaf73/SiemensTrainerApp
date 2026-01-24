import type { Lesson } from '../types';

export const Lesson27: Lesson = {
    id: "27",
    title: "Lesson 27: Reusable Motor Start Logic in an FC (Start/Stop/Permissive)",
    description: `... same description as before ...`,

    initialCode: `// ------------------ FC30: Reusable Motor Logic ------------------
FUNCTION FC 30 : VOID
VAR_INPUT
    StartPB : BOOL;
    StopPB  : BOOL;
    Permissive : BOOL;
END_VAR
VAR_OUTPUT
    MotorOn : BOOL;
END_VAR
BEGIN
    // TODO: Implement latch logic with safe labels:
    // - If StopPB or Permissive=0 → reset
    // - If StartPB AND Permissive → set
    // - Else → keep MotorOn state
END_FUNCTION



// ------------------ OB1: Test FC ------------------
ORGANIZATION_BLOCK OB 1
BEGIN
    // TODO: Call FC30 with start/stop/permissive
    // TODO: Drive Q0.0 from MotorOn
END_ORGANIZATION_BLOCK`,


    solutionCode: `// ------------------ FC30: Motor Control Logic ------------------
FUNCTION FC 30 : VOID
VAR_INPUT
    StartPB : BOOL;
    StopPB  : BOOL;
    Permissive : BOOL;
END_VAR
VAR_OUTPUT
    MotorOn : BOOL;
END_VAR
BEGIN
    // -------- Stop OR Permissive Loss → Reset Motor --------
    A #StopPB
    JC L2

    AN #Permissive
    JC L2

    // -------- Start Condition --------
    A #StartPB
    A #Permissive
    JC L1

    // -------- Keep Previous State --------
    A #MotorOn
    = #MotorOn
    JU L3


// ----- L1: SET motor -----
L1: NOP 0
    S #MotorOn
    JU L3


// ----- L2: RESET motor -----
L2: NOP 0
    R #MotorOn


// ----- L3: END -----
L3: NOP 0
END_FUNCTION



// ------------------ OB1 ------------------
ORGANIZATION_BLOCK OB 1
BEGIN
    CALL FC 30 (
        StartPB := I 0.0,
        StopPB := I 0.1,
        Permissive := I 0.2,
        MotorOn := M 5.0
    )

    A M 5.0
    = Q 0.0
END_ORGANIZATION_BLOCK`,

    objectives: [
        "Use FCs with IN and OUT parameters",
        "Implement an industrial motor latch safely",
        "Use only safe labels (L1, L2, L3) to avoid AWL keyword conflicts",
        "Route FC output to actuator in OB1",
        "Prepare for IN_OUT parameters in the next lesson"
    ]
};

