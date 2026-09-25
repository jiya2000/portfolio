import { useState } from 'react';
import { Rnd } from 'react-rnd';
import { HCLTerminal } from './HCLTerminal';

export function OperatingSystem() {
  const [windows, setWindows] = useState<{ id: string; title: string; isOpen: boolean }[]>([
    { id: 'terminal', title: 'HCLTech Multi-Agent Cloud (K8s_Agent_Monitor.sh)', isOpen: true }
  ]);

  const copyEmail = () => {
    navigator.clipboard.writeText('aditisharma20004@gmail.com');
    alert('Email copied to clipboard!');
  };

  return (
    <div className="w-full h-full text-green-400 font-mono relative overflow-hidden flex flex-col select-none"
         style={{ 
           background: 'radial-gradient(circle, #004444 0%, #000000 100%)',
           boxShadow: 'inset 0 0 100px rgba(0,255,0,0.1)'
         }}
         onPointerDown={(e) => {
           // We stop propagation so that clicking the OS doesn't rotate the 3D camera
           e.stopPropagation();
         }}
    >
      {/* Desktop Grid (Scanline effect) */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(rgba(0, 255, 0, 0.3) 2px, transparent 2px)', backgroundSize: '100% 4px' }}>
      </div>

      {/* Icons */}
      <div className="p-8 flex flex-col gap-6 relative z-10 w-32">
        <button className="flex flex-col items-center gap-2 hover:bg-green-400/20 p-2 rounded cursor-pointer"
                onClick={() => window.open('https://github.com/jiya2000', '_blank')}>
          <div className="w-16 h-16 bg-black border-2 border-green-400 rounded flex items-center justify-center text-green-400 font-black text-2xl">
            GH
          </div>
          <span className="text-sm font-bold text-center bg-black px-1 border border-green-500/50 text-white shadow-lg">GitHub</span>
        </button>
        
        <button className="flex flex-col items-center gap-2 hover:bg-green-400/20 p-2 rounded cursor-pointer"
                onClick={() => window.open('https://linkedin.com/in/aditisharma', '_blank')}>
          <div className="w-16 h-16 bg-black border-2 border-green-400 rounded flex items-center justify-center text-green-400 font-black text-2xl">
            IN
          </div>
          <span className="text-sm font-bold text-center bg-black px-1 border border-green-500/50 text-white shadow-lg">LinkedIn</span>
        </button>

        <button className="flex flex-col items-center gap-2 hover:bg-green-400/20 p-2 rounded cursor-pointer"
                onClick={copyEmail}>
          <div className="w-16 h-16 bg-black border-2 border-green-400 rounded flex items-center justify-center text-green-400 font-black text-2xl">
            @
          </div>
          <span className="text-sm font-bold text-center bg-black px-1 border border-green-500/50 text-white shadow-lg">Email</span>
        </button>
      </div>

      {/* Windows */}
      {windows.map(win => win.isOpen && (
        <Rnd
          key={win.id}
          default={{ x: 250, y: 150, width: 700, height: 450 }}
          minWidth={400}
          minHeight={300}
          bounds="parent"
          className="bg-black/95 border-2 border-green-500 shadow-[0_0_30px_rgba(0,255,0,0.4)] flex flex-col pointer-events-auto"
          dragHandleClassName="handle"
          enableResizing={false}
        >
          {/* Window Title Bar */}
          <div className="handle h-10 bg-green-900 border-b-2 border-green-500 flex items-center justify-between px-3 cursor-grab active:cursor-grabbing text-white">
            <div className="flex items-center gap-3">
              <span className="font-bold tracking-wider">{win.title}</span>
            </div>
            <button className="hover:text-red-400 font-bold text-xl px-2" onClick={() => setWindows(ws => ws.map(w => w.id === win.id ? {...w, isOpen: false} : w))}>✕</button>
          </div>
          
          {/* Window Content */}
          <div className="flex-1 overflow-auto p-4 relative cursor-text select-text" onPointerDown={(e) => e.stopPropagation()}>
            <HCLTerminal />
          </div>
        </Rnd>
      ))}

      {/* Taskbar */}
      <div className="h-12 bg-green-950 border-t-2 border-green-500 mt-auto relative z-10 flex items-center px-4">
        <div className="font-black text-xl bg-green-500 text-black px-6 py-1 cursor-pointer hover:bg-green-400"
             onClick={() => setWindows(ws => ws.map(w => w.id === 'terminal' ? {...w, isOpen: true} : w))}>
          START
        </div>
        <div className="ml-auto text-green-400 font-bold">
          GCS TERMINAL v2.1.0
        </div>
      </div>
    </div>
  );
}
