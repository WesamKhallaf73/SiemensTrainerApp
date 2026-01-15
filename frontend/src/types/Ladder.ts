
export type LadderElementType = 'NO' | 'NC' | 'COIL' | 'EMPTY' | 'BRANCH_START' | 'BRANCH_END' | 'TIMER_ON' | 'COUNTER_UP' | 'COUNTER_DOWN' | 'COIL_SET' | 'COIL_RESET' | 'CMP_EQ' | 'CMP_GT' | 'MATH_MOV' | 'MATH_ADD' | 'MATH_SUB';

export interface LadderElement {
    id: string; // Unique ID for keying
    type: LadderElementType;
    address: string; // e.g. "I 0.0", "Q 0.0". For Comparators: Operand A
    operandB?: string; // For Comparators/Math: Operand B
    operandC?: string; // For Math: Destination
}

export interface LadderRung {
    id: string;
    elements: LadderElement[];
    comment?: string;
}

export interface LadderProgram {
    rungs: LadderRung[];
}
