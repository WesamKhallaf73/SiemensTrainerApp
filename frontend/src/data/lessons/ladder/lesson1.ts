import type { Lesson } from '../types';

export const L1: Lesson = {
    id: "L1",
    type: "LAD",
    title: "Ladder 1: Basic Circuits",
    description: `
### Introduction to Ladder Logic
Ladder Logic (LAD) resembles electrical relay schematics.
- **Left Rail**: Power Source (+24V).
- **Right Rail**: Ground (0V).
- **Contacts**: Switches that open/close (Inputs).
- **Coils**: Devices that turn on (Outputs).

#### Task
Create a simple circuit:
1. Place a **Normally Open (NO)** contact for 'I 0.0'.
2. Place a **Coil** for 'Q 0.0'.
3. Connect them in series.
`,
    initialCode: "",
    solutionCode: `A I 0.0
= Q 0.0`,
    objectives: ["Q 0.0 turns on when I 0.0 is pressed"]
};
