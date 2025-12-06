import React, { useState, useEffect } from 'react';
import { AlertCircle, FileJson, Hash, Code2 } from 'lucide-react';

// --- 1. JSON Tool (Format, Minify, Validate) ---
export const JsonTool: React.FC<{ mode?: 'format' | 'minify' | 'validate' }> = ({ mode = 'format' }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const process = (action: string) => {
    try {
      const parsed = JSON.parse(input);
      if (action === 'format') setInput(JSON.stringify(parsed, null, 2));
      if (action === 'minify') setInput(JSON.stringify(parsed));
      if (action === 'validate') alert("Valid JSON!");
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">JSON Tools</h2>
        <div className="flex gap-2">
          <button onClick={() => process('format')} className="btn-secondary">Format</button>
          <button onClick={() => process('minify')} className="btn-secondary">Minify</button>
        </div>
      </div>
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg flex items-center gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste JSON here..."
        className="flex-1 p-4 font-mono text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
        spellCheck={false}
      />
      <style>{`.btn-secondary { padding: 0.5rem 1rem; border-radius: 0.5rem; background: #e2e8f0; color: #475569; font-weight: 500; } .dark .btn-secondary { background: #334155; color: #cbd5e1; }`}</style>
    </div>
  );
};

// --- 2. Hash Generator (MD5/SHA) ---
export const HashGenerator: React.FC<{ alg?: string }> = ({ alg = 'SHA-256' }) => {
  const [text, setText] = useState('');
  const [hash, setHash] = useState('');

  useEffect(() => {
    const generate = async () => {
      if (!text) { setHash(''); return; }
      const msgBuffer = new TextEncoder().encode(text);
      try {
        const hashBuffer = await crypto.subtle.digest(alg, msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        setHash(hashHex);
      } catch (e) {
        setHash("Algorithm not supported in this browser context (requires HTTPS or localhost).");
      }
    };
    generate();
  }, [text, alg]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2"><Hash className="text-primary-500" /> {alg} Generator</h2>
      <div className="space-y-2">
        <label>Input Text</label>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 h-32"
        />
      </div>
      <div className="space-y-2">
        <label>Hash Output</label>
        <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-950 font-mono break-all border border-slate-200 dark:border-slate-800">
          {hash || '...'}
        </div>
      </div>
    </div>
  );
};

// --- 3. Code Minifier (Basic Regex) ---
export const CodeMinifier: React.FC<{ lang?: 'css' | 'js' | 'html' | 'sql' }> = ({ lang = 'css' }) => {
  const [code, setCode] = useState('');

  const minify = () => {
    let res = code;
    if (lang === 'css') res = res.replace(/\s+/g, ' ').replace(/{\s/g, '{').replace(/;\s/g, ';').replace(/\s}/g, '}');
    if (lang === 'html') res = res.replace(/>\s+</g, '><').replace(/<!--[\s\S]*?-->/g, '');
    if (lang === 'js') res = res.replace(/\s+/g, ' ').replace(/\/\*[\s\S]*?\*\//g, ''); // Very basic unsafe minifier
    if (lang === 'sql') res = res.replace(/\s+/g, ' ').replace(/\s*([,;()])\s*/g, '$1');
    setCode(res);
  };

  const beautify = () => {
    // Simple indentation logic for display purposes in this demo
    // Real implementation would use prettier/beautify lib
    let res = code;
    if (lang === 'json') { try { res = JSON.stringify(JSON.parse(res), null, 2); } catch { } }
    else {
      // Primitive indent
      res = res.replace(/>/g, '>\n').replace(/;/g, ';\n').replace(/{/g, '{\n').replace(/}/g, '\n}');
    }
    setCode(res);
  };

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold uppercase bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{lang} Tools</h2>
        <div className="flex gap-2">
          <button onClick={beautify} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg font-medium">Beautify</button>
          <button onClick={minify} className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium shadow-md shadow-primary-500/20">Minify</button>
        </div>
      </div>
      <textarea
        value={code}
        onChange={e => setCode(e.target.value)}
        className="flex-1 p-4 font-mono text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-primary-500"
        placeholder={`Paste ${lang.toUpperCase()} code here...`}
      />
    </div>
  )
}

// --- 5. Web Tools (User Agent, Diff, etc) ---
export const WebTools: React.FC<{ mode: 'user-agent' | 'diff' }> = ({ mode }) => {
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [info, setInfo] = useState<any>(null);

  useEffect(() => {
    if (mode === 'user-agent') {
      setInfo({
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        vendor: navigator.vendor,
        language: navigator.language,
        cookieEnabled: navigator.cookieEnabled,
        screen: `${window.screen.width}x${window.screen.height}`
      });
    }
  }, [mode]);

  if (mode === 'diff') {
    return (
      <div className="h-full flex flex-col gap-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Text Diff Checker</h2>
        <div className="grid grid-cols-2 gap-4 flex-1 min-h-[300px]">
          <div className="flex flex-col gap-2">
            <label>Original Text</label>
            <textarea className="flex-1 p-4 border rounded-xl" value={input1} onChange={e => setInput1(e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <label>New Text</label>
            <textarea className="flex-1 p-4 border rounded-xl" value={input2} onChange={e => setInput2(e.target.value)} />
          </div>
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <h3 className="font-bold mb-2">Difference Summary</h3>
          <p className="text-slate-500">{input1 === input2 ? "Texts are identical." : "Texts differ."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">User Agent Info</h2>
      <div className="space-y-4">
        {info && Object.entries(info).map(([k, v]) => (
          <div key={k} className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center hover:shadow-md transition-shadow">
            <span className="font-semibold capitalize text-slate-600 dark:text-slate-400">{k.replace(/([A-Z])/g, ' $1').trim()}</span>
            <code className="text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-2 py-1 rounded">{String(v)}</code>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- 4. Color Converter ---

export const ColorConverter: React.FC = () => {
  const [hex, setHex] = useState('#6366f1');
  const [rgb, setRgb] = useState('99, 102, 241');

  const handleHexChange = (val: string) => {
    setHex(val);
    if (/^#[0-9A-F]{6}$/i.test(val)) {
      const bigint = parseInt(val.slice(1), 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      setRgb(`${r}, ${g}, ${b}`);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl">
      <h2 className="text-xl font-bold mb-6">Color Converter</h2>

      <div className="flex gap-6 mb-8">
        <div
          className="w-32 h-32 rounded-2xl shadow-inner border border-slate-200 dark:border-slate-700"
          style={{ backgroundColor: hex }}
        />
        <div className="flex-1 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">HEX</label>
            <input
              type="text"
              value={hex}
              onChange={(e) => handleHexChange(e.target.value)}
              className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">RGB</label>
            <input
              type="text"
              value={rgb}
              readOnly
              className="w-full p-3 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 font-mono text-slate-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};