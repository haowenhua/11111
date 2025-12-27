import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

interface PromptDisplayProps {
  prompt: string;
  isGenerating: boolean;
  onGenerateImage: () => void;
  isGeneratingImage: boolean;
}

export const PromptDisplay: React.FC<PromptDisplayProps> = ({ 
  prompt, 
  isGenerating,
  onGenerateImage,
  isGeneratingImage
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!prompt) return;
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (!prompt && !isGenerating) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-700 rounded-xl p-8 bg-slate-900/50">
        <Terminal className="w-12 h-12 mb-4 opacity-50" />
        <p className="text-center">Generated prompt will appear here.</p>
        <p className="text-xs mt-2 opacity-50">Optimized for Nano Banana Pro</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-xl shadow-xl overflow-hidden border border-slate-700 flex flex-col h-full">
      <div className="bg-slate-900/80 px-4 py-3 border-b border-slate-700 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span className="text-sm font-mono text-slate-300 font-semibold">OUTPUT_PROMPT</span>
        </div>
        <button
          onClick={handleCopy}
          disabled={!prompt || isGenerating}
          className="flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-white transition-colors disabled:opacity-50"
        >
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          {copied ? 'COPIED' : 'COPY'}
        </button>
      </div>
      
      <div className="p-6 flex-grow relative overflow-auto custom-scrollbar">
        {isGenerating ? (
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-slate-700 rounded w-3/4"></div>
            <div className="h-4 bg-slate-700 rounded w-full"></div>
            <div className="h-4 bg-slate-700 rounded w-5/6"></div>
            <div className="h-4 bg-slate-700 rounded w-full"></div>
          </div>
        ) : (
          <pre className="whitespace-pre-wrap font-mono text-sm text-emerald-300 leading-relaxed">
            {prompt}
          </pre>
        )}
      </div>

      <div className="p-4 bg-slate-900/50 border-t border-slate-700">
         <button
            onClick={onGenerateImage}
            disabled={!prompt || isGenerating || isGeneratingImage}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2
              ${!prompt || isGenerating 
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-900/20'
              }`}
          >
            {isGeneratingImage ? (
               <>
                 <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                 Generating Preview...
               </>
            ) : (
              "Test Prompt (Generate Image)"
            )}
         </button>
         <p className="text-xs text-center mt-2 text-slate-500">
           Generates a preview using Nano Banana Pro (Gemini 3 Pro Image)
         </p>
      </div>
    </div>
  );
};