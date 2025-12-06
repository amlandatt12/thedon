import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, Image as ImageIcon, Sliders } from 'lucide-react';

export const ImageProcessor: React.FC<{ mode?: 'convert' | 'compress' | 'resize' | 'filter' }> = ({ mode = 'convert' }) => {
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [quality, setQuality] = useState(0.8);
  const [format, setFormat] = useState('image/jpeg');
  const [filter, setFilter] = useState('none');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFile(f);
      const url = URL.createObjectURL(f);
      setImage(url);
      
      const img = new Image();
      img.onload = () => {
        setWidth(img.width);
        setHeight(img.height);
      };
      img.src = url;
    }
  };

  const processImage = () => {
    const canvas = canvasRef.current;
    const img = new Image();
    if (!canvas || !image) return;

    img.onload = () => {
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (filter !== 'none') ctx.filter = filter;
      ctx.drawImage(img, 0, 0, width, height);
      
      const dataUrl = canvas.toDataURL(format, quality);
      
      // Trigger download
      const link = document.createElement('a');
      link.download = `processed-image.${format.split('/')[1]}`;
      link.href = dataUrl;
      link.click();
    };
    img.src = image;
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent capitalize">
          Image {mode} Tool
        </h2>
      </div>

      {!image ? (
        <label className="flex-1 border-3 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
          <Upload size={48} className="text-slate-400 mb-4" />
          <span className="text-xl font-medium text-slate-600 dark:text-slate-300">Drop an image here</span>
          <span className="text-sm text-slate-400 mt-2">or click to browse</span>
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        </label>
      ) : (
        <div className="flex flex-col md:flex-row gap-6 h-full">
           <div className="flex-1 bg-slate-100 dark:bg-slate-900 rounded-xl flex items-center justify-center p-4 overflow-hidden relative">
             <img src={image} className="max-w-full max-h-full object-contain shadow-lg" style={{ filter: filter !== 'none' ? filter : undefined }} alt="Preview" />
             <button onClick={() => setImage(null)} className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white text-slate-800 shadow">X</button>
           </div>
           
           <div className="w-full md:w-80 space-y-6 p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              {mode === 'resize' && (
                <div>
                   <label className="label">Width (px)</label>
                   <input type="number" value={width} onChange={e => setWidth(Number(e.target.value))} className="input-field mb-4" />
                   <label className="label">Height (px)</label>
                   <input type="number" value={height} onChange={e => setHeight(Number(e.target.value))} className="input-field" />
                </div>
              )}
              
              {(mode === 'convert' || mode === 'compress') && (
                <div>
                  <label className="label">Format</label>
                  <select value={format} onChange={e => setFormat(e.target.value)} className="input-field mb-4">
                    <option value="image/jpeg">JPEG</option>
                    <option value="image/png">PNG</option>
                    <option value="image/webp">WebP</option>
                  </select>

                  <label className="label">Quality ({Math.round(quality * 100)}%)</label>
                  <input type="range" min="0.1" max="1" step="0.1" value={quality} onChange={e => setQuality(parseFloat(e.target.value))} className="w-full accent-primary-500" />
                </div>
              )}

              {mode === 'filter' && (
                 <div>
                   <label className="label">Effect</label>
                   <select value={filter} onChange={e => setFilter(e.target.value)} className="input-field">
                     <option value="none">None</option>
                     <option value="grayscale(100%)">Grayscale</option>
                     <option value="sepia(100%)">Sepia</option>
                     <option value="blur(5px)">Blur</option>
                     <option value="contrast(200%)">High Contrast</option>
                     <option value="invert(100%)">Invert</option>
                   </select>
                 </div>
              )}

              <button onClick={processImage} className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-bold flex items-center justify-center gap-2">
                <Download size={20} /> Process & Download
              </button>
           </div>
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
      <style>{`
        .label { display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.5rem; color: #64748b; }
        .input-field { width: 100%; padding: 0.75rem; border-radius: 0.5rem; border: 1px solid #e2e8f0; background: transparent; }
        .dark .input-field { border-color: #334155; }
      `}</style>
    </div>
  );
};