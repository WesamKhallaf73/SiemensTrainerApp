import type { Lesson } from '../types';

export const L5: Lesson = {
    id: "L5",
    type: "LAD",
    title: "Ladder 5: Math & Comparators",
    description: `
### Advanced Logic
Ladder can do Math too!
- **[ sum ]**: Add two values.
- **[ > ]**: Compare two values.

#### Task (Threshold Alarm)
1. Add **10** + **MW 0** and store result in **MW 2** using **[ sum ]**.
2. If **MW 2** > **100**, turn on **Q 0.0** using **[ > ]**.
`,
    initialCode: "",
    solutionCode: `L 10
L MW 0
+I
T MW 2

L MW 2
L 100
>I
= Q 0.0`,
    objectives: ["MW 2 = MW 0 + 10", "Q 0.0 ON if MW 2 > 100"]
};
