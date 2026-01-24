import type { Lesson } from '../types';

export const Lesson20: Lesson = {
    id: "20",
    title: "Lesson 20: Motor Start/Stop with Fault Interlock",
    description: `
### 1. Why This Logic Is Critical

This is the most common PLC motor logic in the world.

A correct motor control must:
- Start on START
- Stay ON (seal-in)
- Stop on STOP
- Stop immediately on FAULT
- Require manual RESET after fault

If you understand this lesson, you understand **industrial PLC basics**.

---

### 2. Motor Control Rules

1) START (I0.0) turns motor ON  
2) Motor stays ON using a latch (M0.5)  
3) STOP (I0.1) turns motor OFF  
4) FAULT (I0.2) turns motor OFF and latches fault  
5) RESET (I0.3) clears fault latch  
6) Motor cannot start if fault is active  

---

### 3. What You Will See

- Press START → motor runs
- Press STOP → motor stops
- Trigger FAULT → motor stops and cannot restart
- Clear fault input → motor still blocked
- Press RESET → motor can start again

This is **exactly how real machines behave**.

`,

    initialCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // -------------------------
    // 1) Fault latch (reuse from Lesson 19)
    // TODO: A I 0.2
    // TODO: S M 0.4

    // TODO: A I 0.3
    // TODO: R M 0.4


    // -------------------------
    // 2) Motor stop conditions
    // STOP button OR FAULT
    // TODO: A I 0.1
    // TODO: O M 0.4
    // TODO: R M 0.5


    // -------------------------
    // 3) Motor start (only if no fault)
    // TODO: A I 0.0
    // TODO: AN M 0.4
    // TODO: S M 0.5


    // -------------------------
    // 4) Motor output
    // TODO: A M 0.5
    // TODO: = Q 0.0

END_ORGANIZATION_BLOCK`,

    solutionCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // -------- 1) Fault latch --------
    A I 0.2        // Fault detected
    S M 0.4        // Latch fault

    A I 0.3        // Fault reset
    R M 0.4


    // -------- 2) Stop logic --------
    A I 0.1        // Stop button
    O M 0.4        // OR fault
    R M 0.5        // Reset motor latch


    // -------- 3) Start logic --------
    A I 0.0        // Start button
    AN M 0.4       // Only if no fault
    S M 0.5        // Latch motor ON


    // -------- 4) Motor output --------
    A M 0.5
    = Q 0.0

END_ORGANIZATION_BLOCK`,

    objectives: [
        "Build a classic motor Start/Stop circuit",
        "Implement seal-in (self-holding) logic",
        "Block motor start when a fault exists",
        "Require manual fault reset before restart"
    ]
};
