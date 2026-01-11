import { useState, useEffect } from 'react'
import { AWLEditor } from './components/AWLEditor'
import { IOPanel } from './components/IOPanel'
import { WatchTable } from './components/WatchTable'
import { Play, Square, RefreshCw, AlertCircle, Layers, Table } from 'lucide-react'
import clsx from 'clsx'

const DEFAULT_CODE = `ORGANIZATION_BLOCK OB 1
BEGIN
    // Simple Latch Example
    // I0.0 = Start, I0.1 = Stop
    A I 0.0
    O Q 0.0
    AN I 0.1
    = Q 0.0
END_ORGANIZATION_BLOCK
`;

function App() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [diagnostics, setDiagnostics] = useState<any[]>([]);
  const [inputs, setInputs] = useState<Record<string, boolean>>({});
  const [outputs, setOutputs] = useState<Record<string, boolean>>({});
  const [cpuState, setCpuState] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<'io' | 'watch'>('io');
  const [cycleTime, setCycleTime] = useState(0);

  const API_URL = "http://localhost:8000/api";

  const handleValidate = async () => {
    try {
      const res = await fetch(`${API_URL}/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source_code: code })
      });
      const data = await res.json();
      setDiagnostics(data.diagnostics);
      return data.ok;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const handleRunCycle = async () => {
    try {
      const start = performance.now();
      const res = await fetch(`${API_URL}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source_code: code,
          inputs: inputs,
          previous_state: cpuState
        })
      });
      const data = await res.json();
      setCycleTime(Math.round(performance.now() - start));

      if (data.ok) {
        setOutputs(data.outputs || {});
        setCpuState(data.state);
        setDiagnostics([]);
      } else {
        setDiagnostics(data.diagnostics);
        setIsRunning(false); // Stop on error
      }
    } catch (e) {
      console.error(e);
      setIsRunning(false);
    }
  };

  // Auto-scan effect
  useEffect(() => {
    let interval: any;
    if (isRunning) {
      interval = setInterval(handleRunCycle, 200); // 200ms scan cycle for simulation
    }
    return () => clearInterval(interval);
  }, [isRunning, cpuState, inputs, code]); // Deps logic needs care to avoid stale closures if not using Refs, but simple polling ok for now

  const handleToggleInput = (addr: string, val: boolean) => {
    setInputs(prev => ({ ...prev, [addr]: val }));
  };

  const handleReset = async () => {
    setCpuState(null);
    setOutputs({});
    setInputs({});
    setIsRunning(false);
    setDiagnostics([]);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b px-4 py-3 flex items-center justify-between shadow-sm">
        <h1 className="text-xl font-bold text-siemens-teal flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          SIMATIC STL Trainer Pro
        </h1>
        <div className="flex gap-2">
          <button
            className={clsx("px-4 py-2 rounded flex items-center gap-2 text-white font-medium", isRunning ? "bg-red-500 hover:bg-red-600" : "bg-green-600 hover:bg-green-700")}
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? <><Square size={16} /> STOP</> : <><Play size={16} /> RUN</>}
          </button>

          <button
            className="px-4 py-2 border rounded hover:bg-gray-50 flex items-center gap-2"
            onClick={handleRunCycle}
            disabled={isRunning}
          >
            Single Scan
          </button>

          <button
            className="px-4 py-2 border rounded hover:bg-gray-50 flex items-center gap-2 text-gray-600"
            onClick={handleValidate}
          >
            Validate
          </button>

          <button
            className="px-3 py-2 border rounded hover:bg-gray-50 text-gray-500"
            onClick={handleReset}
            title="Reset CPU"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor */}
        <div className="flex-1 border-r bg-white p-0 relative">
          <AWLEditor
            value={code}
            onChange={(val) => setCode(val || '')}
            diagnostics={diagnostics}
          />
          {diagnostics.length > 0 && (
            <div className="absolute bottom-4 right-4 max-w-md bg-red-100 text-red-700 px-3 py-2 rounded shadow flex flex-col gap-1 text-sm z-50">
              <div className="flex items-center gap-2 font-bold">
                <AlertCircle size={16} />
                {diagnostics.length} Errors Found
              </div>
              {diagnostics.slice(0, 3).map((d, i) => (
                <div key={i} className="pl-6 text-xs font-mono border-l-2 border-red-300">
                  Line {d.line}: {d.message}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="w-1/3 min-w-[300px] flex flex-col bg-gray-50 border-l">
          {/* Tabs Header */}
          <div className="flex bg-white border-b">
            <button
              className={clsx("flex-1 py-2 text-sm font-medium flex items-center justify-center gap-2", activeTab === 'io' ? "text-siemens-teal border-b-2 border-siemens-teal" : "text-gray-500 hover:bg-gray-50")}
              onClick={() => setActiveTab('io')}
            >
              <Layers size={16} /> Process Image
            </button>
            <button
              className={clsx("flex-1 py-2 text-sm font-medium flex items-center justify-center gap-2", activeTab === 'watch' ? "text-siemens-teal border-b-2 border-siemens-teal" : "text-gray-500 hover:bg-gray-50")}
              onClick={() => setActiveTab('watch')}
            >
              <Table size={16} /> Watch Table
            </button>
          </div>

          <div className="flex-1 overflow-auto bg-gray-50">
            {activeTab === 'io' ? (
              <IOPanel
                inputs={inputs}
                outputs={outputs}
                onToggleInput={handleToggleInput}
              />
            ) : (
              <WatchTable cpuState={cpuState} />
            )}
          </div>

          <div className="bg-white border-t p-2 text-xs text-gray-400 flex justify-between">
            <span>Scan Time: {cycleTime}ms</span>
            <span>CPU: S7-300 (Sim)</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App;
