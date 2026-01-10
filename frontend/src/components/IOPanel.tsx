import React from 'react';

interface IOPanelProps {
    inputs: Record<string, boolean>; // e.g. {"I0.0": true}
    onToggleInput: (address: string, value: boolean) => void;
    outputs: Record<string, boolean>; // e.g. {"Q0.0": true}
    // TODO: Add support for Memory/DB if needed
}

export const IOPanel: React.FC<IOPanelProps> = ({ inputs, onToggleInput, outputs }) => {

    // Helper to generate grid of bits
    const renderByte = (byteIndex: number, type: 'I' | 'Q', data: Record<string, boolean>, isInput: boolean) => {
        return (
            <div key={`${type}${byteIndex}`} className="mb-4">
                <div className="text-sm font-bold mb-1 text-gray-600">{type}B{byteIndex}</div>
                <div className="flex gap-1">
                    {[7, 6, 5, 4, 3, 2, 1, 0].map(bit => {
                        const addr = `${type}${byteIndex}.${bit}`;
                        const isOn = data[addr] || false;
                        return (
                            <div key={bit} className="flex flex-col items-center">
                                <div
                                    className={`w-8 h-8 flex items-center justify-center border rounded cursor-pointer transition-colors
                    ${isOn
                                            ? (type === 'I' ? 'bg-green-500 text-white' : 'bg-red-500 text-white')
                                            : 'bg-gray-100 hover:bg-gray-200'}`}
                                    onClick={() => isInput && onToggleInput(addr, !isOn)}
                                >
                                    {bit}
                                </div>
                                {/* <span className="text-xs text-gray-500">{bit}</span> */}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="p-4 bg-white shadow rounded h-full overflow-auto">
            <h2 className="text-lg font-bold mb-4">Process Image</h2>

            <div className="mb-6">
                <h3 className="text-md font-semibold text-siemens-teal mb-2">Inputs (I)</h3>
                {/* Render a few input bytes */}
                {renderByte(0, 'I', inputs, true)}
                {renderByte(1, 'I', inputs, true)}
            </div>

            <div className="mb-6">
                <h3 className="text-md font-semibold text-siemens-teal mb-2">Outputs (Q)</h3>
                {renderByte(0, 'Q', outputs, false)}
                {renderByte(1, 'Q', outputs, false)}
            </div>
        </div>
    );
};
