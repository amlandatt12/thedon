import React, { useState, useEffect } from 'react';
import { Copy, Trash2, ArrowRightLeft, AlignLeft, Type, FileText, Check, Wand2 } from 'lucide-react';

// Shared UI Layout
const TextToolLayout = ({ title, children, actions }: { title: string, children?: React.ReactNode, actions?: React.ReactNode }) => (
  <div className="flex flex-col h-full gap-4">
    <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
        {title}
      </h2>
      <div className="flex gap-2">{actions}</div>
    </div>
    {children}
  </div>
);

// --- 1. Master Text Transformer (Case, Lines, Sort, Clean) ---
export const TextTransformer: React.FC<{ defaultMode?: string }> = ({ defaultMode = 'sentence' }) => {
  const [text, setText] = useState('');
  const [mode, setMode] = useState(defaultMode);
  const [copied, setCopied] = useState(false);

  const processText = (currentText: string, currentMode: string) => {
    if (!currentText) return '';

    // Case Conversions
    if (currentMode.includes('upper')) return currentText.toUpperCase();
    if (currentMode.includes('lower')) return currentText.toLowerCase();
    if (currentMode.includes('title')) return currentText.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
    if (currentMode.includes('sentence')) return currentText.charAt(0).toUpperCase() + currentText.slice(1).toLowerCase();
    if (currentMode.includes('alternating')) return currentText.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('');

    // Developer Cases
    if (currentMode.includes('camel')) return currentText.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => index === 0 ? word.toLowerCase() : word.toUpperCase()).replace(/\s+/g, '');
    if (currentMode.includes('snake')) return currentText.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)?.map(x => x.toLowerCase()).join('_') || '';
    if (currentMode.includes('kebab')) return currentText.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)?.map(x => x.toLowerCase()).join('-') || '';
    if (currentMode.includes('pascal')) return currentText.replace(new RegExp(/[-_]+/, 'g'), ' ').replace(new RegExp(/[^\w\s]/, 'g'), '').replace(new RegExp(/\s+(.)(\w*)/, 'g'), ($1, $2, $3) => `${$2.toUpperCase() + $3.toLowerCase()}`).replace(new RegExp(/\w/), s => s.toUpperCase());

    // Line Operations
    const lines = currentText.split('\n');
    if (currentMode.includes('sort-alpha')) return lines.sort().join('\n');
    if (currentMode.includes('sort-reverse')) return lines.sort().reverse().join('\n');
    if (currentMode.includes('sort-length')) return lines.sort((a, b) => a.length - b.length).join('\n');
    if (currentMode.includes('reverse-lines')) return lines.reverse().join('\n');
    if (currentMode.includes('unique')) return [...new Set(lines)].join('\n');
    if (currentMode.includes('trim')) return lines.map(l => l.trim()).join('\n');
    if (currentMode.includes('empty')) return lines.filter(l => l.trim() !== '').join('\n');
    if (currentMode.includes('numbers')) return lines.map((l, i) => `${i + 1}. ${l}`).join('\n');
    if (currentMode.includes('shuffle')) return lines.sort(() => Math.random() - 0.5).join('\n');

    // String Operations
    if (currentMode.includes('reverse-text')) return currentText.split('').reverse().join('');
    if (currentMode.includes('reverse-words')) return currentText.split(' ').reverse().join(' ');
    if (currentMode.includes('slug')) return currentText.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
    if (currentMode.includes('mirror')) {
      const mirrorMap: any = { 'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ', 'f': 'ɟ', 'g': 'ƃ', 'h': 'ɥ', 'i': 'ᴉ', 'j': 'ɾ', 'k': 'ʞ', 'l': 'l', 'm': 'ɯ', 'n': 'u', 'o': 'o', 'p': 'd', 'q': 'b', 'r': 'ɹ', 's': 's', 't': 'ʇ', 'u': 'n', 'v': 'ʌ', 'w': 'ʍ', 'x': 'x', 'y': 'ʎ', 'z': 'z', '?': '¿', '!': '¡', '.': '˙' };
      return currentText.toLowerCase().split('').reverse().map(c => mirrorMap[c] || c).join('');
    }
    if (currentMode.includes('scramble')) return currentText.split('').sort(() => Math.random() - 0.5).join('');

    return currentText;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(processText(text, mode));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <TextToolLayout title="Smart Text Transformer" actions={
      <>
        <button onClick={() => setText('')} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 size={18} /></button>
        <button onClick={handleCopy} className="p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg">
          {copied ? <Check size={18} /> : <Copy size={18} />}
        </button>
      </>
    }>
      <div className="flex gap-2 overflow-x-auto pb-2 mb-2 no-scrollbar">
        {[
          { id: 'upper', label: 'UPPER' },
          { id: 'lower', label: 'lower' },
          { id: 'title', label: 'Title Case' },
          { id: 'sentence', label: 'Sentence' },
          { id: 'camel', label: 'camelCase' },
          { id: 'snake', label: 'snake_case' },
          { id: 'kebab', label: 'kebab-case' },
          { id: 'reverse-text', label: 'Reverse' },
          { id: 'sort-alpha', label: 'Sort A-Z' },
          { id: 'unique', label: 'Dedup' },
          { id: 'empty', label: 'No Empty' },
        ].map(opt => (
          <button
            key={opt.id}
            onClick={() => setMode(opt.id)}
            className={`px-3 py-1.5 whitespace-nowrap rounded-lg text-sm font-medium transition-colors ${mode.includes(opt.id)
              ? 'bg-primary-500 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full min-h-[400px]">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-500">Input</label>
          <textarea
            className="flex-1 p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary-500 outline-none resize-none font-mono"
            placeholder="Type or paste your text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-500">Output ({mode})</label>
          <div className="flex-1 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 font-mono whitespace-pre-wrap overflow-y-auto">
            {processText(text, mode) || <span className="text-slate-400 italic">Result will appear here...</span>}
          </div>
        </div>
      </div>
    </TextToolLayout>
  );
};

// --- 2. Master Text Converter (Base64, Hex, Binary, URL) ---
export const TextConverter: React.FC<{ defaultMode?: string }> = ({ defaultMode = 'base64' }) => {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState(defaultMode);

  const convert = (str: string, type: string) => {
    if (!str) return '';
    try {
      if (type === 'base64-encode') return btoa(str);
      if (type === 'base64-decode') return atob(str);
      if (type === 'url-encode') return encodeURIComponent(str);
      if (type === 'url-decode') return decodeURIComponent(str);
      if (type === 'html-encode') return str.replace(/[\u00A0-\u9999<>&]/g, i => '&#' + i.charCodeAt(0) + ';');
      if (type === 'html-decode') { const doc = new DOMParser().parseFromString(str, "text/html"); return doc.documentElement.textContent || ''; }
      if (type === 'binary-encode') return str.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
      if (type === 'binary-decode') return str.split(' ').map(b => String.fromCharCode(parseInt(b, 2))).join('');
      if (type === 'hex-encode') return str.split('').map(c => c.charCodeAt(0).toString(16)).join(' ');
      if (type === 'hex-decode') return str.split(' ').map(h => String.fromCharCode(parseInt(h, 16))).join('');
      if (type === 'rot13') {
        return str.replace(/[a-zA-Z]/g, (char) => {
          const base = char <= 'Z' ? 65 : 97;
          return String.fromCharCode(base + (char.charCodeAt(0) - base + 13) % 26);
        });
      }
      if (type === 'morse') {
        const codes: any = { 'a': '.-', 'b': '-...', 'c': '-.-.', 'd': '-..', 'e': '.', 'f': '..-.', 'g': '--.', 'h': '....', 'i': '..', 'j': '.---', 'k': '-.-', 'l': '.-..', 'm': '--', 'n': '-.', 'o': '---', 'p': '.--.', 'q': '--.-', 'r': '.-.', 's': '...', 't': '-', 'u': '..-', 'v': '...-', 'w': '.--', 'x': '-..-', 'y': '-.--', 'z': '--..' };
        return str.toLowerCase().split('').map(c => codes[c] || c).join(' ');
      }
      return str;
    } catch (e) {
      return "Error: Invalid input for this conversion.";
    }
  };

  return (
    <TextToolLayout title="Text Converter">
      <div className="flex flex-wrap gap-2 mb-4">
        {['base64', 'url', 'html', 'binary', 'hex'].map(t => (
          <div key={t} className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setMode(`${t}-encode`)}
              className={`px-3 py-1 rounded-md text-sm ${mode === `${t}-encode` ? 'bg-white dark:bg-slate-700 shadow text-primary-600' : 'text-slate-500'}`}
            >
              {t.toUpperCase()} Enc
            </button>
            <button
              onClick={() => setMode(`${t}-decode`)}
              className={`px-3 py-1 rounded-md text-sm ${mode === `${t}-decode` ? 'bg-white dark:bg-slate-700 shadow text-primary-600' : 'text-slate-500'}`}
            >
              Dec
            </button>
          </div>
        ))}
      </div>
      <div className="space-y-4">
        <textarea
          className="w-full h-40 p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary-500 outline-none font-mono"
          placeholder="Input text..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="flex justify-center">
          <ArrowRightLeft className="text-slate-400 rotate-90" />
        </div>
        <textarea
          readOnly
          className="w-full h-40 p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-slate-700 dark:text-slate-300"
          value={convert(input, mode)}
          placeholder="Result..."
        />
      </div>
    </TextToolLayout>
  );
};

// --- 3. Text Analyzer (Stats) ---
export const TextAnalyzer: React.FC = () => {
  const [text, setText] = useState('');

  const stats = {
    chars: text.length,
    charsNoSpace: text.replace(/\s/g, '').length,
    words: text.trim() === '' ? 0 : text.trim().split(/\s+/).length,
    lines: text === '' ? 0 : text.split('\n').length,
    sentences: text === '' ? 0 : text.split(/[.!?]+/).length - 1,
    paragraphs: text === '' ? 0 : text.split(/\n\n+/).length,
    bytes: new Blob([text]).size,
    readingTime: Math.ceil((text.trim().split(/\s+/).length) / 200) + ' min',
    speakingTime: Math.ceil((text.trim().split(/\s+/).length) / 130) + ' min',
  };

  return (
    <TextToolLayout title="Text Analyzer & Statistics">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Words', val: stats.words },
          { label: 'Characters', val: stats.chars },
          { label: 'Sentences', val: stats.sentences },
          { label: 'Lines', val: stats.lines },
          { label: 'Paragraphs', val: stats.paragraphs },
          { label: 'Bytes', val: stats.bytes },
          { label: 'Read Time', val: stats.readingTime },
          { label: 'Speak Time', val: stats.speakingTime },
        ].map((s, i) => (
          <div key={i} className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">{s.val}</div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>
      <textarea
        className="flex-1 min-h-[300px] w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary-500 outline-none resize-none font-mono"
        placeholder="Type or paste your text here to analyze..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </TextToolLayout>
  );
};

// --- 4. Lorem Ipsum & Random Text ---
export const TextGenerator: React.FC<{ type?: 'lorem' | 'random' }> = ({ type = 'lorem' }) => {
  const [count, setCount] = useState(3);
  const [output, setOutput] = useState('');

  const generate = () => {
    if (type === 'lorem') {
      const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
      setOutput(Array(count).fill(lorem).join('\n\n'));
    } else {
      // Random words
      const words = ["lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua"];
      let res = [];
      for (let i = 0; i < count * 20; i++) {
        res.push(words[Math.floor(Math.random() * words.length)]);
      }
      setOutput(res.join(' '));
    }
  };

  useEffect(generate, [count, type]);

  return (
    <TextToolLayout title={type === 'lorem' ? "Lorem Ipsum Generator" : "Random Text Generator"}>
      <div className="flex items-center gap-4 mb-4">
        <label>Paragraphs/Blocks:</label>
        <input type="number" value={count} onChange={e => setCount(Math.max(1, parseInt(e.target.value)))} className="p-2 border rounded-lg w-20 bg-transparent" />
        <button onClick={generate} className="btn-primary flex items-center gap-2"><Wand2 size={16} /> Regenerate</button>
      </div>
      <textarea readOnly value={output} className="w-full h-64 p-4 rounded-xl border bg-slate-50 dark:bg-slate-900/50" />
    </TextToolLayout>
  );
};