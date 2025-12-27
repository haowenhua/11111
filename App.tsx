import React, { useState } from 'react';
import { Sparkles, Wand2, Info } from 'lucide-react';
import { generateDonghuaPrompt, generateDonghuaImage } from './services/geminiService';
import { PromptDisplay } from './components/PromptDisplay';
import { ImagePreview } from './components/ImagePreview';
import { PromptState, ImageState } from './types';

export default function App() {
  const [input, setInput] = useState('');
  const [promptState, setPromptState] = useState<PromptState>({
    optimizedPrompt: '',
    isGenerating: false,
    error: null,
  });
  const [imageState, setImageState] = useState<ImageState>({
    imageData: null,
    isGenerating: false,
    error: null,
  });

  const handleGeneratePrompt = async () => {
    if (!input.trim()) return;

    setPromptState({ ...promptState, isGenerating: true, error: null });
    // Clear previous image when generating new prompt
    setImageState({ imageData: null, isGenerating: false, error: null });

    try {
      const result = await generateDonghuaPrompt(input);
      setPromptState({
        optimizedPrompt: result,
        isGenerating: false,
        error: null
      });
    } catch (e: any) {
      setPromptState({
        optimizedPrompt: '',
        isGenerating: false,
        error: e.message || "An error occurred while generating the prompt."
      });
    }
  };

  const handleGenerateImage = async () => {
    if (!promptState.optimizedPrompt) return;

    setImageState({ ...imageState, isGenerating: true, error: null });

    try {
      const result = await generateDonghuaImage(promptState.optimizedPrompt);
      setImageState({
        imageData: result,
        isGenerating: false,
        error: null
      });
    } catch (e: any) {
      setImageState({
        imageData: null,
        isGenerating: false,
        error: e.message || "Failed to generate image preview."
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-200 selection:bg-red-500/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
         <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-900/10 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-[120px]"></div>
      </div>

      <main className="relative z-10 container mx-auto px-4 py-8 lg:py-12 max-w-6xl">
        {/* Header */}
        <header className="mb-12 text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-slate-900/80 rounded-2xl border border-slate-700 shadow-xl mb-4">
             <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center shadow-lg transform rotate-3">
                <Sparkles className="text-white w-6 h-6" />
             </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-serif-sc text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-400 tracking-tight">
            Donghua 3D Architect
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Transform simple descriptions into production-ready prompts for <span className="text-red-400 font-medium">3D Chinese Animation</span> characters using Nano Banana Pro.
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Left Column: Input */}
          <section className="flex flex-col gap-6">
            <div className="bg-slate-800/50 rounded-2xl p-1 border border-slate-700 shadow-xl backdrop-blur-sm">
              <div className="bg-slate-900 rounded-xl p-6 md:p-8 space-y-6">
                
                <div className="flex justify-between items-center">
                   <label htmlFor="description" className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                     Character Description
                   </label>
                   <div className="group relative">
                      <Info className="w-4 h-4 text-slate-500 hover:text-slate-300 cursor-help" />
                      <div className="absolute right-0 top-6 w-64 bg-slate-800 text-xs text-slate-300 p-3 rounded-lg border border-slate-600 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                        Describe gender, clothing, hair, colors, and mood. The AI will add the 3D details.
                      </div>
                   </div>
                </div>

                <textarea
                  id="description"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="e.g. A young swordswoman in white silk robes, holding a jade flute, standing on a misty mountain peak, determined expression..."
                  className="w-full h-48 bg-slate-950 border border-slate-700 rounded-lg p-4 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all resize-none leading-relaxed"
                />

                <button
                  onClick={handleGeneratePrompt}
                  disabled={!input.trim() || promptState.isGenerating}
                  className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-3
                    ${!input.trim() || promptState.isGenerating
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-red-900/30 transform hover:-translate-y-0.5'
                    }`}
                >
                  {promptState.isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Architecting Prompt...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      Generate 3D Prompt
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Tips Section */}
            <div className="bg-slate-900/30 rounded-xl p-6 border border-slate-800">
               <h3 className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">Pro Tips</h3>
               <ul className="space-y-2 text-sm text-slate-500">
                 <li className="flex gap-2">
                   <span className="text-red-500">•</span>
                   <span>Specify <b>Color Palette</b> (e.g., "Gold and Crimson") for better aesthetics.</span>
                 </li>
                 <li className="flex gap-2">
                   <span className="text-red-500">•</span>
                   <span>Mention <b>Accessories</b> (e.g., "Phoenix hairpin") to add cultural depth.</span>
                 </li>
                 <li className="flex gap-2">
                   <span className="text-red-500">•</span>
                   <span>This tool automatically optimizes for <span className="text-slate-300">Nano Banana Pro</span>.</span>
                 </li>
               </ul>
            </div>
          </section>

          {/* Right Column: Output */}
          <section className="min-h-[400px]">
            <PromptDisplay 
              prompt={promptState.optimizedPrompt}
              isGenerating={promptState.isGenerating}
              onGenerateImage={handleGenerateImage}
              isGeneratingImage={imageState.isGenerating}
            />
          </section>
        </div>
      </main>

      {/* Full Screen Image Preview Overlay */}
      {(imageState.imageData || imageState.isGenerating || imageState.error) && (
        <ImagePreview 
          imageData={imageState.imageData} 
          error={imageState.error}
          onClose={() => setImageState({ ...imageState, imageData: null, error: null })} 
        />
      )}
    </div>
  );
}