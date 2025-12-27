import { GoogleGenAI } from "@google/genai";
import { ModelNames } from "../types";

// Initialize Gemini Client
// The API key is guaranteed to be available in process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a highly detailed prompt for a 3D Donghua character based on a simple description.
 */
export const generateDonghuaPrompt = async (userInput: string): Promise<string> => {
  try {
    // Updated suffixes to enforce full body, front view, pure white background, and no text.
    // Kept the style and negative constraints.
    const mandatorySuffixes = "full body shot, standing pose, front view, pure white background, simple background, no text, 8k resolution, cinematic lighting, 3D render, best quality, Battle Through the Heavens style, 3D CG, unreal engine 5, not realistic, not real person, not photorealistic";

    const systemInstruction = `
      You are an expert prompt engineer specializing in 3D Chinese Animation (Donghua/Guoman) character design.
      
      **TASK:** 
      Convert the user's character description into a prompt for a **High-Quality 3D Donghua Character Render**.

      **LAYOUT REQUIREMENT (CRITICAL):**
      - **Composition:** FULL BODY SHOT (Must show head to feet).
      - **Pose:** Standing straight, Front View.
      - **Background:** PURE WHITE BACKGROUND, Clean, Minimalist.
      - **Constraint:** ABSOLUTELY NO TEXT, NO LOGOS, NO WATERMARKS in the background.

      **Style Guidelines:**
      - **"Battle Through the Heavens" (Doupo Cangqiong)** aesthetic.
      - High-fidelity 3D Render (Blender/C4D/Octane).
      - Xuanhuan/Cultivation style: exquisite robes, armor, glowing energy, noble aura.
      - Focus on describing the character's facial features, hairstyle, clothing details, and accessories in English.

      **Negative Constraints (STRICTLY ENFORCED):**
      - **ABSOLUTELY FORBIDDEN:** Do NOT use words like: 'photorealistic', 'realistic', 'real life', 'human', 'photo', 'hyperrealistic', 'photography', 'camera', 'live action'.
      - **NO:** 2D, Cartoon, Anime drawings, Sketch, Chibi, Cropped image, Close up.
      - **REPLACEMENT:** If you want to describe detail, use 'highly detailed 3D', 'intricate textures', '8k CG', or 'masterpiece' instead of 'realistic'.
      - The result must look like a high-end **3D CG Render**, NOT a photograph of a real person.
      
      **Mandatory Requirements:**
      You MUST append the following keywords to the very end of the generated prompt exactly as listed:
      "${mandatorySuffixes}"
      
      **Output Format:**
      Return ONLY the optimized prompt text in English.
    `;

    const response = await ai.models.generateContent({
      model: ModelNames.TEXT_MODEL,
      contents: `User Description: ${userInput}\n\nCreate a detailed 3D Donghua character prompt (Full Body, Front View, White Background). Ensure NO realistic/photo keywords are used.`,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || "Failed to generate prompt.";
  } catch (error) {
    console.error("Error generating prompt:", error);
    throw error;
  }
};

/**
 * Generates an image based on the prompt using Nano Banana Pro.
 */
export const generateDonghuaImage = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: ModelNames.IMAGE_MODEL,
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "9:16", // Changed to 9:16 for full body portrait
          imageSize: "1K",
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("No image data found in response.");
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};