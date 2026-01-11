import React, { useState } from 'react';
import { Clock, Database } from 'lucide-react';
import clsx from 'clsx';

interface WatchTableProps {
    cpuState: any;
}

export const WatchTable: React.FC<WatchTableProps> = ({ cpuState }) => {
    const [activeTab, setActiveTab] = useState<'T' | 'M' | 'DB'>('T');

    if (!cpuState) {
        return <div className="p-4 text-center text-gray-400 text-sm">No CPU State Available</div>;
    }

    const timers = cpuState.T || {};
    // Convert to array and sort
    const timerList = Object.keys(timers).map(k => ({ id: k, ...timers[k] })).sort((a, b) => parseInt(a.id) - parseInt(b.id));

    return (
        <div className="flex flex-col h-full bg-white border-t">
            {/* Tabs */}
            <div className="flex border-b bg-gray-50">
                <button
                    className={clsx("px-4 py-2 text-sm font-medium flex items-center gap-2", activeTab === 'T' ? "bg-white text-siemens-teal border-b-2 border-siemens-teal" : "text-gray-500 hover:text-gray-700")}
                    onClick={() => setActiveTab('T')}
                >
                    <Clock size={14} /> Timers
                </button>
                <button
                    className={clsx("px-4 py-2 text-sm font-medium flex items-center gap-2", activeTab === 'M' ? "bg-white text-siemens-teal border-b-2 border-siemens-teal" : "text-gray-500 hover:text-gray-700")}
                    onClick={() => setActiveTab('M')}
                >
                    <div className="font-mono font-bold">M</div> Memory
                </button>
                <button
                    className={clsx("px-4 py-2 text-sm font-medium flex items-center gap-2", activeTab === 'DB' ? "bg-white text-siemens-teal border-b-2 border-siemens-teal" : "text-gray-500 hover:text-gray-700")}
                    onClick={() => setActiveTab('DB')}
                >
                    <Database size={14} /> DBs
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-0">
                {activeTab === 'T' && (
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase sticky top-0">
                            <tr>
                                <th className="px-4 py-2">Address</th>
                                <th className="px-4 py-2">Value (s)</th>
                                <th className="px-4 py-2">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {timerList.length === 0 ? (
                                <tr><td colSpan={3} className="p-4 text-center text-gray-400">No active timers</td></tr>
                            ) : (
                                timerList.map((t: any) => (
                                    <tr key={t.id} className="hover:bg-teal-50">
                                        <td className="px-4 py-2 font-mono font-bold">T{t.id}</td>
                                        <td className="px-4 py-2 font-mono">{t.remaining.toFixed(3)}s</td>
                                        <td className="px-4 py-2">
                                            {t.running && <span className="inline-block px-2 py-0.5 rounded text-[10px] bg-blue-100 text-blue-700 font-bold mr-1">RUN</span>}
                                            {t.status === 1 && <span className="inline-block px-2 py-0.5 rounded text-[10px] bg-green-100 text-green-700 font-bold">DONE</span>}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
                {activeTab === 'M' && (
                    <div className="flex flex-col h-full text-xs">
                        {(!cpuState.M) ? (
                            <div className="p-4 text-center text-gray-400">No Memory Data</div>
                        ) : (
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-500 font-mono text-[10px] uppercase sticky top-0">
                                    <tr>
                                        <th className="px-4 py-2">Address</th>
                                        <th className="px-4 py-2">Hex</th>
                                        <th className="px-4 py-2">Dec</th>
                                        <th className="px-4 py-2 hidden sm:table-cell">Binary</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y font-mono">
                                    {(() => {
                                        try {
                                            const binString = window.atob(cpuState.M as string);
                                            const rows = [];
                                            for (let i = 0; i < binString.length; i++) {
                                                const byteVal = binString.charCodeAt(i);
                                                if (byteVal !== 0 || i <= 20) {
                                                    rows.push(
                                                        <tr key={i} className="hover:bg-teal-50">
                                                            <td className="px-4 py-1 font-bold">MB {i}</td>
                                                            <td className="px-4 py-1 text-siemens-teal">{byteVal.toString(16).padStart(2, '0').toUpperCase()}</td>
                                                            <td className="px-4 py-1 text-gray-600">{byteVal.toString(10)}</td>
                                                            <td className="px-4 py-1 text-gray-400 hidden sm:table-cell">{byteVal.toString(2).padStart(8, '0')}</td>
                                                        </tr>
                                                    );
                                                }
                                            }
                                            if (rows.length === 0) return <tr><td colSpan={4} className="p-4 text-center text-gray-400">All Memory Zero</td></tr>;
                                            return rows;
                                        } catch (e) {
                                            return <tr><td colSpan={4} className="p-4 text-red-500">Error decoding Memory</td></tr>;
                                        }
                                    })()}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
                {activeTab === 'DB' && (
                    <div className="flex flex-col h-full text-xs">
                        {Object.keys(cpuState.DB || {}).length === 0 ? (
                            <div className="p-4 text-center text-gray-400">No Data Blocks found</div>
                        ) : (
                            <div className="divide-y border-b">
                                {Object.entries(cpuState.DB || {}).map(([dbIdx, b64Data]) => {
                                    let hexStr = "";
                                    try {
                                        const binString = window.atob(b64Data as string);
                                        const bytes = new Uint8Array(binString.length);
                                        for (let i = 0; i < binString.length; i++) {
                                            bytes[i] = binString.charCodeAt(i);
                                        }
                                        hexStr = Array.from(bytes).map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(' ');
                                    } catch (e) {
                                        hexStr = "Error decoding";
                                    }

                                    return (
                                        <div key={dbIdx} className="p-2 hover:bg-teal-50">
                                            <div className="font-bold text-siemens-teal mb-1">DB {dbIdx}</div>
                                            <div className="font-mono bg-gray-100 p-2 rounded break-all tracking-wider">
                                                {hexStr}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
