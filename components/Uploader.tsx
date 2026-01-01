import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, X, AlertCircle } from 'lucide-react';

interface UploaderProps {
  onFileSelect: (file: File) => void;
  isAnalyzing: boolean;
  error?: string | null;
}

const Uploader: React.FC<UploaderProps> = ({ onFileSelect, isAnalyzing, error }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (validTypes.includes(file.type)) {
      setSelectedFile(file);
    } else {
      alert("Format non supporté. Veuillez utiliser PDF, PNG ou JPG.");
    }
  };

  const handleAnalyzeClick = () => {
    if (selectedFile) {
        onFileSelect(selectedFile);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (inputRef.current) {
        inputRef.current.value = "";
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div 
        className={`relative group rounded-3xl border-2 border-dashed transition-all duration-300 ease-in-out p-10 flex flex-col items-center justify-center text-center
            ${dragActive ? 'border-indigo-500 bg-indigo-50/50 scale-[1.02]' : 'border-slate-300 bg-white hover:border-indigo-400 hover:bg-slate-50'}
            ${selectedFile ? 'border-solid border-green-500 bg-green-50/30' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input 
            ref={inputRef}
            type="file" 
            className="hidden" 
            onChange={handleChange}
            accept=".pdf,.png,.jpg,.jpeg"
            disabled={isAnalyzing}
        />

        {!selectedFile ? (
            <>
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Déposez votre CV ici</h3>
                <p className="text-slate-500 mb-6">ou cliquez pour sélectionner un fichier (PDF, Image)</p>
                <button 
                    onClick={() => inputRef.current?.click()}
                    className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-full hover:bg-slate-100 transition-colors shadow-sm"
                >
                    Parcourir les fichiers
                </button>
            </>
        ) : (
            <>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1 truncate max-w-full px-4">{selectedFile.name}</h3>
                <p className="text-sm text-slate-500 mb-6">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                
                <div className="flex gap-3">
                    <button 
                        onClick={clearFile}
                        disabled={isAnalyzing}
                        className="px-4 py-2 text-slate-500 hover:text-red-500 transition-colors"
                    >
                        Changer
                    </button>
                    <button 
                        onClick={handleAnalyzeClick}
                        disabled={isAnalyzing}
                        className={`px-8 py-2.5 bg-indigo-600 text-white font-medium rounded-full shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2`}
                    >
                       {isAnalyzing ? (
                        <>
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Analyse en cours...
                        </>
                       ) : "Lancer l'analyse"}
                    </button>
                </div>
            </>
        )}
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-700">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
        </div>
      )}
      
      <div className="mt-8 text-center">
        <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-4">Propulsé par Gemini 2.0</p>
        <div className="flex justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-slate-300"></div>
            <div className="w-2 h-2 rounded-full bg-slate-300"></div>
            <div className="w-2 h-2 rounded-full bg-slate-300"></div>
        </div>
      </div>
    </div>
  );
};

export default Uploader;