import type { LadderProgram, LadderElement } from '../types/Ladder';

// Helper to format loose timer values into S5T# format
function formatS5Timer(value: string | undefined): string {
    if (!value) return 'S5T#5S'; // Default
    const v = value.trim();
    // If pure number, assume seconds
    if (/^\d+$/.test(v)) return `S5T#${v}S`;
    // If number + s/ms/m/h, wrap in S5T# if not present
    if (/^\d+[a-zA-Z]+$/.test(v) && !v.toUpperCase().startsWith('S5T#')) return `S5T#${v}`;
    // Return original (e.g. S5T#... or C... or MW...)
    return v;
}

function compileElementList(elements: LadderElement[], isNested: boolean = false): string[] {
    const lines: string[] = [];
    let isFirst = true;

    // Filter out EMPTY elements
    const activeElements = elements.filter(e => e.type !== 'EMPTY');

    if (activeElements.length === 0) return lines;

    activeElements.forEach((el) => {
        // Handle Branching separately as it wraps logic
        if (el.type === 'BRANCH') {
            // S7 STL Pattern for OR logic (A + B):
            // A(
            //    ... Path 1 Logic ...
            //    O ... Path 2 Logic ... (This is simplified, usually valid only for single bits)
            // )
            // Correct robust pattern for complex branches:
            // A(
            //    ... Logic Path 1 ...
            // )
            // O(
            //    ... Logic Path 2 ...
            // )

            // For this compiler, we'll assume the branch starts a new logic block combined with AND to previous.

            // If it's the very first thing (e.g. Start OR Hold), strict S7 might be:
            // O( ... )
            // O( ... )
            // But usually we are extending a chain.

            // Let's implement:
            // A(
            //    O( ... Path 1 ... )
            //    O( ... Path 2 ... )
            // )

            lines.push('A(');

            el.outputs?.forEach((branchPath) => {
                lines.push('O(');
                lines.push(...compileElementList(branchPath, true));
                lines.push(')');
            });

            lines.push(')');
            return;
        }

        switch (el.type) {
            case 'NO':
                // In nested expression context or subsequent elements, standard is A (And)
                // The nesting A( O(...) O(...) ) handles the OR part.
                if (isFirst && !isNested) {
                    // Very first element of Rung (Load)
                    lines.push(`A ${el.address}`);
                    isFirst = false;
                } else {
                    lines.push(`A ${el.address}`);
                }
                break;

            case 'NC':
                lines.push(`AN ${el.address}`);
                break;

            case 'COIL':
                lines.push(`= ${el.address}`);
                break;

            case 'COIL_SET':
                lines.push(`S ${el.address}`);
                break;

            case 'COIL_RESET':
                lines.push(`R ${el.address}`);
                break;

            case 'TIMER_ON': // Simple S7 Timer (SD)
                lines.push(`L ${formatS5Timer(el.operandB)}`);
                lines.push(`SD ${el.address}`);
                lines.push(`A ${el.address}`);
                break;

            case 'TIMER_OFF': // Off-Delay (SF)
                lines.push(`L ${formatS5Timer(el.operandB)}`);
                lines.push(`SF ${el.address}`);
                lines.push(`A ${el.address}`);
                break;

            case 'TIMER_PULSE': // Extended Pulse (SE) - Monostable
                lines.push(`L ${formatS5Timer(el.operandB)}`);
                lines.push(`SE ${el.address}`);
                lines.push(`A ${el.address}`);
                break;

            case 'COUNTER_UP':
                lines.push(`CU ${el.address}`);
                break;

            case 'COUNTER_DOWN':
                lines.push(`CD ${el.address}`);
                break;

            case 'COUNTER_SET':
                lines.push(`L ${el.operandB || '0'}`);
                lines.push(`S ${el.address}`);
                break;

            case 'CMP_EQ':
                lines.push(`L ${el.address}`);
                lines.push(`L ${el.operandB || '0'}`);
                lines.push(`==I`);
                break;

            case 'CMP_GT':
                lines.push(`L ${el.address}`);
                lines.push(`L ${el.operandB || '0'}`);
                lines.push(`>I`);
                break;

            case 'CMP_LT':
                lines.push(`L ${el.address}`);
                lines.push(`L ${el.operandB || '0'}`);
                lines.push(`<I`);
                break;

            case 'CMP_GE':
                lines.push(`L ${el.address}`);
                lines.push(`L ${el.operandB || '0'}`);
                lines.push(`>=I`);
                break;

            case 'CMP_LE':
                lines.push(`L ${el.address}`);
                lines.push(`L ${el.operandB || '0'}`);
                lines.push(`<=I`);
                break;

            case 'CMP_NE':
                lines.push(`L ${el.address}`);
                lines.push(`L ${el.operandB || '0'}`);
                lines.push(`<>I`);
                break;

            case 'MATH_MOV':
                lines.push(`L ${el.address}`);
                lines.push(`T ${el.operandB || 'MW 0'}`);
                break;

            case 'MATH_ADD':
                lines.push(`L ${el.address}`);
                lines.push(`L ${el.operandB || '0'}`);
                lines.push(`+I`);
                lines.push(`T ${el.operandC || 'MW 0'}`);
                break;

            case 'MATH_SUB':
                lines.push(`L ${el.address}`);
                lines.push(`L ${el.operandB || '0'}`);
                lines.push(`-I`);
                lines.push(`T ${el.operandC || 'MW 0'}`);
                break;

            case 'MATH_MUL':
                lines.push(`L ${el.address}`);
                lines.push(`L ${el.operandB || '0'}`);
                lines.push(`*I`);
                lines.push(`T ${el.operandC || 'MW 0'}`);
                break;

            case 'MATH_DIV':
                lines.push(`L ${el.address}`);
                lines.push(`L ${el.operandB || '0'}`);
                lines.push(`/I`);
                lines.push(`T ${el.operandC || 'MW 0'}`);
                break;

            default:
                break;
        }
    });

    return lines;
}

export function compileLadderToSTL(program: LadderProgram): string {
    const lines: string[] = [];

    program.rungs.forEach((rung) => {
        if (rung.comment) {
            lines.push(`// ${rung.comment}`);
        }
        lines.push(...compileElementList(rung.elements));
        lines.push(''); // Empty line between rungs
    });

    return lines.join('\n');
}
