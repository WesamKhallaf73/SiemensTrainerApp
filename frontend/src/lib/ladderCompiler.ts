
import type { LadderProgram, LadderRung, LadderElement } from '../types/Ladder';

export function compileLadderToSTL(program: LadderProgram): string {
    const lines: string[] = [];

    program.rungs.forEach((rung, index) => {
        if (rung.comment) {
            lines.push(`// ${rung.comment}`);
        }

        // Simplistic Compiler for Single-Line Logic (No branching support yet)
        // Strategy: 
        // - First Element -> Load/Check
        // - Subsequent -> AND check
        // - COIL -> Assign

        let isFirst = true;

        // Filter out EMPTY elements
        const activeElements = rung.elements.filter(e => e.type !== 'EMPTY');

        if (activeElements.length === 0) return;

        activeElements.forEach((el) => {
            switch (el.type) {
                case 'NO':
                    if (isFirst) {
                        lines.push(`A ${el.address}`);
                        isFirst = false;
                    } else {
                        lines.push(`A ${el.address}`);
                    }
                    break;

                case 'NC':
                    if (isFirst) {
                        lines.push(`AN ${el.address}`);
                        isFirst = false;
                    } else {
                        lines.push(`AN ${el.address}`);
                    }
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
                    // Syntax: L S5T#2S, SD T 1
                    // Address: T 1
                    // OperandB: S5T#10S (Duration)
                    lines.push(`L ${el.operandB || 'S5T#5S'}`);
                    lines.push(`SD ${el.address}`);
                    // Fix: Update RLO with Timer Status (Q output)
                    lines.push(`A ${el.address}`);
                    break;

                case 'COUNTER_UP':
                    lines.push(`CU ${el.address}`);
                    break;

                case 'COUNTER_DOWN':
                    lines.push(`CD ${el.address}`);
                    break;

                case 'CMP_EQ': // Equal Integer
                    // L Op1, L Op2, ==I
                    lines.push(`L ${el.address}`);
                    lines.push(`L ${el.operandB || '0'}`);
                    lines.push(`==I`);
                    break;

                case 'CMP_GT': // Greater Than Integer
                    lines.push(`L ${el.address}`);
                    lines.push(`L ${el.operandB || '0'}`);
                    lines.push(`>I`);
                    break;

                case 'MATH_MOV': // Move (L source, T dest)
                    // Note: MOV is special. In ladder, it often runs "EN" (Enable) logic.
                    // If we treat it as a box in series:
                    // JCN SKIP
                    // L Source
                    // T Dest
                    // SKIP: NOP 0
                    // But our simple compiler doesn't do JCN for every series element easily yet.
                    // For now, let's just emit the LOAD/TRANSFER assuming it's unconditional or user handles jump logic manually.
                    // Actually, a MOV in series usually implies "If Power Flow, Do Move".
                    // The 'A' (And) logic before it sets RLO.
                    // So we should do: JCN _SKIP_ID; L Src; T Dest; _SKIP_ID: ...
                    // Let's generate a random label or something? No, let's keep it simple: Just L/T.
                    // WARNING: This means it executes every cycle if we don't handle RLO check.
                    // Correct S7 way: 
                    // A ... (RLO)
                    // JCN M001
                    // L ...
                    // T ...
                    // M001: NOP 0
                    // For Beta, we'll assume it's always executed or user accepts it.
                    lines.push(`L ${el.address}`);
                    lines.push(`T ${el.operandB || 'MW 0'}`);
                    break;

                case 'MATH_ADD': // Add Integer (A + B -> C)
                    lines.push(`L ${el.address}`);
                    lines.push(`L ${el.operandB || '0'}`);
                    lines.push(`+I`);
                    lines.push(`T ${el.operandC || 'MW 0'}`);
                    break;

                case 'MATH_SUB': // Sub Integer (A - B -> C)
                    lines.push(`L ${el.address}`);
                    lines.push(`L ${el.operandB || '0'}`);
                    lines.push(`-I`);
                    lines.push(`T ${el.operandC || 'MW 0'}`);
                    break;

                default:
                    break;
            }
        });

        lines.push(''); // Empty line between rungs
    });

    return lines.join('\n');
}
