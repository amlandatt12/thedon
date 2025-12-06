import React, { useState } from 'react';
import { FileText, Files, Upload, AlertTriangle, Check, Layers, Mic } from 'lucide-react';

// Shared UI Layout (Duplicated from TextTools for consistency, can be moved to shared later)
const ToolLayout = ({ title, children, actions }: { title: string, children?: React.ReactNode, actions?: React.ReactNode }) => (
    <div className="flex flex-col h-full gap-4">
        <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                {title}
            </h2>
            <div className="flex gap-2">{actions}</div>
        </div>
        {children}
    </div>
);

export const FileProcessor: React.FC<{ mode: string }> = ({ mode }) => {
    const [file, setFile] = useState<File | null>(null);
    const [result, setResult] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setResult(null);
        }
    };

    const processFile = async () => {
        if (!file) return;
        setProcessing(true);

        // Simulate processing time for "heavy" operations
        await new Promise(r => setTimeout(r, 1500));

        // MOCK IMPLEMENTATIONS due to pure client-side limitations without heavy WASM
        // specific logic for a few reliable browser APIs

        let res = "";

        if (mode.includes('metadata')) {
            res = `Name: ${file.name}\nSize: ${(file.size / 1024).toFixed(2)} KB\nType: ${file.type}\nLast Modified: ${new Date(file.lastModified).toLocaleString()}`;
        } else if (mode.includes('base64')) {
            const reader = new FileReader();
            reader.onload = (e) => setResult(e.target?.result as string);
            reader.readAsDataURL(file);
            setProcessing(false);
            return; // Early return as reader is async
        } else if (mode.includes('text') && file.type.includes('text')) {
            const reader = new FileReader();
            reader.onload = (e) => setResult(e.target?.result as string);
            reader.readAsText(file);
            setProcessing(false);
            return;
        } else {
            res = "Error: This specific file operation is not supported in the current client-side engine.";
        }

        setResult(res);
        setProcessing(false);
    };

    return (
        <ToolLayout title="Universal File Tool">
            {!file ? (
                <label className="flex-1 border-3 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors animate-in fade-in zoom-in duration-300">
                    <Files size={64} className="text-slate-400 mb-6" />
                    <span className="text-2xl font-medium text-slate-600 dark:text-slate-300">Drop your file here</span>
                    <span className="text-sm text-slate-400 mt-2">Supports PDF, CSV, JSON, TXT, etc.</span>
                    <input type="file" onChange={handleUpload} className="hidden" />
                </label>
            ) : (
                <div className="flex flex-col h-full gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                        <FileText className="text-primary-500" size={32} />
                        <div className="flex-1 min-w-0">
                            <div className="font-bold truncate text-slate-700 dark:text-slate-200">{file.name}</div>
                            <div className="text-xs text-slate-500">{(file.size / 1024).toFixed(2)} KB</div>
                        </div>
                        <button onClick={() => setFile(null)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">Remove</button>
                    </div>

                    <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center justify-center text-center">
                        {processing ? (
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-slate-500 animate-pulse">Processing locally...</p>
                            </div>
                        ) : result ? (
                            <div className="w-full h-full flex flex-col">
                                <div className="flex-1 p-4 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 font-mono text-sm overflow-auto mb-4 text-left whitespace-pre-wrap">
                                    {result.slice(0, 5000) + (result.length > 5000 ? '\n... (truncated)' : '')}
                                </div>
                                <button className="btn-primary w-full py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-bold shadow-lg shadow-green-500/20 flex items-center justify-center gap-2">
                                    <Check size={20} /> Download Result
                                </button>
                            </div>
                        ) : (
                            <button onClick={processFile} className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-lg shadow-xl shadow-primary-500/20 transition-transform hover:scale-105 flex items-center gap-3">
                                <Layers size={24} />
                                Run {mode.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                            </button>
                        )}
                    </div>
                </div>
            )}
        </ToolLayout>
    );
};
