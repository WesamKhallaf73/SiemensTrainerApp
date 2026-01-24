import type { Lesson } from '../types';

export const Lesson22: Lesson = {
    id: "22",
    title: "Lesson 22: OB100 vs OB1 (Startup Initialization Explained)",
    description: `
### 1) Why Organization Blocks?

In Siemens PLCs, the program is divided into special blocks called **OBs** (Organization Blocks).  
Each OB runs at a different moment for a specific purpose.

In your simulator we focus on two essential OBs:

- **OB1** → *cyclic*, runs continuously (scan after scan)
- **OB100** → *startup*, runs once when the PLC enters RUN mode

This lesson teaches you exactly how these two OBs interact.

---

### 2) What OB100 Does

OB100 is ideal for:

- Resetting memory bits  
- Loading initial values  
- Setting startup outputs  
- Ensuring safe machine state at power-up  

It runs **exactly once**, then never again unless the PLC restarts.

In this lesson, OB100 will:

- Clear important internal markers (M2.0, M2.2, M2.3)
- Set Q0.2 = 1 at startup (only once)

This allows you to visually confirm that **OB100 has executed**.

---

### 3) What OB1 Does

OB1 runs continuously.

In this lesson, OB1 will:

- Use inputs I0.0 and I0.2 together
- Write to an internal marker M2.1
- Control Q0.2 based on this logic

The key point:

> OB1 runs forever, but OB100 ran only once and affected the initial cycle —  
> You will see that Q0.2 is ON immediately at startup **before OB1 logic modifies it**.

Then OB1 takes over and controls Q0.2 each scan.

---

### 4) Expected Behavior

1) When you start the simulation:
   - OB100 clears M2.0/M2.2/M2.3  
   - OB100 writes Q0.2 = 1  
     → You see Q0.2 ON the **very first scan**

2) After that:
   - OB1 continuously executes:
      - If **I0.0 = 0 AND I0.2 = 0** → M2.1 = 1 → Q0.2 = 1  
      - If any of them = 1 → M2.1 = 0 → Q0.2 = 0

3) This makes it extremely easy to understand:
   - **OB100 = startup setup**
   - **OB1 = cyclic logic**

---

### 5) Key Learning Outcome

Students will clearly see the difference between:
- Start-up initialization  
- Continuous cyclic execution  

This is one of the foundational concepts of real Siemens PLC programming.
`,

    initialCode: `// ------------------ OB100 (Startup - runs once) ------------------
ORGANIZATION_BLOCK OB 100
BEGIN
    // TODO: Reset internal bits for a clean startup state
    // TODO: R M 2.0
    // TODO: R M 2.2
    // TODO: R M 2.3

    // TODO: Set Q0.2 at startup (indicator lamp)
    // TODO: AN I 0.2
    // TODO: = Q 0.2
END_ORGANIZATION_BLOCK


// ------------------ OB1 (Cyclic - runs continuously) ------------------
ORGANIZATION_BLOCK OB 1
BEGIN
    // TODO: Set an internal marker M2.1 based on inputs
    // TODO: AN I 0.0
    // TODO: AN I 0.2
    // TODO: = M 2.1

    // TODO: Control Q0.2 based on M2.1
    // TODO: A M 2.1
    // TODO: = Q 0.2
END_ORGANIZATION_BLOCK`,

    solutionCode: `// ------------------ OB100 (Startup - runs once) ------------------
ORGANIZATION_BLOCK OB 100
BEGIN
    // Clear important internal bits at startup
    R M 2.0
    R M 2.2
    R M 2.3

    // Startup indicator (Q0.2 ON at first scan)
    AN I 0.2
    = Q 0.2
END_ORGANIZATION_BLOCK


// ------------------ OB1 (Cyclic - runs continuously) ------------------
ORGANIZATION_BLOCK OB 1
BEGIN
    // Internal logic: M2.1 = TRUE if both inputs are FALSE
    AN I 0.0
    AN I 0.2
    = M 2.1

    // Cyclic control of Q0.2
    A M 2.1
    = Q 0.2
END_ORGANIZATION_BLOCK`,

    objectives: [
        "Understand the difference between OB100 and OB1",
        "Use OB100 to initialize values at startup",
        "Use OB1 for cyclic logic that runs every scan",
        "Observe how OB100 affects the very first scan only",
        "Learn the structure of multi-OB programs like real Siemens PLCs"
    ]
};

