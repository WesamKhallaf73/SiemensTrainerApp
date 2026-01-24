import type { Lesson } from '../types';

export const Lesson21: Lesson = {
    id: "21",
    title: "Lesson 21: Two-Hand Safety Control (Timing Window)",
    description: `
### 1) Why Two-Hand Safety?

Two-hand control is a classic safety pattern used on dangerous machines (presses, cutters, stampers).
The idea is simple:

✅ The machine is allowed to run only if **both hands** are on two separate buttons.  
✅ The two buttons must be pressed **almost at the same time** (within a small time window).  
✅ If any hand is removed → the machine must stop immediately.  
✅ To start a new cycle, the operator must **release both buttons** first.

This prevents one-hand or accidental activation.

---

### 2) Our Goal in This Lesson

We will implement a two-hand enable output:

- **Left button:** I 0.0  
- **Right button:** I 0.1  
- **Machine enable output:** Q 0.0

Rules:

1) When the first button is pressed, a timing window starts (we will use **5 seconds** for training so you can see it clearly).
2) The second button must be pressed **before the window expires**.
3) If both buttons are pressed in time → the system becomes **Accepted**.
4) Once Accepted, Q 0.0 stays ON **as long as both buttons remain pressed**.
5) If either button is released → Q 0.0 turns OFF immediately.
6) A new attempt is allowed only after **both buttons are released** (clean reset).

---

### 3) Tools We Use

- **FP** (Rising edge) to detect the first press (one-scan pulse)
- **SD T5** (TON in your simulator) to represent the allowed window
- Internal markers:
  - **M 2.0** = WindowActive (timer enable)
  - **M 2.2** = Accepted (two-hand success latch)
  - **M 2.3** = edge memory for FP (do not use it for anything else)

We intentionally use M2.x to avoid conflicts with earlier lessons.

---

### Expected Behavior (Try This)

✅ Correct timing:
1) Press I0.0 (or I0.1) → window starts
2) Press the other button within the window → Q0.0 turns ON
3) Keep both pressed → Q0.0 stays ON even after the window time ends

❌ Too slow:
1) Press one button
2) Wait longer than the window
3) Press the other button → Q0.0 stays OFF

✅ Stop / reset:
- Release any button → Q0.0 OFF immediately
- Release both buttons → internal bits reset, ready for the next trial

(After you confirm the logic with 5 seconds, you can change the window to **S5T#800MS**.)

`,
    initialCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // ------------------------------------------------------------
    // TASK: Implement Two-Hand Safety (5s training window)
    // ------------------------------------------------------------
    // Inputs:
    //   I0.0 = Left hand button
    //   I0.1 = Right hand button
    //
    // Output:
    //   Q0.0 = Machine enable
    //
    // Internal markers:
    //   M2.0 = WindowActive
    //   M2.2 = Accepted
    //   M2.3 = FP memory for "first press"

    // 0) FULL RESET when both buttons are OFF:
    //    If I0.0 = 0 AND I0.1 = 0 -> clear M2.0, M2.2, M2.3 and force Q0.0 OFF
    // TODO

    // 1) Start window on FIRST press (either button rising edge):
    //    Detect (I0.0 OR I0.1) rising edge using FP M2.3
    //    If NOT Accepted and NOT WindowActive -> set WindowActive (M2.0)
    // TODO

    // 2) Run TON window timer while WindowActive:
    //    A M2.0
    //    L S5T#5S
    //    SD T5
    // TODO

    // 3) If timer done before acceptance -> close window:
    //    A T5
    //    R M2.0
    // TODO

    // 4) Accept if both buttons are pressed while window is open and time not done:
    //    If I0.0 AND I0.1 AND M2.0 AND (NOT T5) -> set Accepted (M2.2) and clear WindowActive (M2.0)
    // TODO

    // 5) Output:
    //    Q0.0 = Accepted AND I0.0 AND I0.1
    // TODO

END_ORGANIZATION_BLOCK`,
    solutionCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // ------------------------------------------------------------
    // Solution: Two-Hand Safety Control with Timing Window (5s)
    // SD = TON in your simulator (done bit goes 1 after time)
    // ------------------------------------------------------------

    // 0) FULL RESET when both buttons are OFF (ready for next cycle)
    AN I 0.0
    AN I 0.1
    JC L0
    JU L1

L0: NOP 0
    R M 2.0        // WindowActive
    R M 2.2        // Accepted
    R M 2.3        // FP memory
    R Q 0.0
    JU L9


L1: NOP 0
    // 1) Start the window on the FIRST press (either button rising),
    //    but only if not already Accepted and window not active
    A I 0.0
    O I 0.1
    FP M 2.3       // pulse when either becomes ON

    AN M 2.2       // not Accepted
    AN M 2.0       // window not active
    S M 2.0        // WindowActive


    // 2) Run TON while WindowActive
    A M 2.0
    L S5T#5S       // training window; later use S5T#800MS
    SD T5


    // 3) If time expired before acceptance -> close window
    A T5
    R M 2.0


    // 4) Accept if both are pressed while window open and time not done
    A I 0.0
    A I 0.1
    A M 2.0
    AN T5
    S M 2.2        // Accepted
    R M 2.0        // close window after acceptance


    // 5) Output: ON only when Accepted AND both buttons still held
    A M 2.2
    A I 0.0
    A I 0.1
    = Q 0.0

L9: NOP 0
END_ORGANIZATION_BLOCK`,
    objectives: [
        "Implement a two-hand safety control pattern",
        "Start a timing window on the first press using FP",
        "Use SD (TON) as a time window limit",
        "Latch an Accepted condition when both hands arrive in time",
        "Force a full reset when both buttons are released"
    ]
};

