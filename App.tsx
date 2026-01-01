import React, { useState } from 'react';
import Uploader from './components/Uploader';
import Dashboard from './components/Dashboard';
import { analyzeCV } from './services/geminiService';
import { CVAnalysisResult } from './types';
import { Sparkles, LayoutDashboard } from 'lucide-react';

const App: React.FC = () => {
  const [analysisData, setAnalysisData] = useState<CVAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileAnalyze = async (file: File) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeCV(file);
      setAnalysisData(result);
    } catch (err: any) {
      setError("Une erreur est survenue lors de l'analyse. Vérifiez que votre clé API est valide ou essayez un autre fichier.");
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setAnalysisData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">Hiry<span className="text-indigo-600">.ai</span></span>
          </div>
          <div className="flex items-center gap-4">
             <a href="#" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">Documentation</a>
             <div className="h-4 w-px bg-slate-200"></div>
             <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                System Operational
             </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {!analysisData ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-fade-in-up">
                <div className="text-center max-w-2xl mx-auto space-y-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                        Révélez le potentiel <br/> 
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">caché de chaque CV.</span>
                    </h1>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        Notre IA analyse sémantiquement vos documents, détecte les compétences implicites et structure les données pour un matching parfait.
                    </p>
                </div>

                <div className="w-full">
                    <Uploader 
                        onFileSelect={handleFileAnalyze} 
                        isAnalyzing={isAnalyzing}
                        error={error}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-sm text-slate-500 mt-12 max-w-3xl">
                    <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
                        <strong className="block text-slate-800 mb-1">Inférence Cognitive</strong>
                        Détection des soft skills via les hobbies et expériences.
                    </div>
                    <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
                        <strong className="block text-slate-800 mb-1">Lecture Multimodale</strong>
                        Analyse native des PDF et Images (OCR + Sémantique).
                    </div>
                    <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
                        <strong className="block text-slate-800 mb-1">Structure JSON</strong>
                        Données prêtes à l'emploi pour votre ATS/Base de données.
                    </div>
                </div>
            </div>
        ) : (
            <Dashboard data={analysisData} onReset={handleReset} />
        )}

      </main>

    </div>
  );
};

export default App;