import React from 'react';
import { Compass } from 'lucide-react';

export const PathsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <Compass className="w-8 h-8 text-cyan-400" />
          Learning Paths
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Explore structured curriculums with ordered milestones and resources.
        </p>
      </div>

      <div className="p-8 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 text-center space-y-3">
        <Compass className="w-12 h-12 text-slate-600 mx-auto" />
        <h3 className="text-base font-semibold text-slate-300">Curriculums coming next</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          The Learning Paths & Step Tracking module will be connected after the foundation projects and auth flow are finalized.
        </p>
      </div>
    </div>
  );
};
