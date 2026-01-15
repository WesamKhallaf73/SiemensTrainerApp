import type { Lesson } from '../types';

export const Lesson8: Lesson = {
    id: "8",
    title: "Lesson 8: Data Blocks",
    description: `
### 1. Data Blocks (DBs)

DBs are where we store long-term data (Recipes, Settings).
- **'DBW'**: Data Word (16-bit).

#### Example: Reading a DB
'''awl
L DB1.DBW 0   // Load Word 0 from DB 1
'''

---

### Your Task: Recipe Loader
We have a "Target Speed" stored in 'DB 1'.
1. Define 'DATA_BLOCK DB 1' with a value of 500.
2. In 'OB 1', Read 'DB1.DBW 0' and Transfer it to 'MW 10'.
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
};
