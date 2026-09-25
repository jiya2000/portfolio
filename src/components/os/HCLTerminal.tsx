import { useEffect, useState } from 'react';

const LOGS = [
  "Initializing Ground Control Station (GCS)...",
  "Booting HCLTech Enterprise Multi-Agent Cloud Platform...",
  "--> Connecting to Azure Kubernetes Service...",
  "SUCCESS: Authenticated.",
  "Agent [FinOps] online. Optimizing resource allocation...",
  "Agent [Security] online. Running compliance checks... PASS",
  "Agent [Ops] online. Monitoring telemetry endpoints...",
  "===================================================================",
  "CANDIDATE PROFILE: Aditi Sharma",
  "===================================================================",
  "> Education: M.Tech Computer Science & Engineering (Data Science)",
  "> Institute: Vellore Institute of Technology (VIT)",
  "> Academic Standing: 9.65 CGPA",
  "-------------------------------------------------------------------",
  "> Distinction: AIR 417 NDA Rank",
  "> Arts Discipline: Classical Kathak Dancer",
  "===================================================================",
  "Loading Autonomous Clinical Trial RAG System...",
  "Executing document parse... [||||||||||||||||||||] 100%",
  "RAG Subsystem Reports: 95% retrieval accuracy achieved.",
  "System Ready. Awaiting input..."
];

export function HCLTerminal() {
  const [lines, setLines] = useState<string[]>([]);
  
  useEffect(() => {
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < LOGS.length) {
        setLines(prev => [...prev, LOGS[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
      }
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full text-green-400 font-mono text-base flex flex-col gap-2">
      {lines.map((line, i) => {
        let colorClass = "";
        if (line.includes('SUCCESS') || line.includes('PASS')) colorClass = "text-blue-400 font-bold";
        else if (line.includes('===')) colorClass = "text-green-600";
        else if (line.includes('---')) colorClass = "text-green-600";
        else if (line.startsWith('-->') || line.startsWith('>')) colorClass = "text-yellow-400";
        else if (line.includes('CANDIDATE PROFILE')) colorClass = "text-white font-bold bg-green-900 px-2";

        return (
          <div key={i} className={colorClass}>
            {line}
          </div>
        );
      })}
      <div className="animate-pulse w-3 h-5 bg-green-400 mt-2"></div>
    </div>
  );
}
