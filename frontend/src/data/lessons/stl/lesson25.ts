import type { Lesson } from '../types';

export const Lesson25: Lesson = {
    id: "25",
    title: "Lesson 25: Why We Need FCs (Functions) + First FC Call",
    description: `
### 1) What Problem Do FCs Solve?

Up to now, we wrote everything inside **OB1** (and sometimes OB100).
This is fine for small demos, but in real projects OB1 becomes a mess:

- Motor logic
- Alarms
- Scaling
- Timers
- Mode selection
- Interlocks

If everything stays in OB1:
- code becomes long
- hard to read
- hard to test
- hard to reuse
- hard to maintain

✅ **FC (Function)** is the next step: we split logic into smaller named blocks.

---

### 2) What is an FC?

An **FC** is a reusable code block.

- FC can be called from OB1 (or other blocks)
- FC can have parameters (**IN**, **OUT**, **IN_OUT**)
- FC does NOT have its own memory (no STAT like FB)
- FC is ideal for “pure logic” that depends only on inputs

Think of FC like a normal programming function:
> You give it inputs, it gives you outputs.

---

### 3) How We Will Use FCs in This Course

We will not jump into complex parameters immediately.

We will start with:
- FC that calculates a result into an internal marker
- OB1 uses that marker to drive outputs

Then later:
- FC with IN/OUT parameters
- Reuse one FC for multiple motors/alarms
- Use FC + DB parameters (clean architecture)

---

### 4) What We Build Now (Very Simple)

We will create:

✅ **FC 10**: generates a permissive \`M2.1\` if:
- I0.0 is OFF
- I0.2 is OFF

This is the same logic you used in Lesson 22, but now:
- logic is inside FC10
- OB1 becomes clean and short

OB100 will still do startup initialization (as before).

---

### Expected Behavior

- FC10 continuously updates M2.1 based on inputs
- OB1 uses M2.1 to drive Q0.2

This proves that:
✅ OB1 can call FCs
✅ FCs can organize your logic cleanly
`,
    initialCode: `// ------------------ FC10 (Function Block of logic) ------------------
FUNCTION FC 10 : VOID
BEGIN
    // TODO: Put logic here to set M2.1
    // Requirements:
    // If I0.0 = 0 AND I0.2 = 0 -> M2.1 = 1
    // Else -> M2.1 = 0
END_FUNCTION


// ------------------ OB100 (Startup) ------------------
ORGANIZATION_BLOCK OB 100
BEGIN
    // TODO: Clear output for safe startup (optional)
    // TODO: R Q 0.2
END_ORGANIZATION_BLOCK


// ------------------ OB1 (Cyclic) ------------------
ORGANIZATION_BLOCK OB 1
BEGIN
    // TODO: Call FC10 here
    // TODO: (call the function)

    // TODO: Use M2.1 result to control Q0.2
    // TODO: A M 2.1
    // TODO: = Q 0.2
END_ORGANIZATION_BLOCK`,
    solutionCode: `// ------------------ FC10 ------------------
FUNCTION FC 10 : VOID
BEGIN
    // M2.1 = TRUE if both inputs are FALSE
    AN I 0.0
    AN I 0.2
    = M 2.1
END_FUNCTION


// ------------------ OB100 ------------------
ORGANIZATION_BLOCK OB 100
BEGIN
    // Safe startup
    R Q 0.2
END_ORGANIZATION_BLOCK


// ------------------ OB1 ------------------
ORGANIZATION_BLOCK OB 1
BEGIN
    // Call the function
    CALL FC 10

    // Use FC result
    A M 2.1
    = Q 0.2
END_ORGANIZATION_BLOCK`,
    objectives: [
        "Understand why FCs are needed (structure, reuse, readability)",
        "Know what an FC is and how it differs from OBs",
        "Write a first simple FC that produces a result in memory",
        "Call an FC from OB1 and use its result for outputs",
        "Prepare for FC parameters (IN/OUT) in the next lesson"
    ]
};
