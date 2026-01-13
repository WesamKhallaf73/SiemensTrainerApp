export interface Lesson {
    id: string;
    title: string;
    description: string;
    initialCode: string;
    solutionCode: string;
    objectives: string[];
}

export const LESSONS: Lesson[] = [
    {
        id: "1",
        title: "Lesson 1: Basic Logic (AND / OR)",
        description: `
### 1. Introduction to Boolean Logic

In PLC programming, we use logic gates to make decisions.
- **'A' (AND)**: Checks if inputs are TRUE *in series*.
- **'O' (OR)**: Checks if inputs are TRUE *in parallel*.
- **'=' (Assign)**: Writes the result to an Output.

#### Example: A Simple Light Switch
''\`awl
A I 0.0   // Check Switch
= Q 0.0   // Write to Light
''\`

---

### Your Task: The "Two-Hand" Safety Press
To operate a dangerous press machine safely, an operator must press **two buttons simultaneously**.

**Requirements:**
1. Turn on the Press Motor ('Q 0.0') **ONLY** when:
   - Left Button ('I 0.0') is ON
   - **AND**
   - Right Button ('I 0.1') is ON.
`,
        initialCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // TODO: Implement Safety Logic
    
    A I 0.0  // Left Button
    // Add logic here to check Right Button (I 0.1)
    
    // Assign to Output Q 0.0
    
END_ORGANIZATION_BLOCK`,
        solutionCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // Solution: Two-Hand Safety Press
    
    A I 0.0  // Check Left Button
    A I 0.1  // AND Check Right Button
    = Q 0.0  // Assign to Press Motor
    
END_ORGANIZATION_BLOCK`,
        objectives: ["Turn on Q 0.0 only when I 0.0 AND I 0.1 are both TRUE."]
    },
    {
        id: "2",
        title: "Lesson 2: Memory & Latching",
        description: `
### 1. Remembering State (Latching)

Push-buttons are often "momentary". A machine needs to **remember** it was started.
- **'S' (Set)**: Turns a bit ON and *keeps it ON*.
- **'R' (Reset)**: Turns a bit OFF and *keeps it OFF*.

#### Example: Turning on a Fan
''\`awl
A I 0.0   // If Start pressed...
S Q 0.0   // ...SET Fan (Latch)
''\`

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
    },
    {
        id: "3",
        title: "Lesson 3: Organization Blocks (OBs)",
        description: `
### 1. The PLC Operating System

- **'OB 1'**: Main Cycle (Loop).
- **'OB 100'**: Startup (Setup).

#### Example: Initialization
''\`awl
ORGANIZATION_BLOCK OB 100
BEGIN
    L 50
    T MW 0
END_ORGANIZATION_BLOCK
''\`

---

### Your Task: System Ready Status
**Requirements:**
1. Use **'OB 100'** to set the "Ready Flag" ('M 0.0') to TRUE (1) on power-up.
2. Use **'OB 1'** to copy that flag to the Green Light ('Q 0.0').
`,
        initialCode: `// Runs ONCE at startup
ORGANIZATION_BLOCK OB 100
BEGIN
    // TODO: Set M 0.0 to 1
    
END_ORGANIZATION_BLOCK

// Runs Repeatedly
ORGANIZATION_BLOCK OB 1
BEGIN
    // TODO: Copy M 0.0 to Q 0.0
    
END_ORGANIZATION_BLOCK`,
        solutionCode: `// Solution: System Ready Status

ORGANIZATION_BLOCK OB 100
BEGIN
    // Set Ready Flag at Startup
    SET      // Force RLO=1
    S M 0.0
END_ORGANIZATION_BLOCK

ORGANIZATION_BLOCK OB 1
BEGIN
    // Copy Flag to Light
    A M 0.0
    = Q 0.0
END_ORGANIZATION_BLOCK`,
        objectives: ["Set M 0.0 in OB 100", "Verify Q 0.0 is ON at startup"]
    },
    {
        id: "4",
        title: "Lesson 4: Timers (Staircase Light)",
        description: `
### 1. Timers

- **'SD' (On-Delay)**: Wait before turning ON.
- **'SE' (Extended Pulse)**: Turn ON immediately, then OFF after time.

#### Example: 2s Pulse
''\`awl
A I 0.0
L S5T#2S
SE T 1
''\`

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
    },
    {
        id: "5",
        title: "Lesson 5: Counters (Product Count)",
        description: `
### 1. Counters

- **'ZV' (Count Up)**: Increments the counter.
- **'ZR' (Count Down)**: Decrements the counter.
- **'S' (Set)**: Presets value.
- **'R' (Reset)**: Zeros the counter.

#### Example: Counting Up
''\`awl
A I 0.0
CU C 1    // Count Up Counter 1
''\`

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
    },
    {
        id: "6",
        title: "Lesson 6: Comparators (Temp Control)",
        description: `
### 1. Comparing Values

- **'==I'**: Equal (Integer)
- **'>I'**: Greater Than
- **'<I'**: Less Than

Load two values into Accumulator 'L\', then Compare.

#### Example: Is MW 10 > 50?
''\`awl
L MW 10
L 50
>I
= Q 0.0   // High if MW 10 > 50
''\`

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
    },
    {
        id: "7",
        title: "Lesson 7: Math Operations",
        description: `
### 1. Integer Math

- **'+I'**: Add
- **'-I'**: Subtract
- **'*I'**: Multiply

#### Example: Add 5 to MW 0
''\`awl
L MW 0
L 5
+I
T MW 0
''\`

---

### Your Task: Product Totals
We have two production lines.
- Line A count: 'MW 0'.
- Line B count: 'MW 2'.
- Calculate Total: 'MW 4 = MW 0 + MW 2'.
`,
        initialCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // Setup Test Values
    L 10
    T MW 0
    L 5
    T MW 2
    
    // TODO: Calculate Total
    L MW 0
    L MW 2
    // +I
    // T MW 4
    
END_ORGANIZATION_BLOCK`,
        solutionCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // Solution: Math
    
    // Setup Values
    L 10
    T MW 0
    L 5
    T MW 2
    
    // Calculate Total
    L MW 0
    L MW 2
    +I      // Add Accumulator 1 + Accumulator 2
    T MW 4  // Store Result
    
END_ORGANIZATION_BLOCK`,
        objectives: ["MW 4 should equal 15"]
    },
    {
        id: "8",
        title: "Lesson 8: Data Blocks",
        description: `
### 1. Data Blocks (DBs)

DBs are where we store long-term data (Recipes, Settings).
- **'DBW'**: Data Word (16-bit).

#### Example: Reading a DB
''\`awl
L DB1.DBW 0   // Load Word 0 from DB 1
''\`

---

### Your Task: Recipe Loader
We have a "Target Speed" stored in 'DB 1'.
1. Define 'DATA_BLOCK DB 1' with a value of 500.
2. In 'OB 1\', Read 'DB1.DBW 0' and Transfer it to 'MW 10'.
`,
        initialCode: `DATA_BLOCK DB 1
    STRUCT
        Speed : INT := 500;
    END_STRUCT
BEGIN
END_DATA_BLOCK

ORGANIZATION_BLOCK OB 1
BEGIN
    // TODO: Read DB1.DBW 0 and transfer to MW 10
    
END_ORGANIZATION_BLOCK`,
        solutionCode: `DATA_BLOCK DB 1
    STRUCT
        Speed : INT := 500;
    END_STRUCT
BEGIN
END_DATA_BLOCK

ORGANIZATION_BLOCK OB 1
BEGIN
    // Solution: DB Read
    
    L DB1.DBW 0   // Load from DB
    T MW 10       // Store to Memory Word
    
END_ORGANIZATION_BLOCK`,
        objectives: ["MW 10 should become 500"]
    },
    {
        id: "9",
        title: "Lesson 9: Jumps & Loops",
        description: `
### 1. Conditional Jumps

Sometimes we want to skip code.
- **'JC Label'**: Jump if RLO is 1 (True).
- **'JCN Label'**: Jump if RLO is 0 (False).
- **'JU Label'**: Jump Unconditionally (Always).

#### Example: Skip Logic if Input is OFF
''\`awl
    A I 0.0     // Check Input
    JCN SKIP    // If 0, Jump to SKIP
    S Q 0.0     // Else, Set Output
SKIP: NOP 0
''\`

#### Warning: Output Persistence
If you jump over an assignment ('= Q 0.0'), the output **retains its last value**! It does not automatically turn off. You usually need to explicitly Reset it.

---

### Your Task: Manual Override
1. Low Oil Pressure Alarm ('Q 0.0') normally turns on if 'M 10.0' is True.
2. BUT, if Override Switch ('I 0.0') is ON, **Force the Alarm OFF**.
`,
        initialCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // 1. Simulation Setup: Force Oil Pressure Low (Alarm condition)
    // We use 'SET' to force the RLO to 1, ensuring 'S' works.
    SET
    S M 10.0
    
    // 2. Override Logic
    A I 0.0      // Override Switch
    
    // TODO: IF Override is ON -> Jump to 'SAFE' label
    // Hint: Use 'JC' (Jump Conditional)
    
    // 3. Normal Alarm Logic (Runs if Override is OFF)
    A M 10.0
    = Q 0.0
    
    // TODO: Jump over the 'SAFE' block so we don't turn off the alarm accidentally
    // Hint: Use 'JU' (Jump Unconditional) to 'END'
    
SAFE: NOP 0
    // TODO: Manual Override Action
    // Hint: Explicitly Turn OFF Q 0.0 here using 'R'
    
END: NOP 0
    
END_ORGANIZATION_BLOCK`,
        solutionCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // Solution: Manual Override
    
    // Setup
    SET
    S M 10.0
    
    // Logic
    A I 0.0     // Check Override
    JC SAFE     // Jump if True
    
    // Normal Operation
    A M 10.0
    = Q 0.0
    
    JU END      // Skip Safety Block
    
SAFE: 
    R Q 0.0     // Force OFF
    
END: NOP 0
    
END_ORGANIZATION_BLOCK`,
        objectives: ["Q 0.0 is ON when I 0.0 is OFF", "Q 0.0 is OFF (or skipped) when I 0.0 is ON"]
    },
    {
        id: "10",
        title: "Lesson 10: Edge Detection (One-Shots)",
        description: `
### 1. Rising & Falling Edges

Sometimes you only want to do something **once** when a button is pressed, not continuously while it is held.
- **'FP' (Positive Edge / Rising)**: Pulse when signal goes 0 -> 1.
- **'FN' (Negative Edge / Falling)**: Pulse when signal goes 1 -> 0.

Edges require a **Memory Bit** to store the previous state.

#### Example: Catching a Rising Edge
''\`awl
A I 0.0
FP M 0.0    // M 0.0 stores history
= M 0.1     // M 0.1 is TRUE for exactly ONE cycle
''\`

---

### Your Task: Toggle Switch
Make a button act like a Toggle (Push-On, Push-Off).
1. Detect Rising Edge of Button 'I 0.0'.
2. Use that edge to **XOR** the Output 'Q 0.0' (Flip its state).
`,
        initialCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // 1. Detect Rising Edge of I 0.0
    A I 0.0
    // TODO: Use 'FP' with a helper memory (e.g., M 10.0)
    // FP M 10.0
    // = M 10.1  (The Edge Pulse)

    // 2. Toggle Q 0.0
    // Logic: If (Edge is True) AND (Q 0.0 is False) -> Set Q 0.0
    //        If (Edge is True) AND (Q 0.0 is True)  -> Reset Q 0.0
    // Hint: Or use XOR word logic: L QB 0, XOW ..., T QB 0
    
    // Simpler Toggle Logic for you to implement:
    A M 10.1    // The Edge
    AN Q 0.0
    S M 10.2    // Request Set
    
    A M 10.1
    A Q 0.0
    S M 10.3    // Request Reset
    
    A M 10.2
    S Q 0.0
    R M 10.2
    
    A M 10.3
    R Q 0.0
    R M 10.3
    
END_ORGANIZATION_BLOCK`,
        solutionCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // Solution: Toggle Switch
    
    // 1. Edge Detection
    A I 0.0
    FP M 10.0
    = M 10.1    // One-Shot Pulse
    
    // 2. Toggle Logic (XOR approach)
    A M 10.1    // If Pulse...
    JCN END
    
    L QB 0      // Load Output Byte
    L 1         // Load Bit Mask (0000 0001)
    XOW         // XOR (Flips the bit)
    T QB 0      // Save back
    
END: NOP 0

END_ORGANIZATION_BLOCK`,
        objectives: ["Q 0.0 flips state each time I 0.0 is pressed"]
    },
    {
        id: "11",
        title: "Lesson 11: Word Logic (Hex & Masks)",
        description: `
### 1. Bitwise Operations

We can manipulate 16 bits at once using Word Logic.
- **'WAND'**: Word AND (Masking).
- **'WOR'**: Word OR (Merging).
- **'XOW'**: Word XOR (Toggling).

#### Example: Masking
Only keep the lower 4 bits of MW 10.
''\`awl
L MW 10      // e.g. 2#1111_1111
L W#16#000F  // Mask 2#0000_1111
WAND
T MW 12      // Result 2#0000_1111
''\`

---

### Your Task: Filter Status
We read a "Status Word" from Input Word 'IW 0'.
- We only care about **Bit 4** (Value 16 or 0x10).
- If Bit 4 is ON, turn on 'Q 0.0'.
- **Do not use 'A I 0.4'**. You must use Word Logic.
`,
        initialCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // Simulation: Force some inputs
    L 2#0001_0000
    T IW 0
    
    // TODO: Load IW 0
    // TODO: Load Mask for Bit 4 (Hex 10)
    // TODO: WAND
    // TODO: Compare if Result != 0
    
END_ORGANIZATION_BLOCK`,
        solutionCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // Solution: Filter Bit 4
    
    // Sim Input
    L 2#0001_0000
    T IW 0
    
    L IW 0
    L W#16#0010   // Mask for Bit 4
    WAND          // Result is 0x10 if bit is true, 0x00 if false
    
    L 0
    <>I           // Check if Result != 0
    = Q 0.0
    
END_ORGANIZATION_BLOCK`,
        objectives: ["Q 0.0 ON if IW 0 Bit 4 is High (using WAND)"]
    },
    {
        id: "12",
        title: "Lesson 12: Real Math (Floating Point)",
        description: `
### 1. Real Numbers (32-bit Float)

Integers have limits. Reals allow decimals (e.g., 3.14).
- **'L 3.14'**: Load Real constant.
- **'+R'**: Add Real.
- **'*R'**: Multiply Real.
- **'MD'**: Memory Double Word (32-bit) is required for Reals.

#### Example: Double a value
''\`awl
L MD 0
L 2.0   // Must be 2.0, not 2
*R
T MD 4
''\`

---

### Your Task: Circle Area
Calculate the Area of a Circle: $Area = Radius * Radius * 3.14$
1. Radius is in **'MD 0'** (Set it to 10.0).
2. Store Result in **'MD 4'**.
`,
        initialCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // 1. Setup Radius
    L 10.0
    T MD 0
    
    // TODO: Load Radius
    // TODO: Multiply by Radius
    // TODO: Load PI (3.14159)
    // TODO: Multiply
    // TODO: Transfer to MD 4
    
END_ORGANIZATION_BLOCK`,
        solutionCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // Solution: Circle Area
    
    L 10.0
    T MD 0
    
    L MD 0       // Radius
    L MD 0       // Radius
    *R           // r^2
    
    L 3.14159    // Pi
    *R           // Area
    T MD 4
    
END_ORGANIZATION_BLOCK`,
        objectives: ["MD 4 should be approx 314.159"]
    },
    {
        id: "13",
        title: "Lesson 13: Type Conversion",
        description: `
### 1. Mixing Types

You cannot add an INT to a REAL directly. You must convert first.
- **'ITD'**: Integer (16-bit) -> Double Int (32-bit).
- **'DTR'**: Double Int (32-bit) -> Real (32-bit Float).
- **'RND'**: Real -> Double Int (Round).

#### Example: Int to Real
''\`awl
L MW 0    // Load Int
ITD       // Convert to DINT
DTR       // Convert to Real
T MD 4    // Store as Real
''\`

---

### Your Task: Sensor Scaling
An Analog Sensor gives an Integer (0-27648). Setup: 'MW 0 = 13824'.
1. Convert this Raw Integer to a Real (0.0 - 100.0%).
2. Formula: $Scaled = (Raw / 27648.0) * 100.0$
`,
        initialCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // Setup Raw Value (Half Scale)
    L 13824
    T MW 0
    
    // TODO: Load MW 0
    // TODO: Convert ITD, then DTR
    // TODO: Divide by 27648.0
    // TODO: Multiply by 100.0
    // TODO: Store in MD 10
    
END_ORGANIZATION_BLOCK`,
        solutionCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // Solution: Scaling
    
    L 13824
    T MW 0
    
    L MW 0       // Load Raw Int
    ITD          // To Double
    DTR          // To Real
    
    L 27648.0
    /R           // Normalize (0.0 - 1.0)
    
    L 100.0
    *R           // Scale to Percentage
    T MD 10      // Result should be 50.0
    
END_ORGANIZATION_BLOCK`,
        objectives: ["MD 10 should be 50.0"]
    },
    {
        id: "14",
        title: "Lesson 14: Shift & Rotate",
        description: `
### 1. Moving Bits

Refining control over bits.
- **'SLW N'**: Shift Left Word by N bits. (Zeros fill right).
- **'SRW N'**: Shift Right Word by N bits.
- **'ROL'**: Rotate Left (Bits wrap around).

Example: '2#0001' shifted left 1 becomes '2#0010'.

---

### Your Task: Running Light
Every time you press 'I 0.0\', shift the light pattern in 'QW 0' to the left by 1.
1. Initialize 'QW 0' to 1 if it is 0.
2. If 'I 0.0' has a Rising Edge, **SLW 1**.
3. If 'QW 0' becomes 0 (overflowed), reset it to 1.
`,
        initialCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // 1. Init: If QW 0 is 0, make it 1
    L QW 0
    L 0
    ==I
    JCN OK
    L 1
    T QW 0
OK: NOP 0

    // 2. Shift on Edge of I 0.0
    A I 0.0
    FP M 0.0
    JCN END
    
    // TODO: Load QW 0
    // TODO: SLW 1
    // TODO: T QW 0
    
END: NOP 0

END_ORGANIZATION_BLOCK`,
        solutionCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // Solution: Running Light
    
    // Init
    L QW 0
    L 0
    ==I
    JCN OK
    L 1
    T QW 0
OK: NOP 0

    // Shift
    A I 0.0
    FP M 0.0
    JCN END
    
    L QW 0
    SLW 1
    T QW 0
    
    // Check Overflow (Optional, keeps it looping)
    L QW 0
    L 0
    ==I
    JCN END
    L 1
    T QW 0
    
END: NOP 0
    
END_ORGANIZATION_BLOCK`,
        objectives: ["QW 0 shifts left on button press"]
    },
    {
        id: "15",
        title: "Lesson 15: The Accumulator Stack",
        description: `
### 1. Understanding the Stack

The CPU has two main registers for math: **ACCU 1** and **ACCU 2**.
- When you **Load** ('L 10'), the old value of ACCU 1 moves to ACCU 2.
- Math instructions usually combine ACCU 1 and ACCU 2.
- **'TAK'**: Toggle Accumulators (Swap ACCU 1 and ACCU 2).
- **'POP'**: Discard ACCU 1, move ACCU 2 to ACCU 1.

#### Example: Reverse Subtraction
Calculate '100 - 20'.
''\`awl
L 20   // ACCU 1 = 20
L 100  // ACCU 1 = 100, ACCU 2 = 20
-I     // 100 - 20 = 80
''\`
If you loaded them in the wrong order, you can use **TAK**.
''\`awl
L 100  // ACCU 1 = 100
L 20   // ACCU 1 = 20, ACCU 2 = 100
TAK    // ACCU 1 = 100, ACCU 2 = 20
-I     // 100 - 20 = 80
''\`

---

### Your Task: Safe Division
Calculate 'MW 0 / MW 2'.
1. If 'MW 2' is 0, output 0 (to avoid error).
2. Otherwise, divide.
Since we need to check 'MW 2' first, we load it first. But division requires 'Value / Divisor'. Use **TAK**!
`,
        initialCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // Setup Test Values
    L 100
    T MW 0
    L 5
    T MW 2
    
    // 1. Check Divisor
    L MW 2
    L 0
    ==I
    JC ZERO
    
    // 2. Perform Division
    // Current Stack: ACCU 1 = 0, ACCU 2 = MW 2
    // We lost MW 2 in the check? No, Reload it.
    
    L MW 2   // Divisor
    L MW 0   // Value
    // Stack: ACCU 1 = MW 0, ACCU 2 = MW 2
    // Is this correct for /I? (ACCU 2 / ACCU 1)
    
    // TODO: Verify order using TAK if needed
    /I
    T MW 4
    JU END
    
ZERO: 
    L 0
    T MW 4
    
END: NOP 0

END_ORGANIZATION_BLOCK`,
        solutionCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // Solution: Stack & Division
    
    // Setup
    L 100
    T MW 0
    L 5
    T MW 2
    
    // Check Divisor
    L MW 2
    L 0
    ==I
    JC ZERO
    
    // Division: (ACCU 2 / ACCU 1)
    // We want: MW 0 / MW 2
    
    L MW 0    // Load Top
    L MW 2    // Load Bottom
    // Stack: ACCU 1 = MW 2, ACCU 2 = MW 0
    // If we divide now, we get MW 0 / MW 2
    
    /I
    T MW 4
    JU END
    
ZERO:
    L 0
    T MW 4
    
END: NOP 0
    
END_ORGANIZATION_BLOCK`,
        objectives: ["MW 4 should be 20"]
    },
    {
        id: "16",
        title: "Lesson 16: Functions (FC)",
        description: `
### 1. Modular Code

Instead of writing everything in OB 1, we use Functions (**FC**).
- **'FUNCTION FC 1'**: Define a block.
- **'CALL FC 1'**: Execute the block.

#### Example:
''\`awl
FUNCTION FC 1 : VOID
BEGIN
    S Q 0.0
END_FUNCTION

ORGANIZATION_BLOCK OB 1
BEGIN
    CALL FC 1
END_ORGANIZATION_BLOCK
''\`

---

### Your Task: Logic in an FC
1. Define **FC 1**.
2. Inside FC 1: If 'I 0.0' is ON, Set 'Q 0.0'.
3. In OB 1: Call FC 1.
`,
        initialCode: `// TODO: Define FUNCTION FC 1
// FUNCTION FC 1 : VOID
// BEGIN
// ... logic ...
// END_FUNCTION

ORGANIZATION_BLOCK OB 1
BEGIN
    // TODO: Call FC 1
    
END_ORGANIZATION_BLOCK`,
        solutionCode: `FUNCTION FC 1 : VOID
BEGIN
    // Logic inside FC
    A I 0.0
    = Q 0.0
END_FUNCTION

ORGANIZATION_BLOCK OB 1
BEGIN
    // Call the Function
    CALL FC 1
    
END_ORGANIZATION_BLOCK`,
        objectives: ["Code compiles and runs with FC 1", "Q 0.0 follows I 0.0"]
    },
    {
        id: "17",
        title: "Lesson 17: Function Blocks (FB & DB)",
        description: `
### 1. Memory Blocks

**FCs** have no memory. **FBs** (Function Blocks) have "Instance Data Blocks" (IDB) to remember values between calls.
- **'FUNCTION_BLOCK FB 1'**: Code.
- **'VAR ... END_VAR'**: Static Variables (Memory).
- **'DATA_BLOCK DB 1 FB 1'**: The Memory for FB 1.
- **'CALL FB 1, DB 1'**: Call code with specific memory.

---

### Your Task: The Counter FB
Create a block that counts how many times **'I 0.0'** is pressed.
1. Define **FB 1** with a variable 'Count : INT'.
2. On Rising Edge of 'I 0.0\', increment 'Count'.
3. Copy 'Count' to 'MW 10' so we can see it.
4. Call it in OB 1 using **DB 1**.
`,
        initialCode: `FUNCTION_BLOCK FB 1
VAR
    Count : INT := 0;
    OldInput : BOOL := FALSE;
END_VAR
BEGIN
    // Edge Detection using Static OldInput
    A I 0.0
    FP #OldInput
    JCN SKIP
    
    // TODO: Increment #Count
    
SKIP: NOP 0

    // TODO: Transfer #Count to MW 10
    
END_FUNCTION_BLOCK

DATA_BLOCK DB 1
STRUCT
    Count : INT := 0;
    OldInput : BOOL := FALSE;
END_STRUCT
BEGIN
    Count := 0;
    OldInput := FALSE;
END_DATA_BLOCK

ORGANIZATION_BLOCK OB 1
BEGIN
    // TODO: Call FB 1 with DB 1
    // Workaround: Use OPN + UC
    OPN DI 1
    UC FB 1
    
END_ORGANIZATION_BLOCK`,
        solutionCode: `FUNCTION_BLOCK FB 1
VAR
    Count : INT := 0;
    OldInput : BOOL := FALSE;
END_VAR
BEGIN
    // Edge Detection
    A I 0.0
    FP #OldInput
    JCN SKIP
    
    // Increment
    L #Count
    L 1
    +I
    T #Count
    
SKIP: NOP 0

    // Output
    L #Count
    T MW 10
    
END_FUNCTION_BLOCK

DATA_BLOCK DB 1
STRUCT
    Count : INT := 0;
    OldInput : BOOL := FALSE;
END_STRUCT
BEGIN
    Count := 0;
    OldInput := FALSE;
END_DATA_BLOCK

ORGANIZATION_BLOCK OB 1
BEGIN
    // Workaround: Use OPN + UC to avoid simulator strict calling checks
    OPN DI 1    // Open Instance DB
    UC FB 1     // Unconditional Call
END_ORGANIZATION_BLOCK`,
        objectives: ["MW 10 increases on every I 0.0 press"]
    },
    {
        id: "18",
        title: "Lesson 18: Loops",
        description: `
### 1. The LOOP Instruction

**'LOOP Label'**:
1. Decrements **ACCU 1-Low Word** by 1.
2. If result != 0, Jumps to **Label**.
3. If result == 0, Continues.

Load the loop count into ACCU 1 first!

#### Example: Run 5 times
''\`awl
L 5
NEXT: T MW 10  // Store loop counter (5,4,3,2,1)
LOOP NEXT
''\`

---

### Your Task: Summation
Calculate Sum of numbers 1 to 5 (1+2+3+4+5 = 15).
Use 'MW 0' for the Sum.
Use 'MW 2' for the Loop Counter.
`,
        initialCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // Init Sum
    L 0
    T MW 0
    
    // Init Loop Counter (5 Iterations)
    L 5
    
NEXT: T MW 2   // Save Counter (Starts at 5)

    
    // TODO: Add Counter (MW 2) to Sum (MW 0)
    
    // TODO: Load Counter (MW 2) back into ACCU 1 for the LOOP instruction
    // LOOP NEXT
    
END_ORGANIZATION_BLOCK`,
        solutionCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // Init Sum
    L 0
    T MW 0
    
    // Loop 5 times
    L 5
    
NEXT: T MW 2        // Loop Counter
    
    // Sum = Sum + Counter
    L MW 0
    L MW 2
    +I
    T MW 0
    
    // Prepare for Loop
    L MW 2          // Load current count
    LOOP NEXT       // Decs count, Jumps if > 0
    
END_ORGANIZATION_BLOCK`,
        objectives: ["MW 0 should be 15"]
    },
    {
        id: "19",
        title: "Lesson 19: Indirect Addressing (Pointers)",
        description: `
### 1. Pointers

The most advanced topic! We can read memory dynamically.
- **'LAR1 P#10.0'**: Load Address Register 1 with pointer to Byte 10.0.
- **'L MW [AR1, P#0.0]'**: Load Word at (AR1 + Offset).

#### Example: Read MW 10 via Pointer
''\`awl
LAR1 P#10.0
L MW [AR1, P#0.0]  // Effectively L MW 10
''\`

---

### Your Task: Dynamic Read
1. We have a target address in 'MW 0' (e.g., 20).
2. We want to read 'MW 20'.
3. You need to construct a Pointer from 'MW 0'.
   - Pointer Format: Byte.Bit (last 3 bits are bit).
   - Tip: **SLD 3** (Shift Left Double 3) converts a Byte Number to a Pointer format (Byte.0).
`,
        initialCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // Setup: We want to read MW 20, which has value 999
    L 999
    T MW 20
    
    // "Pointer": We want address 20
    L 20
    T MW 0
    
    // TODO: Create Pointer
    L MW 0
    // SLD 3    (Shift to make room for bit address 0-7)
    // LAR1     (Load AR1)
    
    // TODO: Read via AR1
    // L MW [AR1, P#0.0]
    // T MW 2  (Should be 999)
    
END_ORGANIZATION_BLOCK`,
        solutionCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // Setup Data
    L 999
    T MW 20
    
    L 20
    T MW 0      // We want to point to address 20
    
    // Make Pointer
    L MW 0
    SLD 3       // Convert Integer 20 to Pointer 20.0
    LAR1        // Load into Address Register 1
    
    // Read Indirectly
    L MW [AR1, P#0.0]  // Access Address stored in AR1
    T MW 2             // Verify it is 999
    
END_ORGANIZATION_BLOCK`,
        objectives: ["MW 2 should be 999"]
    }
];
