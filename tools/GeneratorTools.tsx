import React, { useState, useEffect } from 'react';
import { RefreshCw, Copy, Check } from 'lucide-react';

export const PasswordGenerator: React.FC = () => {
  const [length, setLength] = useState(16);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const lowers = 'abcdefghijklmnopqrstuvwxyz';
    const uppers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
    
    let chars = lowers;
    if (includeUppercase) chars += uppers;
    if (includeNumbers) chars += numbers;
    if (includeSymbols) chars += symbols;

    let pass = '';
    for (let i = 0; i < length; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(pass);
    setCopied(false);
  };

  useEffect(() => {
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">Secure Password Generator</h2>
      
      <div className="relative mb-6 group">
        <div className="p-6 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center break-all font-mono text-2xl tracking-wide min-h-[5rem] flex items-center justify-center">
          {password}
        </div>
        <button 
          onClick={copyToClipboard}
          className="absolute top-1/2 -translate-y-1/2 right-4 p-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg hover:scale-105 transition-transform"
        >
          {copied ? <Check className="text-green-500" /> : <Copy className="text-slate-500" />}
        </button>
      </div>

      <div className="grid gap-6 p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div>
          <label className="flex justify-between mb-2 font-semibold">
            <span>Length</span>
            <span className="text-primary-500">{length}</span>
          </label>
          <input 
            type="range" 
            min="6" 
            max="64" 
            value={length} 
            onChange={(e) => setLength(parseInt(e.target.value))} 
            className="w-full accent-primary-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
           <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
             <input type="checkbox" checked={includeUppercase} onChange={e => setIncludeUppercase(e.target.checked)} className="w-5 h-5 accent-primary-500 rounded" />
             <span>Uppercase (A-Z)</span>
           </label>
           <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
             <input type="checkbox" checked={includeNumbers} onChange={e => setIncludeNumbers(e.target.checked)} className="w-5 h-5 accent-primary-500 rounded" />
             <span>Numbers (0-9)</span>
           </label>
           <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
             <input type="checkbox" checked={includeSymbols} onChange={e => setIncludeSymbols(e.target.checked)} className="w-5 h-5 accent-primary-500 rounded" />
             <span>Symbols (!@#)</span>
           </label>
        </div>

        <button 
          onClick={generate}
          className="w-full py-4 mt-2 bg-gradient-to-r from-primary-600 to-emerald-600 hover:from-primary-700 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-primary-500/25 transition-all flex items-center justify-center gap-2"
        >
          <RefreshCw size={20} /> Generate New Password
        </button>
      </div>
    </div>
  );
};

export const UUIDGenerator: React.FC = () => {
    const [uuids, setUuids] = useState<string[]>([]);
    const [count, setCount] = useState(5);
  
    const generate = () => {
      const newUuids = [];
      for(let i=0; i<count; i++) {
        newUuids.push(crypto.randomUUID());
      }
      setUuids(newUuids);
    };

    useEffect(() => {
        generate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [count]);
  
    return (
      <div className="h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">UUID v4 Generator</h2>
              <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    min="1" max="100" 
                    value={count} 
                    onChange={e => setCount(Number(e.target.value))}
                    className="w-20 p-2 rounded border border-slate-300 dark:border-slate-700 bg-transparent text-center"
                  />
                  <button onClick={generate} className="p-2 bg-primary-500 text-white rounded-lg"><RefreshCw size={18}/></button>
              </div>
          </div>
          <textarea 
            readOnly 
            value={uuids.join('\n')} 
            className="flex-1 p-4 font-mono text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 resize-none outline-none focus:ring-2 focus:ring-primary-500"
          />
      </div>
    );
};