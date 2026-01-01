import { GoogleGenAI, Type, Schema } from "@google/genai";
import { CVAnalysisResult } from "../types";

// Convert File to Base64 helper
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the "data:*/*;base64," prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

const getMimeType = (file: File): string => {
  if (file.type) return file.type;
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return 'application/pdf';
  if (ext === 'png') return 'image/png';
  if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg';
  return 'application/pdf'; // Fallback
};

const cvSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    candidateName: { type: Type.STRING, description: "Nom complet du candidat trouvé sur le CV" },
    professionalSummary: { type: Type.STRING, description: "Un résumé professionnel de 3 phrases mettant en valeur le profil généré par l'IA." },
    experiences: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          company: { type: Type.STRING },
          startDate: { type: Type.STRING },
          endDate: { type: Type.STRING },
          description: { type: Type.STRING },
          inferredSkills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Compétences déduites de cette expérience spécifique" }
        }
      }
    },
    education: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          degree: { type: Type.STRING },
          school: { type: Type.STRING },
          startDate: { type: Type.STRING },
          endDate: { type: Type.STRING }
        }
      }
    },
    hardSkills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Liste exhaustive des compétences techniques" },
    softSkills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Liste des soft skills déduits de l'ensemble du profil" },
    languages: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          language: { type: Type.STRING },
          level: { type: Type.STRING }
        }
      }
    },
    hobbies: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          deducedQualities: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Qualités humaines déduites de ce hobby (ex: Sport Co -> Esprit d'équipe)" }
        }
      }
    },
    feedback: {
      type: Type.OBJECT,
      properties: {
        strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Points forts du profil" },
        improvements: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Suggestions d'amélioration pour le CV" },
        overallMatchScore: { type: Type.NUMBER, description: "Score de 0 à 100 sur la qualité et la complétude du CV" }
      }
    }
  },
  required: ["candidateName", "professionalSummary", "experiences", "education", "hardSkills", "softSkills", "languages", "hobbies", "feedback"]
};

export const analyzeCV = async (file: File): Promise<CVAnalysisResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Use gemini-3-flash-preview for faster response times and reliable multimodal processing
  // This solves the "infinite loading" issue seen with the Pro model in some environments
  const modelId = "gemini-3-flash-preview";

  const base64Data = await fileToBase64(file);
  const mimeType = getMimeType(file);

  const prompt = `
    Tu es un expert Analyste RH Senior chez Hiry, spécialisé dans la détection de talents pour les PME.
    Ta mission est d'analyser ce CV en profondeur.

    Instructions d'analyse :
    1.  **Hard Skills** : Extrais tout ce qui est technique (outils, langages, méthodos).
    2.  **Soft Skills (Inférence)** : Ne te contente pas de lire. DÉDUIS.
        - Si le candidat a fait du "Scoutisme", déduis "Leadership", "Débrouillardise".
        - Si il a "géré des conflits clients", déduis "Diplomatie", "Intelligence émotionnelle".
    3.  **Synthèse** : Rédige un résumé professionnel accrocheur à la 3ème personne.
    4.  **Feedback** : Donne des conseils constructifs pour améliorer ce CV.

    Retourne UNIQUEMENT du JSON respectant le schéma fourni.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Data
              }
            },
            {
              text: prompt
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: cvSchema,
        // Removed thinkingConfig to reduce latency significantly
      }
    });

    if (response.text) {
      try {
        const raw = JSON.parse(response.text);
        
        // Defensive coding: Ensure all arrays exist to prevent "cannot read property map of undefined"
        const result: CVAnalysisResult = {
          candidateName: raw.candidateName || "Candidat",
          professionalSummary: raw.professionalSummary || "Analyse terminée.",
          experiences: Array.isArray(raw.experiences) ? raw.experiences : [],
          education: Array.isArray(raw.education) ? raw.education : [],
          hardSkills: Array.isArray(raw.hardSkills) ? raw.hardSkills : [],
          softSkills: Array.isArray(raw.softSkills) ? raw.softSkills : [],
          languages: Array.isArray(raw.languages) ? raw.languages : [],
          hobbies: Array.isArray(raw.hobbies) ? raw.hobbies : [],
          feedback: {
            strengths: raw.feedback?.strengths && Array.isArray(raw.feedback.strengths) ? raw.feedback.strengths : [],
            improvements: raw.feedback?.improvements && Array.isArray(raw.feedback.improvements) ? raw.feedback.improvements : [],
            overallMatchScore: typeof raw.feedback?.overallMatchScore === 'number' ? raw.feedback.overallMatchScore : 0
          }
        };

        // Deep clean experiences to ensure inferredSkills is an array
        result.experiences = result.experiences.map(exp => ({
            ...exp,
            inferredSkills: Array.isArray(exp.inferredSkills) ? exp.inferredSkills : []
        }));

        // Deep clean hobbies to ensure deducedQualities is an array
        result.hobbies = result.hobbies.map(hobby => ({
            ...hobby,
            deducedQualities: Array.isArray(hobby.deducedQualities) ? hobby.deducedQualities : []
        }));

        return result;

      } catch (e) {
        console.error("Failed to parse JSON", e);
        throw new Error("Invalid JSON response from AI");
      }
    } else {
      throw new Error("No response text generated");
    }

  } catch (error) {
    console.error("Error analyzing CV:", error);
    throw error;
  }
};