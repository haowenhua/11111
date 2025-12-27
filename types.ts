export interface PromptState {
  optimizedPrompt: string;
  isGenerating: boolean;
  error: string | null;
}

export interface ImageState {
  imageData: string | null;
  isGenerating: boolean;
  error: string | null;
}

export enum ModelNames {
  TEXT_MODEL = 'gemini-3-flash-preview',
  IMAGE_MODEL = 'gemini-3-pro-image-preview',
}