import type { Lesson } from '../types';

export const Lesson4: Lesson = {
    id: "4",
    title: "Lesson 4: Timers (Staircase Light)",
    description: `
### 1. Timers

- **'SD' (On-Delay)**: Wait before turning ON.
- **'SE' (Extended Pulse)**: Turn ON immediately, then OFF after time.

#### Example: 2s Pulse
'''awl
A I 0.0
L S5T#2S
SE T 1
'''

---

### Your Task: The Staircase Light
**Requirements:**
1. When Button 'I 0.0' is pressed...
2. Turn on Light 'Q 0.0' immediately.
3. Keep it ON for **5 Seconds**, then turn it OFF automatically.
`,
    initialCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    A I 0.0      // Button pressed
    L S5T#5S     // Load time (5s)
    
    // TODO: Start Timer T 0 as "Extended Pulse" (SE)
    // SE T 0
    
    // TODO: Check if Timer T 0 is active and assign to Q 0.0
    
END_ORGANIZATION_BLOCK`,
    solutionCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // Solution: Staircase Light
    
    A I 0.0
    L S5T#5S
    SE T 0    // Start Extended Pulse Timer
    
    A T 0     // Check Timer Status
    = Q 0.0   // Assign to Light
    
END_ORGANIZATION_BLOCK`,
    objectives: ["Input I 0.0 triggers Q 0.0", "Q 0.0 stays High for 5 seconds"]
};
