import type { Lesson } from '../types';

export const Lesson6: Lesson = {
    id: "6",
    title: "Lesson 6: Comparators (Temp Control)",
    description: `
### 1. Comparing Values

- **'==I'**: Equal (Integer)
- **'>I'**: Greater Than
- **'<I'**: Less Than

Load two values into Accumulator 'L', then Compare.

#### Example: Is MW 10 > 50?
'''awl
L MW 10
L 50
>I
= Q 0.0   // High if MW 10 > 50
'''

---

### Your Task: Temperature Alarm
Assume 'MW 10' is the temperature sensor.
1. If Temp ('MW 10') > 100, Turn ON Alarm ('Q 0.0').
2. If Temp ('MW 10') < 20, Turn ON Heater ('Q 0.1').
`,
    initialCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // Simulatinon: Use I 0.0 to set Temp to 120.
    A I 0.0
    JCN UP
    L 120
    T MW 10
UP: NOP 0

    // TODO: Compare MW 10 > 100
    L MW 10
    L 100
    // >I ?
    // = Q 0.0
    
    // TODO: Compare MW 10 < 20
    
END_ORGANIZATION_BLOCK`,
    solutionCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // Solution: Temp Control
    
    // Simulation Helper
    A I 0.0
    JCN UP
    L 120
    T MW 10
UP: NOP 0

    // Alarm Logic (> 100)
    L MW 10
    L 100
    >I
    = Q 0.0
    
    // Heater Logic (< 20)
    L MW 10
    L 20
    <I
    = Q 0.1
    
END_ORGANIZATION_BLOCK`,
    objectives: ["Q 0.0 ON if MW 10 > 100", "Q 0.1 ON if MW 10 < 20"]
};
