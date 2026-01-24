import type { Lesson } from '../types';

export const Lesson16: Lesson = {
    id: "16",
    title: "Lesson 16: Sequencers (Step Logic / State Machine)",
    description: `
### 1. What Is a Sequencer?

Many industrial machines do work in **steps**:
1) Start
2) Prepare
3) Run
4) Stop

This is called a **sequence** (or state machine).

In PLCs, a very common way to build a sequencer is:
- One marker bit per step (only one step should be ON at a time)

Example:
- Step 1 = M10.0
- Step 2 = M10.1
- Step 3 = M10.2

---

### 2. Our 3-Step Training Sequence

We will build a simple and very visible 3-step sequence:

- **Start button**: I0.0  
- **Next button** : I0.1  (advance to the next step)
- **Reset button**: I0.2  (stop everything and return to idle)

**Steps:**
- Step 1 (M10.0) → turns ON Q0.0
- Step 2 (M10.1) → turns ON Q0.1
- Step 3 (M10.2) → turns ON Q0.2

---

### 3. Important Rules

✅ Only one step should be active at a time.  
✅ We should move steps using a **one-shot** pulse (FP), so holding the Next button does not skip steps.

---

### Your Task: Implement the 3-Step Sequencer

**Requirements**
1) Reset:
   - If I0.2 is pressed → clear M10.0, M10.1, M10.2
2) Start:
   - If I0.0 is pressed → set Step1 (M10.0)
3) Next:
   - Each time I0.1 is pressed (rising edge):
     - If Step1 active → Step2 active
     - If Step2 active → Step3 active
4) Outputs:
   - Step1 → Q0.0
   - Step2 → Q0.1
   - Step3 → Q0.2

Try:
- Press Start → Q0.0 ON
- Press Next once → Q0.1 ON
- Press Next once → Q0.2 ON
- Press Reset → all OFF

`,
    initialCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // 1) Reset all steps when I0.2 is pressed
    A I 0.2
    // TODO: JC L0
    JU L1

L0: NOP 0
    // TODO: R M 10.0
    // TODO: R M 10.1
    // TODO: R M 10.2
    JU L9

L1: NOP 0
    // 2) Start -> Step1
    A I 0.0
    // TODO: S M 10.0

    // 3) Create one-shot pulse for Next button
    A I 0.1
    // TODO: FP M 0.0
    // TODO: JC L2
    JU L5

L2: NOP 0
    // 4) If Step1 active -> go Step2
    A M 10.0
    // TODO: JC L3
    JU L4

L3: NOP 0
    // TODO: R M 10.0
    // TODO: S M 10.1
    JU L5

L4: NOP 0
    // 5) If Step2 active -> go Step3
    A M 10.1
    // TODO: JC L6
    JU L5

L6: NOP 0
    // TODO: R M 10.1
    // TODO: S M 10.2
    JU L5

L5: NOP 0
    // 6) Outputs based on steps
    // TODO: A M 10.0 ; = Q 0.0
    // TODO: A M 10.1 ; = Q 0.1
    // TODO: A M 10.2 ; = Q 0.2

L9: NOP 0
END_ORGANIZATION_BLOCK`,
    solutionCode: `ORGANIZATION_BLOCK OB 1
BEGIN

    // ------------------- 1) RESET (highest priority) -------------------
    A I 0.2
    JC L0
    JU L1

L0: NOP 0
    // Clear steps
    R M 10.0
    R M 10.1
    R M 10.2

    // Force outputs OFF immediately (teaching-friendly & safe)
    R Q 0.0
    R Q 0.1
    R Q 0.2

    JU L9

L1: NOP 0
    // ------------------- 2) START (ignore if NEXT is pressed) -------------------
    // If Next is ON, we do not process Start to avoid Start+Next glitches.
    A I 0.1
    JC L2      // skip start logic if Next is pressed
    // Start -> Step1 (only if no step is active)
    A I 0.0
    JC L3
    JU L2

L3: NOP 0
    // Only start if we are idle (no steps active)
    A M 10.0
    O M 10.1
    O M 10.2
    JC L2      // if any step already active, skip starting

    // Set Step1 and clear others
    S M 10.0
    R M 10.1
    R M 10.2

L2: NOP 0
    // ------------------- 3) NEXT (one-shot pulse) -------------------
    A I 0.1
    FP M 0.0
    JC L4
    JU L7

L4: NOP 0
    // If Step1 -> Step2
    A M 10.0
    JC L5
    JU L6

L5: NOP 0
    R M 10.0
    S M 10.1
    R M 10.2
    JU L7

L6: NOP 0
    // If Step2 -> Step3
    A M 10.1
    JC L8
    JU L7

L8: NOP 0
    R M 10.0
    R M 10.1
    S M 10.2
    JU L7

L7: NOP 0
    // ------------------- 4) OUTPUTS (from steps) -------------------
    A M 10.0
    = Q 0.0

    A M 10.1
    = Q 0.1

    A M 10.2
    = Q 0.2

L9: NOP 0
END_ORGANIZATION_BLOCK`,
    objectives: [
        "Build step logic (sequencer) using marker bits",
        "Advance steps using a one-shot pulse (FP)",
        "Ensure only one step is active at a time",
        "Drive outputs from the active step"
    ]
};
