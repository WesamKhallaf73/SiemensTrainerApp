
import React, { useState, useEffect } from 'react';
import type { LadderProgram, LadderRung, LadderElement } from '../types/Ladder';
import { compileLadderToSTL } from '../lib/ladderCompiler';
import { Plus, Trash2 } from 'lucide-react';


interface LadderEditorProps {
    program: LadderProgram;
    onProgramChange: (program: LadderProgram) => void;
    onCodeChange: (stl: string) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const LadderEditor: React.FC<LadderEditorProps> = ({ program, onProgramChange, onCodeChange }) => {
    const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

    // Auto-compile whenever program changes
    useEffect(() => {
        const stl = compileLadderToSTL(program);
        onCodeChange(stl);
    }, [program, onCodeChange]);

    const addRung = () => {
        const newRung: LadderRung = {
            id: generateId(),
            elements: [
                { id: generateId(), type: 'EMPTY', address: '' },
                { id: generateId(), type: 'COIL', address: 'Q 0.0' }
            ]
        };
        onProgramChange({ ...program, rungs: [...program.rungs, newRung] });
    };

    const updateElement = (rungId: string, elId: string, updates: Partial<LadderElement>) => {
        onProgramChange({
            ...program,
            rungs: program.rungs.map(r => {
                if (r.id !== rungId) return r;
                return {
                    ...r,
                    elements: r.elements.map(e => e.id === elId ? { ...e, ...updates } : e)
                };
            })
        });
    };

    const addElement = (rungId: string) => {
        onProgramChange({
            ...program,
            rungs: program.rungs.map(r => {
                if (r.id !== rungId) return r;
                // Add before the last element (usually coil)
                const last = r.elements[r.elements.length - 1];
                const others = r.elements.slice(0, r.elements.length - 1);
                return {
                    ...r,
                    elements: [...others, { id: generateId(), type: 'EMPTY', address: '' }, last]
                };
            })
        });
    };

    const removeRung = (id: string) => {
        onProgramChange({ ...program, rungs: program.rungs.filter(r => r.id !== id) });
    };

    return (
        <div className="h-full flex flex-col bg-gray-50">
            {/* Toolbar */}
            <div className="p-2 bg-white border-b flex items-center gap-4 shadow-sm z-20">
                <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded font-bold text-xs uppercase tracking-wider">
                    Ladder Editor (Beta)
                </div>

                <div className="h-6 w-px bg-gray-300 mx-2"></div>

                <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded border text-sm font-medium transition-colors" title="Add New Rung" onClick={addRung}>
                    <Plus size={16} /> Add Rung
                </button>

                {/* Context Controls for Selected Element */}
                {selectedElementId ? (
                    <div className="flex items-center gap-2 ml-auto animate-in fade-in slide-in-from-top-1 duration-200">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2">Edit Selected:</span>

                        <div className="flex bg-gray-100 rounded p-1 border">
                            <button
                                onClick={() => { updateElement(program.rungs.find(r => r.elements.some(e => e.id === selectedElementId))!.id, selectedElementId, { type: 'NO' }); }}
                                className="px-3 py-1 hover:bg-white hover:shadow-sm rounded text-xs font-bold"
                                title="Normally Open Contact"
                            >
                                NO ┤ ├
                            </button>
                            <button
                                onClick={() => { updateElement(program.rungs.find(r => r.elements.some(e => e.id === selectedElementId))!.id, selectedElementId, { type: 'NC' }); }}
                                className="px-3 py-1 hover:bg-white hover:shadow-sm rounded text-xs font-bold"
                                title="Normally Closed Contact"
                            >
                                NC ┤/├
                            </button>
                            <button
                                onClick={() => { updateElement(program.rungs.find(r => r.elements.some(e => e.id === selectedElementId))!.id, selectedElementId, { type: 'COIL' }); }}
                                className="px-3 py-1 hover:bg-white hover:shadow-sm rounded text-xs font-bold"
                                title="Coil / Output"
                            >
                                ( ) Coil
                            </button>
                            <div className="w-px bg-gray-300 mx-1 my-1"></div>
                            <button onClick={() => { updateElement(program.rungs.find(r => r.elements.some(e => e.id === selectedElementId))!.id, selectedElementId, { type: 'COIL_SET' }); }} className="px-3 py-1 hover:bg-white hover:shadow-sm rounded text-xs font-bold" title="Set Coil">( S )</button>
                            <button onClick={() => { updateElement(program.rungs.find(r => r.elements.some(e => e.id === selectedElementId))!.id, selectedElementId, { type: 'COIL_RESET' }); }} className="px-3 py-1 hover:bg-white hover:shadow-sm rounded text-xs font-bold" title="Reset Coil">( R )</button>
                            <div className="w-px bg-gray-300 mx-1 my-1"></div>
                            <button onClick={() => { updateElement(program.rungs.find(r => r.elements.some(e => e.id === selectedElementId))!.id, selectedElementId, { type: 'TIMER_ON', address: 'T 1' }); }} className="px-3 py-1 hover:bg-white hover:shadow-sm rounded text-xs font-bold" title="On-Delay Timer">TON</button>
                            <button onClick={() => { updateElement(program.rungs.find(r => r.elements.some(e => e.id === selectedElementId))!.id, selectedElementId, { type: 'COUNTER_UP', address: 'C 1' }); }} className="px-3 py-1 hover:bg-white hover:shadow-sm rounded text-xs font-bold" title="Count Up">CTU</button>
                            <button onClick={() => { updateElement(program.rungs.find(r => r.elements.some(e => e.id === selectedElementId))!.id, selectedElementId, { type: 'COUNTER_DOWN', address: 'C 1' }); }} className="px-3 py-1 hover:bg-white hover:shadow-sm rounded text-xs font-bold" title="Count Down">CTD</button>
                            <div className="w-px bg-gray-300 mx-1 my-1"></div>
                            <button onClick={() => { updateElement(program.rungs.find(r => r.elements.some(e => e.id === selectedElementId))!.id, selectedElementId, { type: 'CMP_EQ', address: 'MW 0', operandB: '0' }); }} className="px-3 py-1 hover:bg-white hover:shadow-sm rounded text-xs font-bold" title="Equal (==I)">==</button>
                            <button onClick={() => { updateElement(program.rungs.find(r => r.elements.some(e => e.id === selectedElementId))!.id, selectedElementId, { type: 'CMP_GT', address: 'MW 0', operandB: '0' }); }} className="px-3 py-1 hover:bg-white hover:shadow-sm rounded text-xs font-bold" title="Greater Than (>I)">{' > '}</button>
                            <button onClick={() => { updateElement(program.rungs.find(r => r.elements.some(e => e.id === selectedElementId))!.id, selectedElementId, { type: 'MATH_MOV', address: '0', operandB: 'MW 0' }); }} className="px-3 py-1 hover:bg-white hover:shadow-sm rounded text-xs font-bold" title="Move Value">MOV</button>
                            <button onClick={() => { updateElement(program.rungs.find(r => r.elements.some(e => e.id === selectedElementId))!.id, selectedElementId, { type: 'MATH_ADD', address: '0', operandB: '0', operandC: 'MW 0' }); }} className="px-3 py-1 hover:bg-white hover:shadow-sm rounded text-xs font-bold" title="Add (A+B -> C)">sum</button>
                            <button onClick={() => { updateElement(program.rungs.find(r => r.elements.some(e => e.id === selectedElementId))!.id, selectedElementId, { type: 'MATH_SUB', address: '0', operandB: '0', operandC: 'MW 0' }); }} className="px-3 py-1 hover:bg-white hover:shadow-sm rounded text-xs font-bold" title="Sub (A-B -> C)">sub</button>
                            <div className="w-px bg-gray-300 mx-1 my-1"></div>
                            <button
                                onClick={() => { updateElement(program.rungs.find(r => r.elements.some(e => e.id === selectedElementId))!.id, selectedElementId, { type: 'EMPTY', address: '' }); }}
                                className="px-3 py-1 hover:bg-red-50 text-red-600 rounded text-xs"
                                title="Delete Element"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>

                        {/* Address Input */}
                        {(() => {
                            const activeRung = program.rungs.find(r => r.elements.some(e => e.id === selectedElementId));
                            const activeElement = activeRung?.elements.find(e => e.id === selectedElementId);
                            if (!activeElement || activeElement.type === 'EMPTY') return null;

                            const showOperandB = ['CMP_EQ', 'CMP_GT', 'MATH_MOV', 'TIMER_ON', 'MATH_ADD', 'MATH_SUB'].includes(activeElement.type);
                            const showOperandC = ['MATH_ADD', 'MATH_SUB'].includes(activeElement.type);

                            let labelA = 'Op A / Address';
                            if (activeElement.type === 'MATH_MOV') labelA = 'Source';

                            let labelB = 'Op B';
                            if (activeElement.type === 'MATH_MOV') labelB = 'Dest';
                            if (activeElement.type === 'TIMER_ON') labelB = 'Time';

                            return (
                                <div className="flex gap-2">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-gray-400 font-bold uppercase">{labelA}</span>
                                        <input
                                            className="border rounded px-2 py-1.5 text-sm w-28 focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                                            placeholder="Addr"
                                            value={activeElement.address || ''}
                                            onChange={(e) => updateElement(activeRung!.id, selectedElementId, { address: e.target.value })}
                                        />
                                    </div>
                                    {showOperandB && (
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-gray-400 font-bold uppercase">{labelB}</span>
                                            <input
                                                className="border rounded px-2 py-1.5 text-sm w-28 focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                                                placeholder="Value/Addr"
                                                value={activeElement.operandB || ''}
                                                onChange={(e) => updateElement(activeRung!.id, selectedElementId, { operandB: e.target.value })}
                                            />
                                        </div>
                                    )}
                                    {showOperandC && (
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-gray-400 font-bold uppercase">Result (Dest)</span>
                                            <input
                                                className="border rounded px-2 py-1.5 text-sm w-28 focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                                                placeholder="Dest Addr"
                                                value={activeElement.operandC || ''}
                                                onChange={(e) => updateElement(activeRung!.id, selectedElementId, { operandC: e.target.value })}
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })()}
                    </div>
                ) : (
                    <div className="ml-auto text-sm text-gray-400 italic">
                        Select an element to edit properties
                    </div>
                )}
            </div>

            {/* Canvas */}
            <div className="flex-1 overflow-auto p-4 space-y-6 pb-20">
                {program.rungs.map((rung, rIndex) => (
                    <div key={rung.id} className="relative bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
                        {/* Power Rails Visualization */}
                        <div className="absolute left-2 top-4 bottom-4 w-1 bg-red-500/20 rounded-full"></div>
                        <div className="absolute right-2 top-4 bottom-4 w-1 bg-blue-500/20 rounded-full"></div>

                        <div className="flex items-center gap-0 overflow-x-auto min-h-[80px] px-6 py-2 pb-4 scrollbar-thin">
                            {rung.elements.map((el, index) => (
                                <div key={el.id} className="flex items-center group/item relative">
                                    {/* Wire before */}
                                    {index > 0 && <div className={`h-0.5 w-8 ${el.type === 'EMPTY' ? 'bg-transparent border-b border-dashed border-gray-300' : 'bg-black'}`}></div>}

                                    {/* Element */}
                                    <div
                                        className={`relative w-24 h-20 border-2 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all
                                            ${selectedElementId === el.id ? 'border-blue-500 bg-blue-50 shadow-md scale-105 z-10' : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50 bg-white'}
                                            ${el.type === 'EMPTY' ? 'border-dashed opacity-60 hover:opacity-100' : ''}
                                        `}
                                        onClick={(e) => { e.stopPropagation(); setSelectedElementId(el.id); }}
                                    >
                                        {/* Symbol */}
                                        <div className="font-bold text-xl text-gray-800">
                                            {el.type === 'NO' && '┤  ├'}
                                            {el.type === 'NC' && '┤/ ├'}
                                            {el.type === 'COIL' && '( )'}
                                            {el.type === 'COIL_SET' && '( S )'}
                                            {el.type === 'COIL_RESET' && '( R )'}
                                            {el.type === 'TIMER_ON' && <div className="border border-gray-800 px-1 text-xs bg-yellow-50">TON</div>}
                                            {el.type === 'COUNTER_UP' && <div className="border border-gray-800 px-1 text-xs bg-green-50">CTU</div>}
                                            {el.type === 'COUNTER_DOWN' && <div className="border border-gray-800 px-1 text-xs bg-green-50">CTD</div>}
                                            {el.type === 'CMP_EQ' && <div className="border border-gray-800 px-1 text-xs bg-purple-50">==I</div>}
                                            {el.type === 'CMP_GT' && <div className="border border-gray-800 px-1 text-xs bg-purple-50">{'>I'}</div>}
                                            {el.type === 'MATH_MOV' && <div className="border border-gray-800 px-1 text-xs bg-blue-50">MOV</div>}
                                            {el.type === 'MATH_ADD' && <div className="border border-gray-800 px-1 text-xs bg-blue-50">ADD</div>}
                                            {el.type === 'MATH_SUB' && <div className="border border-gray-800 px-1 text-xs bg-blue-50">SUB</div>}
                                            {el.type === 'EMPTY' && <Plus size={20} className="text-gray-300" />}
                                        </div>

                                        {/* Label / Input */}
                                        {el.type !== 'EMPTY' && (
                                            <div className="mt-2 text-xs font-mono bg-gray-100 px-0.5 py-0.5 rounded text-gray-600 font-semibold max-w-[90%] flex flex-col items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
                                                <div className="truncate px-1 min-w-[30px] text-center" title={el.address}>{el.address || '?'}</div>
                                                {['CMP_EQ', 'CMP_GT', 'MATH_MOV', 'MATH_ADD', 'MATH_SUB'].includes(el.type) && (
                                                    <div className="truncate px-1 min-w-[30px] text-center border-t border-gray-300 w-full" title={el.operandB}>{el.operandB || '?'}</div>
                                                )}
                                                {['MATH_ADD', 'MATH_SUB'].includes(el.type) && (
                                                    <div className="truncate px-1 min-w-[30px] text-center border-t border-gray-300 w-full text-blue-600" title={el.operandC}>= {el.operandC || '?'}</div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Add Button Hint - Always visible but faint */}
                                    {index < rung.elements.length - 1 && (
                                        <div className="relative w-0 flex justify-center z-10">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); addElement(rung.id); }}
                                                className="absolute -ml-3 w-6 h-6 rounded-full bg-white border border-gray-300 text-gray-400 shadow-sm hover:bg-green-500 hover:text-white hover:border-green-600 hover:scale-110 transition-all flex items-center justify-center"
                                                title="Insert Element Here"
                                            >
                                                <Plus size={12} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Rung Actions */}
                        <div className="absolute right-2 top-2">
                            <button onClick={() => removeRung(rung.id)} className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors" title="Delete Rung"><Trash2 size={16} /></button>
                        </div>
                        <div className="absolute left-4 top-2 text-xs font-bold text-gray-400 font-mono tracking-wider">
                            NETWORK {rIndex + 1}
                        </div>
                    </div>
                ))}

                {program.rungs.length === 0 && (
                    <div className="text-center text-gray-400 py-10">
                        No Logic. Click "Add Rung" to start.
                    </div>
                )}
            </div>
        </div>
    );
};
