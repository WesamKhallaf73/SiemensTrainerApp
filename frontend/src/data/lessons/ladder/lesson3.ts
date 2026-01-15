import type { Lesson } from '../types';

export const L3: Lesson = {
    id: "L3",
    type: "LAD",
    title: "Ladder 3: Timers (TON)",
    description: `
### On-Delay Timer (TON)
Delays turning on an output.
- **IN**: Condition to start timer.
- **Address**: "T 1" (Timer ID).

#### Task
1. When **I 0.0** is Pressed...
2. Start Timer **T 1** (TON).
3. Connect T 1 status to **Q 0.0**.
`,
    initialCode: "",
    solutionCode: `A I 0.0
L S5T#5S
SD T 1

A T 1
= Q 0.0`,
    objectives: ["Q 0.0 turns on after delay"]
};
