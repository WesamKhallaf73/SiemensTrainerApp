import type { Lesson } from '../types';

export const Lesson10: Lesson = {
    id: "10",
    title: "Lesson 10: Counters (Reliable Counting with MW + FP)",
    description: `
### 1. Why We Build a Counter Like This

Some training/simulation environments implement counters differently.
To make counting 100% clear and reliable, we will build our own counter using:

- **MW** as the counter value (Current Count)
- **FP** to generate one pulse per package
- **+I** to increment
- **Comparison** to detect when the target is reached

This is also excellent training because it shows what counters are doing internally.

---

### 2. The Pattern (Industrial and Simple)

1) Make a one-scan pulse when sensor goes 0 -> 1  
2) IF pulse happened -> count = count + 1  
3) IF reset pressed -> count = 0  
4) If count >= target -> turn ON lamp  

---

### Example: Increment MW20 on pulse

'''awl
A I 0.2
FP M 0.0
JC INC
JU END

INC: L MW 20
     L 1
     +I
     T MW 20
END: NOP 0
'''

---

### Your Task: Count 20 Packages

**Requirements**
1) Each package causes \`I 0.2\` to go 0 -> 1 (use FP).
2) Count packages into \`MW 20\`.
3) Reset count to 0 when \`I 0.3\` is pressed.
4) When MW20 >= 20 -> turn ON Full lamp \`Q 0.0\`.

`,
    initialCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // 1) Reset logic: if I 0.3 ON -> MW20 = 0
    A I 0.3
    // TODO: JC RESET

    // 2) Package pulse: I 0.2 rising edge
    A I 0.2
    // TODO: FP M 0.0
    // TODO: If pulse -> JC INC

    // 3) Output logic: if MW20 >= 20 -> Q0.0 ON
    // TODO: L MW 20
    // TODO: L 20
    // TODO: >=I
    // TODO: = Q 0.0

    JU END

RESET: NOP 0
    // TODO: L 0
    // TODO: T MW 20
    JU END

INC: NOP 0
    // TODO: L MW 20
    // TODO: L 1
    // TODO: +I
    // TODO: T MW 20

END: NOP 0

END_ORGANIZATION_BLOCK`,
    solutionCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // Solution: Count 20 packages using MW20

    // Reset
      A I 0.3
    JC RRR

    // Package pulse
    A I 0.2
    FP M 0.0
    JC INC

    // Lamp condition
    L MW 20
    L 5
    >=I
    = Q 0.0

    JU END

 RRR: NOP 0
    L 0
    T MW 20
    R Q 0.0
    JU END

INC: NOP 0
    L MW 20
    L 1
    +I
    T MW 20
    JU END

END: NOP 0

END_ORGANIZATION_BLOCK`,
    objectives: [
        "Count events safely using FP",
        "Increment a memory word with +I",
        "Use jumps to build clean counter logic",
        "Use comparisons to detect reaching a target"
    ]
};

