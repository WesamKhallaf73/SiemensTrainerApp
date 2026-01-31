import type { Lesson } from '../types';

export const L9: Lesson = {
    id: "L9",
    type: "LAD",
    title: "Ladder 9: Master Control Enable (Global Enable / Inhibit Rung)",
    description: `
## Introduction
Many industrial machines have a single condition that must be TRUE before **any** part of the machine is allowed to run.  
This condition is often called:

- Master Enable  
- Main Permissive  
- Global Run Allow  
- System Enable  
- Inhibit / Interlock  

Examples:
- A machine cannot run unless the safety gate is closed  
- All actuators must stop when a mode switch is turned to OFF  
- A process must disable all outputs when a high-level sensor is active  
- A conveyor line must not run unless upstream equipment is ready  

This lesson teaches how to build a **Master Control Enable** pattern that controls multiple outputs at once.

---

## Concept
A Master Enable is a single condition that must be TRUE for **every controlled output**.

Logic form:
Output = Master_Enable AND Local_Condition  

Where:
- Master_Enable is the global permission  
- Local_Condition is the rung-specific command for that output  

If Master_Enable becomes FALSE:
- All controlled outputs turn OFF immediately  
- No output can turn ON until the enable returns TRUE  

This behavior is extremely common in automation.

---

## Ladder Structure
To implement this, place the **Master Enable (NO contact)** at the left of every rung that controls an output.

Example:
- Master enable: I0.0  
- First output command: I0.1  
- Second output command: I0.2  

This produces:

Q0.0 = I0.0 AND I0.1  
Q0.1 = I0.0 AND I0.2  

When I0.0 = 0 → both outputs are OFF regardless of other inputs.

---

## Task
Create two rungs:

### Rung A (Output Q0.0)
1. NO contact I0.0 → Master enable  
2. NO contact I0.1 → Local condition  
3. Coil Q0.0  

### Rung B (Output Q0.1)
1. NO contact I0.0 → Master enable  
2. NO contact I0.2 → Local condition  
3. Coil Q0.1  

Both rungs must use I0.0 as the first element.

---

## Expected Behavior
- When I0.0 = 0 → both Q0.0 and Q0.1 are OFF  
- When I0.0 = 1 and I0.1 = 1 → Q0.0 turns ON  
- When I0.0 = 1 and I0.2 = 1 → Q0.1 turns ON  
- When I0.0 switches from 1 to 0 → both outputs turn OFF immediately  

This ensures consistent and predictable control.

---

## Real-World Uses
Master control logic is used everywhere:
- Global machine run permission  
- Safety gate closed condition  
- Maintenance/Setup mode  
- Emergency override (non-safety-rated)  
- System reset conditions  
- “Auto Mode” master switch  

It gives the programmer a **clean and structured way** to control multiple outputs under a single condition.

---

## Common Mistakes
- Placing the enable contact inside the rung instead of at the left  
- Using OR logic when global control must be enforced  
- Forgetting that a Master Enable overrides every local condition  

`,
    initialCode: "",
    solutionCode: `A I0.0
A I0.1
= Q0.0

A I0.0
A I0.2
= Q0.1

------------------------
LADDER ILLUSTRATION
------------------------

RUNG A (Master Enable → Output Q0.0):
|----[ I0.0 ]----[ I0.1 ]----( Q0.0 )----|

RUNG B (Master Enable → Output Q0.1):
|----[ I0.0 ]----[ I0.2 ]----( Q0.1 )----|`,
    objectives: [
        "Implement a Master Control Enable that affects all outputs",
        "Place the global enable condition at the start of each rung",
        "Understand how global permissions structure a PLC program",
        "Control multiple outputs with both global and local conditions"
    ]
};
