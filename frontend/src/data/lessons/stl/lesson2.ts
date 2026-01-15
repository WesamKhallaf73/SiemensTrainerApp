import type { Lesson } from '../types';

export const Lesson2: Lesson = {
    id: "2",
    title: "Lesson 2: Memory & Latching",
    description: `
### 1. Remembering State (Latching)

Push-buttons are often "momentary". A machine needs to **remember** it was started.
- **'S' (Set)**: Turns a bit ON and *keeps it ON*.
- **'R' (Reset)**: Turns a bit OFF and *keeps it OFF*.

#### Example: Turning on a Fan
'''awl
A I 0.0   // If Start pressed...
S Q 0.0   // ...SET Fan (Latch)
'''

---

### Your Task: The Motor Starter
Standard Start/Stop control for a conveyor.

**Requirements:**
1. **Start:** If Green Button ('I 0.0') is pressed -> **Set** Motor ('Q 0.0').
2. **Stop:** If Red Button ('I 0.1') is pressed -> **Reset** Motor ('Q 0.0').
`,
    initialCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // 1. Start Logic
    A I 0.0    // Start Button
    S Q 0.0    // Set Motor

    // 2. Stop Logic
    // TODO: Add logic to Reset Q 0.0 if I 0.1 is pressed
    
END_ORGANIZATION_BLOCK`,
    solutionCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // Solution: Motor Start/Stop
    
    // 1. Start Logic
    A I 0.0    // Start Button
    S Q 0.0    // Set Motor
    
    // 2. Stop Logic
    A I 0.1    // Stop Button
    R Q 0.0    // Reset Motor
    
END_ORGANIZATION_BLOCK`,
    objectives: ["Latch Q 0.0 on Start (I 0.0)", "Unlatch Q 0.0 on Stop (I 0.1)"]
};
