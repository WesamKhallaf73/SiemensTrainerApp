import type { Lesson } from '../types';

export const L4: Lesson = {
    id: "L4",
    type: "LAD",
    title: "Ladder 4: Counters (CTU & CTD)",
    description: `
### Counting Events
- **[ CTU ]**: Count Up relative to C# value.
- **[ CTD ]**: Count Down.
- **Address**: "C 1".

#### Task (Forward/Reverse Counter)
1. Use **I 0.0** to **Count Up** (CTU) Counter **C 1**.
2. Use **I 0.1** to **Count Down** (CTD) Counter **C 1**.
3. (In Simulation: Watch 'C 1' value or move it to MW 0 to see it).
`,
    initialCode: "",
    solutionCode: `A I 0.0
CU C 1
A I 0.1
CD C 1`,
    objectives: ["C 1 increments on I 0.0", "C 1 decrements on I 0.1"]
};
