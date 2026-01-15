import type { Lesson } from '../types';

export const Lesson5: Lesson = {
    id: "5",
    title: "Lesson 5: Counters (Product Count)",
    description: `
### 1. Counters

- **'ZV' (Count Up)**: Increments the counter.
- **'ZR' (Count Down)**: Decrements the counter.
- **'S' (Set)**: Presets value.
- **'R' (Reset)**: Zeros the counter.

#### Example: Counting Up
'''awl
A I 0.0
CU C 1    // Count Up Counter 1
'''

---

### Your Task: Conveyor Belt Counter
Count the number of items passing a sensor.
1. Each time Sensor 'I 0.0' triggers (0->1), increment Counter **'C 0'**.
2. If Reset Button 'I 0.1' is pressed, Reset **'C 0'** to 0.
3. Compare: (We will just watch C0 in the Watch Table).
`,
    initialCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    A I 0.0
    CU C 0    // Count Up
    
    A I 0.1
    R C 0     // Reset Counter
    
    // Let's copy Counter value to MW 10 to see it!
    L C 0
    T MW 10
    
END_ORGANIZATION_BLOCK`,
    solutionCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // Solution: Counter
    
    A I 0.0
    CU C 0     // Increment Counter 0
    
    A I 0.1
    R C 0      // Reset Counter 0
    
    // Visualize
    L C 0
    T MW 10
    
END_ORGANIZATION_BLOCK`,
    objectives: ["Increment C 0 on I 0.0", "Reset C 0 on I 0.1", "View value in MW 10"]
};
