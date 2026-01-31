
export type LadderElementType = 'NO' | 'NC' | 'COIL' | 'EMPTY' | 'BRANCH' | 'TIMER_ON' | 'TIMER_OFF' | 'TIMER_PULSE' | 'COUNTER_UP' | 'COUNTER_DOWN' | 'COUNTER_SET' | 'COIL_SET' | 'COIL_RESET' | 'CMP_EQ' | 'CMP_GT' | 'CMP_LT' | 'CMP_GE' | 'CMP_LE' | 'CMP_NE' | 'MATH_MOV' | 'MATH_ADD' | 'MATH_SUB' | 'MATH_MUL' | 'MATH_DIV';

export interface LadderElement {
    id: string; // Unique ID for keying
    type: LadderElementType;
    address: string; // e.g. "I 0.0", "Q 0.0". For Comparators: Operand A
    operandB?: string; // For Comparators/Math: Operand B
    operandC?: string; // For Math: Destination
    outputs?: LadderElement[][]; // For BRANCH: Array of parallel paths
}

export interface LadderRung {
    id: string;
    elements: LadderElement[];
    comment?: string;
}

export interface LadderProgram {
    rungs: LadderRung[];
}
