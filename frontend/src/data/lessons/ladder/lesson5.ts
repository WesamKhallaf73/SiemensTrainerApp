import type { Lesson } from '../types';

export const L5: Lesson = {
    id: "L5",
    type: "LAD",
    title: "Ladder 5: AND / OR Logic (Series & Parallel)",
    description: `
## Introduction
In real PLC control, outputs rarely depend on a single input. Most industrial logic is built from combinations such as:

- “Run only if ALL permissives are OK”  → AND logic
- “Alarm if ANY fault occurs”           → OR logic
- “Run if (Start OR Auto) AND Safety”   → OR inside AND (mixed logic)

In ladder, these combinations are drawn using:
- **Series contacts** for AND
- **Parallel branches** for OR

This lesson trains you to build both patterns correctly and predict the output behavior before even running the program.

---

## 1) AND Logic (Series Contacts)
### Concept
AND means: **all conditions must be TRUE** for the rung to be TRUE.

### Ladder rule
- Place conditions **in series** → this creates AND behavior.

### Example (AND)
If I0.0 AND I0.1 are TRUE, then Q0.0 turns ON.

---

## 2) OR Logic (Parallel Branches)
### Concept
OR means: **any one condition TRUE** will make the rung TRUE.

### Ladder rule
- Place conditions **in parallel branches** → this creates OR behavior.

### Example (OR)
If I0.2 OR I0.3 is TRUE, then Q0.1 turns ON.

---

## Why This Matters in Industry
### AND is used for permissive chains:
- Door closed AND pressure OK AND no fault AND operator enable

### OR is used for alarms and alternative commands:
- High temperature OR low flow OR motor trip → alarm
- Start button OR Auto run command → run request

Once you master AND/OR, you can build nearly every industrial rung: interlocks, permissives, mode selection, and alarm logic.

---

## Task
Build TWO rungs:

### Rung A (AND)
1. Add NO contact I0.0
2. Add NO contact I0.1 in series with it
3. Drive coil Q0.0

Goal: Q0.0 turns ON only when BOTH inputs are ON.

### Rung B (OR)
1. Create a parallel branch
2. Put NO contact I0.2 in the top branch
3. Put NO contact I0.3 in the bottom branch
4. Drive coil Q0.1

Goal: Q0.1 turns ON if either input is ON.

---

## Expected Behavior
### For Q0.0 (AND)
- ON only when I0.0 = 1 AND I0.1 = 1
- OFF if any one becomes 0

### For Q0.1 (OR)
- ON when I0.2 = 1 OR I0.3 = 1
- OFF only when both are 0

---

## Common Mistakes
- Drawing OR as series (this accidentally creates AND)
- Forgetting to close the branch properly
- Mixing addresses (I0.2 vs I0.3)

`,
    initialCode: "",
    solutionCode: `A I0.0
A I0.1
= Q0.0

A(
    A I0.2
    O I0.3
)
= Q0.1

------------------------
LADDER ILLUSTRATION
------------------------

RUNG A (AND):
|----[  I0.0  ]----[  I0.1  ]----(  Q0.0  )----|

RUNG B (OR):
|----+----[  I0.2  ]----+----(  Q0.1  )----|
|    |                 |                   |
|    +----[  I0.3  ]----+-------------------|`,
    objectives: [
        "Use series contacts to implement AND logic",
        "Use parallel branches to implement OR logic",
        "Predict rung behavior from ladder structure",
        "Translate ladder structure into STL structure"
    ]
};

