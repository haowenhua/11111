import React from 'react';
import { Image as ImageIcon, Download, XCircle } from 'lucide-react';

interface ImagePreviewProps {
  imageData: string | null;
  error: string | null;
  onClose: () => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ imageData, error, onClose }) => {
  if (!imageData && !error) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative bg-slate-900 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-700 flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-950">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-emerald-400" />
            3D Result Preview
          </h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        <div className="p-1 flex-grow overflow-auto flex items-center justify-center bg-slate-950/50">
           {error ? (
             <div className="text-red-400 p-8 text-center">
               <p className="mb-2 font-bold">Generation Failed</p>
               <p className="text-sm">{error}</p>
             </div>
           ) : (
             imageData && (
               <img 
                src={imageData} 
                alt="Generated 3D Character" 
                className="max-h-full max-w-full object-contain rounded shadow-lg"
               />
             )
           )}
        </div>

        {imageData && !error && (
          <div className="p-4 border-t border-slate-700 bg-slate-900 flex justify-end">
             <a 
               href={imageData} 
               download="donghua-3d-character.png"
               className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors border border-slate-600"
             >
               <Download className="w-4 h-4" />
               Download PNG
             </a>
          </div>
        )}
      </div>
    </div>
  );
};