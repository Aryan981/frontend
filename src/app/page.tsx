"use client";

import React, { useState } from 'react';
import axios from 'axios';
import {
  Rocket,
  Brain,
  Target,
  Map,
  MessageSquare,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { FileUpload } from '@/components/FileUpload';
import { CareerCompanionReport } from '@/types';

type Step = 'landing' | 'upload' | 'analyzing' | 'results';

export default function CareerCompanion() {
  const [step, setStep] = useState<Step>('landing');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState('');
  const [report, setReport] = useState<CareerCompanionReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startAnalysis = async () => {
    if (!selectedFile || !targetRole) return;

    setStep('analyzing');
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      // 1. Get Resume Text
      const parseRes = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/parse-resume`, formData);
      const resumeText = parseRes.data.resume_text;

      // 2. Run Full Analysis
      const analysisRes = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/analyze-full`, {
        resume_text: resumeText,
        target_role: targetRole
      });

      setReport(analysisRes.data);
      setStep('results');
    } catch (err: any) {
      console.error("Analysis Error Response:", err.response?.data);
      console.error("Full Axios Error:", err);
      setError(err.response?.data?.detail || "Something went wrong during analysis. Please check if the backend is running and the API key is set.");
      setStep('upload');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-100 italic-none">
      {/* Header */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Rocket className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">CareerCompanion</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <button onClick={() => setStep('landing')} className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">How it works</button>
            <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-all shadow-sm">Sign In</button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {step === 'landing' && (
          <div className="flex flex-col items-center text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium border border-blue-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span>Next-Gen AI Career Coaching</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 max-w-4xl">
              Navigate your career with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">AI Intelligence</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl leading-relaxed">
              Upload your resume and target role. Our multi-agent AI system analyzes gaps, builds your roadmap, and simulates interviews.
            </p>
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => setStep('upload')}
                className="group px-8 py-4 bg-blue-600 text-white rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200/50 flex items-center"
              >
                Analyze My Career
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-xl text-lg font-semibold hover:bg-slate-50 transition-all">
                View Sample Report
              </button>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8 mt-24 text-left">
              {[
                { icon: Brain, title: "Resume Analysis", desc: "Deep extraction of skills, experience, and projects." },
                { icon: Target, title: "Gap Analysis", desc: "Identify exactly what you need for your next role." },
                { icon: Map, title: "Learning Roadmap", desc: "A personalized week-by-week plan to upskill." }
              ].map((f, i) => (
                <div key={i} className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-4">
                    <f.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 'upload' && (
          <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">Start your Analysis</h2>
              <p className="text-slate-500">Provide your resume and target role to begin.</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">1. Upload Resume</label>
                <FileUpload onFileSelect={setSelectedFile} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">2. Target Role</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Frontend Engineer"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start space-x-3 text-red-700">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <button
                disabled={!selectedFile || !targetRole}
                onClick={startAnalysis}
                className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-all"
              >
                Generate Career Report
              </button>
            </div>
          </div>
        )}

        {step === 'analyzing' && (
          <div className="max-w-md mx-auto flex flex-col items-center justify-center space-y-8 min-h-[50vh]">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-100 rounded-full blur-2xl animate-pulse"></div>
              <div className="relative bg-white p-8 rounded-full shadow-xl">
                <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
              </div>
            </div>
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">Agents are working...</h2>
              <div className="space-y-2 text-slate-500 text-sm">
                <p className="flex items-center justify-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  <span>Analyzing Resume Experience</span>
                </p>
                <p className="flex items-center justify-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                  <span>Interpreting Role Expectations</span>
                </p>
                <p className="flex items-center justify-center space-x-2 animate-pulse">
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
                  <span>Synthesizing Learning Roadmap</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {step === 'results' && report && (
          <div className="space-y-12 animate-in fade-in duration-700">
            {/* Report component will go here or be inline */}
            <div className="flex flex-col items-center text-center space-y-4 mb-12">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-4xl font-bold">Analysis Complete</h2>
              <p className="text-slate-500">We've identified {report.skill_gaps.length} key areas for growth.</p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
              {/* Summary Column */}
              <div className="lg:col-span-4 space-y-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <h3 className="font-bold text-xl mb-4">Resume Insights</h3>
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Experience</span>
                      <p className="font-medium">{report.resume_analysis.years_of_experience} Years</p>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Top Skills</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {report.resume_analysis.skills.slice(0, 6).map((s, i) => (
                          <span key={i} className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-xs font-medium">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <h3 className="font-bold text-xl mb-4">Skill Gaps</h3>
                  <div className="space-y-6">
                    {report.skill_gaps.map((gap, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-sm">{gap.skill_name}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${gap.priority === 'high' ? 'bg-red-100 text-red-600' :
                            gap.priority === 'medium' ? 'bg-orange-100 text-orange-600' :
                              'bg-blue-100 text-blue-600'
                            }`}>
                            {gap.priority}
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-600 h-full rounded-full transition-all duration-1000"
                            style={{ width: `${(gap.current_level / 5) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* roadmap column */}
              <div className="lg:col-span-8 space-y-8">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="font-bold text-2xl">Learning Roadmap</h3>
                    <Map className="text-slate-300 w-6 h-6" />
                  </div>
                  <div className="space-y-8 border-l-2 border-slate-100 ml-4 pl-8">
                    {report.roadmap.map((step, i) => (
                      <div key={i} className="relative">
                        <div className="absolute -left-[41px] top-0 w-4 h-4 rounded-full bg-blue-600 ring-4 ring-blue-50"></div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-blue-600 font-bold">Week {step.week_number}</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-sm text-slate-500">{step.estimated_hours} Hours</span>
                          </div>
                          <h4 className="font-bold text-lg">{step.learning_goal}</h4>
                          <div className="flex flex-wrap gap-2">
                            {step.recommended_resources.map((r, i) => (
                              <span key={i} className="text-xs px-2 py-1 bg-slate-100 rounded-md text-slate-600">{r}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-2xl shadow-xl text-white overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <MessageSquare className="w-24 h-24" />
                  </div>
                  <h3 className="font-bold text-2xl mb-8">Interview Simulation</h3>
                  <div className="space-y-8">
                    {report.interview_questions.map((q, i) => (
                      <div key={i} className="bg-white/10 p-6 rounded-xl border border-white/10 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${q.difficulty === 'hard' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                            }`}>
                            {q.difficulty}
                          </span>
                        </div>
                        <p className="text-lg font-medium leading-relaxed">"{q.question}"</p>
                        <div className="space-y-2">
                          <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Expected Points</p>
                          <ul className="text-sm text-white/70 list-disc ml-5 space-y-1">
                            {q.expected_answer_points.map((p, i) => (
                              <li key={i}>{p}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-12 pb-24">
              <button
                onClick={() => window.print()}
                className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold flex items-center space-x-2 hover:bg-slate-50 transition-all"
              >
                <span>Download Full Report (PDF)</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
