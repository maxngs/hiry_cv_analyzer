import React from 'react';
import { CVAnalysisResult, Experience, Education } from '../types';
import { 
  Briefcase, 
  GraduationCap, 
  Code, 
  Heart, 
  Globe, 
  Sparkles, 
  CheckCircle, 
  TrendingUp,
  Brain,
  User
} from 'lucide-react';

interface DashboardProps {
  data: CVAnalysisResult;
  onReset: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ data, onReset }) => {
  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-12">
      
      {/* Header Profile */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 items-start">
        <div className="bg-indigo-100 p-4 rounded-full flex-shrink-0">
          <User className="w-8 h-8 text-indigo-600" />
        </div>
        <div className="flex-grow">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">{data.candidateName || "Candidat Anonyme"}</h2>
                    <p className="text-slate-500 text-sm mt-1">Analyse complétée avec succès</p>
                </div>
                <div className="flex flex-col items-end">
                    <div className="text-2xl font-bold text-indigo-600">{data.feedback.overallMatchScore}/100</div>
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Score Hiry</span>
                </div>
            </div>
            <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-slate-600 italic">"{data.professionalSummary}"</p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Experiences */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-6">
                    <Briefcase className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-lg font-bold text-slate-800">Expériences Professionnelles</h3>
                </div>
                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                    {data.experiences.length === 0 && <p className="text-slate-400 pl-8">Aucune expérience détectée.</p>}
                    {data.experiences.map((exp, idx) => (
                        <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 group-[.is-active]:bg-indigo-50 text-slate-500 group-[.is-active]:text-indigo-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                <Briefcase className="w-4 h-4" />
                            </div>
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                <div className="flex flex-col sm:flex-row justify-between mb-1">
                                    <h4 className="font-bold text-slate-700">{exp.title}</h4>
                                    <span className="text-xs font-semibold text-indigo-500 bg-indigo-50 px-2 py-1 rounded-full w-fit">{exp.startDate} - {exp.endDate}</span>
                                </div>
                                <div className="text-sm text-slate-500 font-medium mb-2">{exp.company}</div>
                                <p className="text-sm text-slate-600 mb-3">{exp.description}</p>
                                {exp.inferredSkills && exp.inferredSkills.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {exp.inferredSkills.map((skill, sIdx) => (
                                            <span key={sIdx} className="text-[10px] px-2 py-0.5 bg-green-50 text-green-700 border border-green-100 rounded-full flex items-center gap-1">
                                                <Sparkles className="w-2 h-2" /> {skill}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

             {/* Education */}
             <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-6">
                    <GraduationCap className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-lg font-bold text-slate-800">Formation</h3>
                </div>
                <div className="space-y-4">
                    {data.education.map((edu, idx) => (
                        <div key={idx} className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="mt-1">
                                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                                    <GraduationCap className="w-4 h-4" />
                                </div>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-700">{edu.degree}</h4>
                                <p className="text-sm text-slate-600">{edu.school}</p>
                                <p className="text-xs text-slate-400 mt-1">{edu.startDate} - {edu.endDate}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">

            {/* Skills */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-4">
                    <Code className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-lg font-bold text-slate-800">Hard Skills</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                    {data.hardSkills.map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium border border-slate-200">
                            {skill}
                        </span>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-4">
                    <Brain className="w-5 h-5 text-pink-500" />
                    <h3 className="text-lg font-bold text-slate-800">Soft Skills (IA)</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                    {data.softSkills.map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 bg-pink-50 text-pink-700 rounded-lg text-sm font-medium border border-pink-100 flex items-center gap-1">
                            {skill}
                        </span>
                    ))}
                </div>
            </div>

            {/* Hobbies & Inferences */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-4">
                    <Heart className="w-5 h-5 text-red-500" />
                    <h3 className="text-lg font-bold text-slate-800">Hobbies & Déductions</h3>
                </div>
                <div className="space-y-3">
                    {data.hobbies.map((hobby, idx) => (
                        <div key={idx} className="p-3 bg-red-50/50 rounded-lg border border-red-100">
                            <div className="font-semibold text-slate-700 text-sm">{hobby.name}</div>
                            <div className="mt-1 flex flex-wrap gap-1">
                                {hobby.deducedQualities.map((q, qIdx) => (
                                    <span key={qIdx} className="text-[10px] text-red-600 bg-white px-1.5 py-0.5 rounded border border-red-100 opacity-80">
                                        +{q}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Languages */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-4">
                    <Globe className="w-5 h-5 text-blue-500" />
                    <h3 className="text-lg font-bold text-slate-800">Langues</h3>
                </div>
                <div className="space-y-2">
                    {data.languages.map((lang, idx) => (
                        <div key={idx} className="flex justify-between items-center p-2 rounded-lg hover:bg-slate-50">
                            <span className="font-medium text-slate-700">{lang.language}</span>
                            <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded">{lang.level}</span>
                        </div>
                    ))}
                </div>
            </div>

        </div>

        {/* Full Width Feedback */}
        <div className="lg:col-span-3">
             <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 shadow-lg text-white">
                <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="w-6 h-6 text-white" />
                    <h3 className="text-xl font-bold">Analyse & Feedback Hiry</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2 opacity-90"><CheckCircle className="w-4 h-4"/> Points Forts</h4>
                        <ul className="space-y-2">
                            {data.feedback.strengths.map((str, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm opacity-90">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-400 shrink-0"></span>
                                    {str}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2 opacity-90"><Sparkles className="w-4 h-4"/> Pistes d'amélioration</h4>
                        <ul className="space-y-2">
                            {data.feedback.improvements.map((imp, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm opacity-90">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-yellow-400 shrink-0"></span>
                                    {imp}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>

      </div>

      <div className="flex justify-center pt-8">
        <button 
            onClick={onReset}
            className="px-6 py-3 bg-white border border-slate-200 text-slate-600 font-medium rounded-full shadow-sm hover:bg-slate-50 transition-colors"
        >
            Analyser un autre CV
        </button>
      </div>

    </div>
  );
};

export default Dashboard;