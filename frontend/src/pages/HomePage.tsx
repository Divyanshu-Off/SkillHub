import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FolderGit2, Compass, Cpu } from 'lucide-react';

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          Full-Stack Learning & Portfolio Platform
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Showcase Engineering Work. <br />
          <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            Track Your Mastery.
          </span>
        </h1>
        <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
          SkillHub lets developers create structured learning roadmaps, record milestones, and showcase end-to-end full-stack and ML projects in one clean workspace.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
          >
            <FolderGit2 className="w-4 h-4" />
            Explore Projects
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-medium text-sm transition"
          >
            GitHub Repository
          </a>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 transition">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4">
            <FolderGit2 className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Project Portfolio</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Organize live links, source repositories, tech stacks, and screenshots with clear DRF-backed CRUD operations.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 transition">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-4">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Learning Paths</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Curate stepwise curriculums for topics like Django Full-Stack, NLP, or System Design, tracking progress step by step.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 transition">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Clean Architecture</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Separation of concerns with Django REST Framework, PostgreSQL, Vite, React Query, and automated GitHub Actions CI.
          </p>
        </div>
      </section>
    </div>
  );
};
