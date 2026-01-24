import type { Lesson } from '../types';

export const Lesson18: Lesson = {
    id: "18",
    title: "Lesson 18: Interlocks + Start Delay Timer",
    description: `
### 1. Why combine interlocks with timers?

In real industrial systems, motors often start only after:
- ALL safety conditions are OK  
- AND a delay timer has expired  

Examples:
- Fan starts 3 seconds after heater is ON  
- Pump waits 5 seconds after valve opens  
- Motor waits for pressure/temperature stabilization  

This prevents sudden mechanical shock and avoids nuisance trips.

---

### 2. What we will build

Motor Q0.0 starts only if:

#### ✔ Start button (I0.0)  
#### ✔ Emergency stop NOT active (I0.1 = 0)  
#### ✔ Tank NOT empty (I0.2 = 0)  
#### ✔ Temperature OK (I0.3 = 1 → sets M0.0)  
#### ✔ AND the 3-second TON timer T5 has finished  

---

### 3. How the logic flows

1. Build the permissive chain
2. If all OK → enable TON T5  
3. After 3 seconds → T5 = TRUE  
4. Motor Q0.0 turns ON  
5. If any permissive fails → timer resets → motor stops instantly

This is exactly how real PLCs handle “Start Delay with Interlocks”.

`,

    initialCode: `ORGANIZATION_BLOCK OB 1
BEGIN
    // ----------------------
    // 0) Internal Permissive
    // Temperature OK = I0.3
    // TODO: A I 0.3
    // TODO: = M 0.0
    // ----------------------

    // ----------------------
    // 1) Build permissive chain
    // TODO: A I 0.0     // Start
    // TODO: AN I 0.1    // E-stop NOT active
    // TODO: AN I 0.2    // Tank NOT empty
    // TODO: A M 0.0     // Temperature OK
    // ----------------------

    // ----------------------
    // 2) TON Start Delay
    // TODO: L S5T#3S
    // TODO: SD T5
    // ----------------------

    // ----------------------
    // 3) Motor Output
    // TODO: A T5
    // TODO: = Q 0.0
    // ----------------------

END_ORGANIZATION_BLOCK`,

    solutionCode: `ORGANIZATION_BLOCK OB 1
BEGIN
       // -------- 0) Internal Permissive (Temp OK) --------
    A I 0.3
    = M 0.0


    // -------- 1) Interlock Chain --------
    A I 0.0      // Start button
    AN I 0.1     // E-stop NOT active
    AN I 0.2     // Tank OK
    A M 0.0      // Temperature OK


    // -------- 2) TON Start Delay --------
    // "SD" works as a true On-Delay in your simulator
    L S5T#5S
    SD T5


    // -------- 3) Motor starts after delay --------
    A T5
    = Q 0.0

END_ORGANIZATION_BLOCK`,

    objectives: [
        "Combine permissive logic with TON timers",
        "Create a start-delay motor sequence",
        "Reset timers automatically when permissives fail",
        "Understand how TON behaves inside permissive chains"
    ]
};
