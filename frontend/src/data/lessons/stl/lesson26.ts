import type { Lesson } from '../types';

export const Lesson26: Lesson = {
    id: "26",
    title: "Lesson 26: FC Parameters (IN / OUT) — Reusable Logic",
    description: `
### 1) Why Parameters?

In Lesson 25, our FC10 produced a result into M2.1.  
That's fine for learning, but not scalable.

Real PLC functions must work like:

> **Inputs in → logic → Output out**  
> with *no hidden markers* inside.

This is how Siemens PLCs achieve:
- reusability  
- predictability  
- modular design  
- easy testing  
- no random side-effects  

Today, we introduce real **function parameters**.

---

### 2) FC Parameters

An FC can have:

- **VAR_INPUT**: read-only parameters  
- **VAR_OUTPUT**: write-only parameters  
- **VAR_IN_OUT**: read/write (like pointer / reference)

In STL, input parameters are referenced as:
- \`#InputName\`  
- \`#OutputName\`

---

### 3) Our Job Today

We will build a reusable function:

## ⭐ FC20: Two-Input AND Gate  
Takes:
- IN1 (BOOL)  
- IN2 (BOOL)

Produces:
- RESULT (BOOL)

This is simple but introduces parameter passing cleanly.

---

### 4) OB1 Test Scenario

OB1 will:
- Pass I0.0 and I0.1 as parameters
- FC20 returns RESULT
- OB1 uses RESULT to drive Q0.0

This proves that:
- FC runs logic internally  
- OB1 can use FC’s output  
- We no longer rely on fixed memory markers

---

### 5) Expected Behavior

| I0.0 | I0.1 | RESULT | Q0.0 |
|------|------|---------|--------|
| 0    | 0    | 0       | 0      |
| 1    | 0    | 0       | 0      |
| 0    | 1    | 0       | 0      |
| 1    | 1    | 1       | 1      |

This teaches your students the "contract" of FCs:
> Inputs in → output result → caller decides what to do with result.

`,
    initialCode: `// ------------------ FC20 (Reusable AND Gate) ------------------
FUNCTION FC 20 : VOID
VAR_INPUT
    IN1 : BOOL;
    IN2 : BOOL;
END_VAR
VAR_OUTPUT
    RESULT : BOOL;
END_VAR
BEGIN
    // TODO: Implement RESULT = IN1 AND IN2
END_FUNCTION



// ------------------ OB1 (Test Function) ------------------
ORGANIZATION_BLOCK OB 1
BEGIN
    // TODO: Call FC20 with real inputs:
    // IN1 := I 0.0
    // IN2 := I 0.1

    // TODO: Output RESULT to Q0.0
END_ORGANIZATION_BLOCK`,

    solutionCode: `// ------------------ FC20 ------------------
FUNCTION FC 20 : VOID
VAR_INPUT
    IN1 : BOOL;
    IN2 : BOOL;
END_VAR
VAR_OUTPUT
    RESULT : BOOL;
END_VAR
BEGIN
    // RESULT = IN1 AND IN2
    A #IN1
    A #IN2
    = #RESULT
END_FUNCTION



// ------------------ OB1 ------------------
ORGANIZATION_BLOCK OB 1
BEGIN
    // Call the function
    CALL FC 20 (
        IN1 := I 0.0,
        IN2 := I 0.1,
        RESULT := M 3.0    // temporary bit to hold result
    )

    // Use the result
    A M 3.0
    = Q 0.0
END_ORGANIZATION_BLOCK`,

    objectives: [
        "Learn FC parameters: IN, OUT",
        "Understand how FCs accept inputs and return outputs cleanly",
        "Write a fully parameterized FC in STL",
        "Call FCs with named parameters",
        "Move toward reusable, modular PLC programming"
    ]
};
