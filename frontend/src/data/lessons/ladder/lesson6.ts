import type { Lesson } from '../types';

export const L6: Lesson = {
    id: "L6",
    type: "LAD",
    title: "Ladder 6: Mixed Logic (Traffic Light)",
    description: `
### Mixed Logic Challenge
Combine Timers, Comparators, and Logic.

#### Task (Simple Traffic Light)
1. **Start**: Button **I 0.0**.
2. **Timer**: Start a Timer **T 1** (10s).
3. **Red Light (Q 0.0)**: Turns ON if T 1 < 5s.
4. **Green Light (Q 0.1)**: Turns ON if T 1 >= 5s.

**Hint:**
- Use **[ TON ]** for the timer.
- Use **[ < ] (Less Than)**: Compare **T 1** with **500** (5s in 10ms units? No, T 1 value is in units of 10/100ms usually. Actually, checking the raw value of a timer is tricky in simple LAD.
- **Alternative:** Let's use counters!

#### Task (Parking Lot Counter)
1. **Entry Sensor (I 0.0)**: Increments Counter **C 1**.
2. **Exit Sensor (I 0.1)**: Decrements Counter **C 1**.
3. **Full Sign (Q 0.0)**: Turns ON if **C 1 >= 5**. (Lot is full).
`,
    initialCode: "",
    solutionCode: `A I 0.0
CU C 1
A I 0.1
CD C 1

L C 1
L 5
>=I
= Q 0.0`,
    objectives: ["Increment C 1 on Entry", "Decrement C 1 on Exit", "Q 0.0 ON if C 1 >= 5"]
};
