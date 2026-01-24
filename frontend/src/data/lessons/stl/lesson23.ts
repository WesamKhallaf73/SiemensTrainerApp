import type { Lesson } from '../types';

export const Lesson23: Lesson = {
    id: "23",
    title: "Lesson 23: Startup Initialization of Parameters (MW)",
    description: `
### 1) Why Initialize Parameters?

Real PLC projects always have tunable parameters:
- speed setpoints
- alarm thresholds
- limits and presets
- mode numbers (Auto/Manual)
- process constants

If they are not initialized at startup, the PLC may start with old/random values.

✅ **OB100** is used to load safe defaults once at startup.  
✅ **OB1** uses these values every scan.

---

### 2) Our Example Parameters

We will store two parameters (inside the supported MW range):

- **MW2 = SpeedSetpoint** (default = 1200)
- **MW4 = HighSpeedAlarmThreshold** (default = 1500)

Then OB1 will do:

1) **Run Lamp (Q0.0)** ON if SpeedSetpoint ≥ 1000  
2) **High Speed Alarm (Q0.1)** ON if SpeedSetpoint ≥ Threshold (MW4)

This teaches the most realistic use of MW parameters: comparisons and limits.

---

### 3) Optional: Reuse a Fixed TON Delay

To keep the lesson practical, we also show a fixed TON:

- If I0.0 = 1 → after 3 seconds → Q0.2 = 1

(We keep the timer preset fixed here because computing S5TIME from MW is not supported in your simulator.)

---

### Expected Behavior

- Right after startup: MW2=1200, MW4=1500  
  → Q0.0 = 1 (because 1200 ≥ 1000)  
  → Q0.1 = 0 (because 1200 < 1500)

- If you manually change MW2 to 1600 while running:
  → Q0.1 becomes 1 (high speed alarm)

- If you restart PLC:
  → OB100 restores MW2=1200 and MW4=1500 again.

`,
    initialCode: `// ------------------ OB100 (Startup Initialization) ------------------
ORGANIZATION_BLOCK OB 100
BEGIN
    // TODO: SpeedSetpoint default = 1200 -> MW2
    // TODO: L 1200
    // TODO: T MW 2

    // TODO: AlarmThreshold default = 1500 -> MW4
    // TODO: L 1500
    // TODO: T MW 4
END_ORGANIZATION_BLOCK


// ------------------ OB1 (Cyclic Program) ------------------
ORGANIZATION_BLOCK OB 1
BEGIN
    // 1) Run Lamp (Q0.0) ON if MW2 >= 1000
    // TODO: L MW 2
    // TODO: L 1000
    // TODO: >=I
    // TODO: = Q 0.0

    // 2) High Speed Alarm (Q0.1) ON if MW2 >= MW4
    // TODO: L MW 2
    // TODO: L MW 4
    // TODO: >=I
    // TODO: = Q 0.1

    // 3) Optional fixed TON delay demo (Q0.2 after 3s when I0.0=1)
    // TODO: A I 0.0
    // TODO: L S5T#3S
    // TODO: SD T5
    // TODO: A T5
    // TODO: = Q 0.2

END_ORGANIZATION_BLOCK`,
    solutionCode: `// ------------------ OB100 (Load Parameters Once) ------------------
ORGANIZATION_BLOCK OB 100
BEGIN
    // SpeedSetpoint default
    L 1200
    T MW 2

    // High speed alarm threshold
    L 1500
    T MW 4
END_ORGANIZATION_BLOCK


// ------------------ OB1 (Use Parameters Every Scan) ------------------
ORGANIZATION_BLOCK OB 1
BEGIN
    // 1) Run Lamp if SpeedSetpoint >= 1000
    L MW 2
    L 1000
    >=I
    = Q 0.0

    // 2) High speed alarm if SpeedSetpoint >= Threshold
    L MW 2
    L MW 4
    >=I
    = Q 0.1

    // 3) Optional fixed TON delay demo
    A I 0.0
    L S5T#3S
    SD T5

    A T5
    = Q 0.2
END_ORGANIZATION_BLOCK`,
    objectives: [
        "Initialize MW parameters safely in OB100",
        "Use MW parameters in OB1 for comparisons and limits",
        "Observe how runtime changes differ from startup defaults",
        "Reinforce SD (TON) usage with a fixed preset"
    ]
};

