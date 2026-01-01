export interface Experience {
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
  inferredSkills: string[];
}

export interface Education {
  degree: string;
  school: string;
  startDate: string;
  endDate: string;
}

export interface Language {
  language: string;
  level: string;
}

export interface Hobby {
  name: string;
  deducedQualities: string[];
}

export interface Feedback {
  strengths: string[];
  improvements: string[];
  overallMatchScore: number; // 0-100 score de "complétude" du profil
}

export interface CVAnalysisResult {
  candidateName: string;
  professionalSummary: string; // Généré par l'IA
  experiences: Experience[];
  education: Education[];
  hardSkills: string[];
  softSkills: string[];
  languages: Language[];
  hobbies: Hobby[];
  feedback: Feedback;
}