import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  fetchPaths,
  createLearningPath,
  createPathStep,
  toggleStepCompletion,
} from '../services/pathService';
import { useAuth } from '../context/AuthContext';
import type { LearningPath, CreateLearningPathPayload } from '../types/path';
import {
  Compass,
  Plus,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Circle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  User,
  X,
  Lock,
} from 'lucide-react';

export const PathsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isPathModalOpen, setIsPathModalOpen] = useState(false);
  const [selectedPathForStep, setSelectedPathForStep] = useState<LearningPath | null>(null);
  const [expandedPathIds, setExpandedPathIds] = useState<Record<number, boolean>>({});

  // Path form state
  const [pathForm, setPathForm] = useState<CreateLearningPathPayload>({
    title: '',
    description: '',
    category: 'Full-Stack',
  });
  const [pathError, setPathError] = useState<string | null>(null);

  // Step form state
  const [stepForm, setStepForm] = useState({
    title: '',
    description: '',
    resource_url: '',
    order: 1,
  });
  const [stepError, setStepError] = useState<string | null>(null);

  // Queries
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['learningPaths'],
    queryFn: () => fetchPaths(1),
  });

  // Toggle path accordion
  const toggleAccordion = (id: number) => {
    setExpandedPathIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Mutations
  const createPathMutation = useMutation({
    mutationFn: createLearningPath,
    onSuccess: (newPath) => {
      queryClient.invalidateQueries({ queryKey: ['learningPaths'] });
      setIsPathModalOpen(false);
      setPathForm({ title: '', description: '', category: 'Full-Stack' });
      setPathError(null);
      // Auto expand newly created path
      setExpandedPathIds((prev) => ({ ...prev, [newPath.id]: true }));
    },
    onError: (err: any) => {
      setPathError(err?.response?.data?.detail || 'Failed to create learning path.');
    },
  });

  const createStepMutation = useMutation({
    mutationFn: createPathStep,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learningPaths'] });
      setSelectedPathForStep(null);
      setStepForm({ title: '', description: '', resource_url: '', order: 1 });
      setStepError(null);
    },
    onError: (err: any) => {
      setStepError(err?.response?.data?.detail || 'Failed to add step.');
    },
  });

  const toggleStepMutation = useMutation({
    mutationFn: toggleStepCompletion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learningPaths'] });
    },
  });

  const handleCreatePathSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pathForm.title.trim()) {
      setPathError('Path title is required.');
      return;
    }
    createPathMutation.mutate(pathForm);
  };

  const handleCreateStepSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPathForStep || !stepForm.title.trim()) {
      setStepError('Step title is required.');
      return;
    }
    createStepMutation.mutate({
      path: selectedPathForStep.id,
      title: stepForm.title,
      description: stepForm.description,
      resource_url: stepForm.resource_url,
      order: stepForm.order,
    });
  };

  const handleStepCheck = (stepId: number) => {
    if (!user) {
      navigate('/signin', { state: { from: { pathname: '/paths' } } });
      return;
    }
    toggleStepMutation.mutate(stepId);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Compass className="w-8 h-8 text-cyan-400" />
            Learning Paths & Roadmaps
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Follow structured engineering paths, complete milestones, and track your progress.
          </p>
        </div>
        <button
          onClick={() => {
            if (!user) {
              navigate('/signin', { state: { from: { pathname: '/paths' } } });
              return;
            }
            setIsPathModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium shadow-md shadow-cyan-600/30 transition-all active:scale-95 self-start sm:self-auto cursor-pointer"
        >
          {user ? <Plus className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          {user ? 'New Learning Path' : 'Sign in to Create Path'}
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
          <p className="text-sm">Loading learning roadmaps...</p>
        </div>
      ) : isError ? (
        <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-center gap-3">
          <AlertCircle className="w-6 h-6 flex-shrink-0 text-rose-400" />
          <div>
            <p className="font-semibold text-sm">Failed to connect to backend</p>
            <p className="text-xs text-rose-400/80 mt-0.5">{(error as Error)?.message}</p>
          </div>
        </div>
      ) : data?.results.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-slate-800 bg-slate-900/30">
          <Compass className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-300">No learning paths yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Create your first learning curriculum with milestones and resources.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {data?.results.map((path: LearningPath) => {
            const isExpanded = !!expandedPathIds[path.id];
            const percent =
              path.total_steps > 0
                ? Math.round((path.completed_steps / path.total_steps) * 100)
                : 0;

            return (
              <div
                key={path.id}
                className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden shadow-lg transition-all"
              >
                {/* Path Card Header */}
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2.5">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                          {path.category}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                          <User className="w-3 h-3 text-cyan-400" />
                          {path.owner}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-white tracking-tight">{path.title}</h2>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        {path.description || 'No description provided.'}
                      </p>
                    </div>

                    {/* Progress Bar & Actions */}
                    <div className="flex items-center gap-4 min-w-[220px]">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>Progress</span>
                          <span className="font-semibold text-cyan-400">{percent}%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <p className="text-[11px] text-slate-500 text-right">
                          {path.completed_steps} / {path.total_steps} steps completed
                        </p>
                      </div>

                      <button
                        onClick={() => toggleAccordion(path.id)}
                        className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
                        title={isExpanded ? 'Collapse' : 'Expand'}
                      >
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Steps Section (Expanded) */}
                {isExpanded && (
                  <div className="border-t border-slate-800/80 bg-slate-950/40 p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-slate-200">
                        Milestones ({path.steps.length})
                      </h3>
                      {user && user.username === path.owner && (
                        <button
                          onClick={() => {
                            setSelectedPathForStep(path);
                            setStepForm((prev) => ({
                              ...prev,
                              order: path.steps.length + 1,
                            }));
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 transition cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add Step
                        </button>
                      )}
                    </div>

                    {path.steps.length === 0 ? (
                      <div className="text-center py-8 text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                        No steps added to this path yet.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {path.steps.map((step) => (
                          <div
                            key={step.id}
                            className={`flex items-start gap-3.5 p-4 rounded-xl border transition-all ${
                              step.is_completed
                                ? 'bg-emerald-950/10 border-emerald-500/20 text-slate-300'
                                : 'bg-slate-900/60 border-slate-800 text-slate-300'
                            }`}
                          >
                            <button
                              onClick={() => handleStepCheck(step.id)}
                              className="mt-0.5 text-slate-400 hover:text-cyan-400 transition cursor-pointer flex-shrink-0"
                              title={step.is_completed ? 'Mark incomplete' : 'Mark complete'}
                            >
                              {step.is_completed ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                              ) : (
                                <Circle className="w-5 h-5 text-slate-500 hover:text-cyan-400" />
                              )}
                            </button>

                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-cyan-400 font-bold">
                                  Step {step.order}
                                </span>
                                <h4
                                  className={`text-sm font-semibold ${
                                    step.is_completed ? 'line-through text-slate-400' : 'text-white'
                                  }`}
                                >
                                  {step.title}
                                </h4>
                              </div>
                              {step.description && (
                                <p className="text-xs text-slate-400 leading-relaxed">
                                  {step.description}
                                </p>
                              )}
                            </div>

                            {step.resource_url && (
                              <a
                                href={step.resource_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 transition flex-shrink-0"
                              >
                                Resource
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* New Path Modal */}
      {isPathModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-cyan-400" /> Create Learning Path
              </h2>
              <button
                onClick={() => setIsPathModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {pathError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{pathError}</span>
              </div>
            )}

            <form onSubmit={handleCreatePathSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Path Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Django Full-Stack Mastery"
                  value={pathForm.title}
                  onChange={(e) => setPathForm({ ...pathForm, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                <select
                  value={pathForm.category}
                  onChange={(e) => setPathForm({ ...pathForm, category: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                >
                  <option value="Full-Stack">Full-Stack</option>
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="DevOps & Cloud">DevOps & Cloud</option>
                  <option value="System Design">System Design</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Overview of this curriculum and what skills will be learned..."
                  value={pathForm.description}
                  onChange={(e) => setPathForm({ ...pathForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPathModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createPathMutation.isPending}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-sm font-medium shadow-md shadow-cyan-600/30 transition cursor-pointer"
                >
                  {createPathMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Create Path
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Step Modal */}
      {selectedPathForStep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-cyan-400" /> Add Step to {selectedPathForStep.title}
              </h2>
              <button
                onClick={() => setSelectedPathForStep(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {stepError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{stepError}</span>
              </div>
            )}

            <form onSubmit={handleCreateStepSubmit} className="space-y-4">
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-3">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Step Title <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Set up JWT Authentication"
                    value={stepForm.title}
                    onChange={(e) => setStepForm({ ...stepForm, title: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Order</label>
                  <input
                    type="number"
                    min={1}
                    value={stepForm.order}
                    onChange={(e) => setStepForm({ ...stepForm, order: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Step Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Details, instructions, or goals for this step..."
                  value={stepForm.description}
                  onChange={(e) => setStepForm({ ...stepForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Resource URL (Docs, Video, Tutorial)
                </label>
                <input
                  type="url"
                  placeholder="https://docs.djangoproject.com/..."
                  value={stepForm.resource_url}
                  onChange={(e) => setStepForm({ ...stepForm, resource_url: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedPathForStep(null)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createStepMutation.isPending}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-sm font-medium shadow-md shadow-cyan-600/30 transition cursor-pointer"
                >
                  {createStepMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Add Step
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
