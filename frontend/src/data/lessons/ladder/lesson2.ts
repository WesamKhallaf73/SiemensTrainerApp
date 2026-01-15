import type { Lesson } from '../types';

export const L2: Lesson = {
    id: "L2",
    type: "LAD",
    title: "Ladder 2: Memory (Set/Reset)",
    description: `
### Latching Memory
In Ladder, we often need to "remember" a state.
- **( S ) Set Coil**: Turns ON and stays ON.
- **( R ) Reset Coil**: Turns OFF.

#### Task
1. Use **I 0.0** to **SET** Coil **Q 0.0**.
2. Use **I 0.1** to **RESET** Coil **Q 0.0**.
`,
    initialCode: "",
    solutionCode: `A I 0.0
S Q 0.0
A I 0.1
R Q 0.0`,
    objectives: ["Q 0.0 stays ON after Start", "Q 0.0 turns OFF after Stop"]
};
