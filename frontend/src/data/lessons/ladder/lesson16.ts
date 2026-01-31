import type { Lesson } from '../types';

export const L16: Lesson = {
    id: "L16",
    type: "LAD",
    title: "Ladder 16: Timer + Permissive Logic (Gated TON Control)",
    description: `
## Introduction
Timers in real industrial applications almost never run freely.  
They usually run **only when certain conditions are satisfied**, such as:

- Safety gate closed  
- Machine in Auto mode  
- Operator enable pressed  
- System not in Fault  
- Temperature/pressure within safe limits  

This is called a **permissive**.

A permissive is a condition that must be TRUE before the timer is allowed to operate.

This lesson teaches how to combine timing and permissive logic, a pattern used in almost every PLC program.

---

## What Is a Permissive?
A permissive is simply a condition that **must be TRUE** for an action to be allowed.

For a timer:
- If the permissive is FALSE → timer must stay reset  
- If the permissive becomes TRUE → timer is allowed to operate  
- If the permissive becomes FALSE during timing → timer resets immediately

This creates safe and predictable behavior.

---

## Target Logic for This Lesson
We will combine:
- A **Start condition**: I0.0  
- A **Safety permissive**: I0.1  
- A **5-second TON timer**: T3  
- An output that activates when timing completes: Q0.0  

**The TON must run only when both I0.0 and I0.1 are TRUE.**

### Desired behavior:
- If Start = 1 and Permissive = 1 → timer runs  
- If either becomes 0 → timer resets  
- When both stay TRUE for 5 seconds → Q0.0 = 1  
- If either input turns 0 afterward → Q0.0 = 0 immediately  

This is the foundation of time-based interlocks.

---

## Real-World Examples
- Conveyor must run 3 seconds **only if** guard door is closed  
- Pump must delay ON **only if** tank level is safe  
- Motor start delay **only if** airflow switch is active  
- Alarm delay **only when** system is in Auto mode  

This pattern is extremely common in DCS/PLC logic.

---

## Task
Implement the following:

1. Create a TON timer T3 with a **5-second preset**.  
2. The timer activates only when:
   - I0.0 = Start request  
   - I0.1 = Permissive (system OK)  
3. When T3 finishes → turn ON Q0.0.

If either input becomes FALSE:
- Timer resets  
- Q0.0 turns OFF immediately

---

## Expected Behavior
### Case 1: Both inputs TRUE
- TON starts timing  
- After 5 seconds → Q0.0 turns ON  

### Case 2: Any input FALSE before 5 seconds
- Timer resets  
- Q0.0 remains OFF  

### Case 3: Inputs TRUE again
- Timer restarts from zero  
- Requires full 5 seconds to complete  

This ensures the system only proceeds when conditions are safe and stable.

---

## Common Mistakes
- Placing the permissive AFTER the timer (incorrect)  
- Expecting the timer to continue when permissive goes FALSE  
- Forgetting that TON is non-retentive  
- Allowing the output to stay ON without rechecking permissives  

`,
    initialCode: "",
    solutionCode: `A I0.0
A I0.1
L S5T#5S
SD T3

A T3
= Q0.0

------------------------
LADDER ILLUSTRATION
------------------------

RUNG A (Permissive + Start → TON T3):
|----[ I0.0 ]----[ I0.1 ]----( TON T3 , PT = 5s )----|

RUNG B (Use Timer Done Bit):
|----[   T3   ]--------------(   Q0.0   )--------------|`,
    objectives: [
        "Combine timer logic with permissive conditions",
        "Use TON only when all required conditions are TRUE",
        "Reset timer immediately when a permissive fails",
        "Produce delayed outputs only under safe conditions"
    ]
};
