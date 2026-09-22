import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  fetchPaths,
  createLearningPath,
  createPathStep,
  toggleStepCompletion,
} from '../services/pathService';
import { useAuth } from '../context/AuthContext';
import type { LearningPath, CreateLearningPathPayload } from '../types/path';
import {
  Plus,
  Loader2,
  AlertCircle,
  CheckSquare,
  Square,
  ExternalLink,
  ChevronDown,
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
      setStepError(err?.response?.data?.detail || 'Failed to add milestone step.');
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
    <div className="space-y-10 pb-12">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-border pb-6">
        <div className="space-y-2">
          <span className="text-[11px] font-mono tracking-widest uppercase text-muted-foreground block">
            [Syllabus / Roadmaps]
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
            Learning Curriculums
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
            Structured engineering roadmaps with verifiable milestones and progress metrics.
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
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-sm bg-foreground text-background font-mono text-xs uppercase tracking-wider font-semibold hover:opacity-90 transition cursor-pointer self-start sm:self-auto shadow-sm"
        >
          {user ? <Plus className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
          {user ? 'New Curriculum' : 'Sign In to Author'}
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-foreground" />
          <p className="text-xs font-mono uppercase tracking-wider">Loading curriculum architectures...</p>
        </div>
      ) : isError ? (
        <div className="p-5 rounded-sm border border-destructive/30 bg-destructive/5 text-destructive text-xs font-mono space-y-1">
          <div className="flex items-center gap-2 font-semibold">
            <AlertCircle className="w-4 h-4" />
            <span>Connection Error</span>
          </div>
          <p className="text-muted-foreground">{(error as Error)?.message}</p>
        </div>
      ) : data?.results.length === 0 ? (
        <div className="text-center py-20 px-4 rounded-sm border border-dashed border-border bg-card">
          <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground block mb-2">
            [Empty Index]
          </span>
          <h3 className="font-serif text-lg font-semibold text-foreground">No curriculums published yet</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            Design your first learning roadmap with stepwise milestones.
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
                className="editorial-card overflow-hidden"
              >
                {/* Path Card Header */}
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3 text-xs font-mono">
                        <span className="px-2 py-0.5 rounded-sm bg-secondary border border-border text-foreground font-medium uppercase tracking-wider text-[10px]">
                          {path.category}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <User className="w-3 h-3 text-muted-foreground" />
                          {path.owner}
                        </span>
                      </div>

                      <h2 className="font-serif text-2xl font-bold text-foreground">
                        {path.title}
                      </h2>

                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-3xl">
                        {path.description || 'No descriptive overview provided.'}
                      </p>
                    </div>

                    {/* Progress Bar & Accordion Toggle */}
                    <div className="flex items-center gap-5 min-w-[240px] pt-1">
                      <div className="flex-1 space-y-1.5 font-mono text-xs">
                        <div className="flex items-center justify-between text-muted-foreground">
                          <span className="uppercase tracking-widest text-[10px]">Mastery</span>
                          <span className="font-bold text-foreground">{percent}%</span>
                        </div>
                        <div className="w-full bg-secondary h-1.5 rounded-none overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percent}%` }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            className="bg-amber-600 dark:bg-amber-400 h-full"
                          />
                        </div>
                        <p className="text-[10px] text-muted-foreground text-right">
                          {path.completed_steps} of {path.total_steps} milestones
                        </p>
                      </div>

                      <button
                        onClick={() => toggleAccordion(path.id)}
                        className="p-2 border border-border rounded-sm hover:bg-secondary text-foreground transition cursor-pointer"
                        title={isExpanded ? 'Collapse' : 'Expand milestones'}
                      >
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </motion.div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Steps Section */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="border-t border-border bg-secondary/30 p-6 sm:p-8 space-y-4"
                    >
                      <div className="flex items-center justify-between border-b border-border pb-3">
                        <span className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                          Milestones ({path.steps.length})
                        </span>
                        {user && user.username === path.owner && (
                          <button
                            onClick={() => {
                              setSelectedPathForStep(path);
                              setStepForm((prev) => ({
                                ...prev,
                                order: path.steps.length + 1,
                              }));
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-xs font-mono uppercase tracking-wider text-foreground bg-card border border-border hover:bg-secondary transition cursor-pointer font-medium"
                          >
                            <Plus className="w-3 h-3" />
                            Add Step
                          </button>
                        )}
                      </div>

                      {path.steps.length === 0 ? (
                        <div className="text-center py-8 text-xs font-mono text-muted-foreground border border-dashed border-border bg-card rounded-sm">
                          No milestone steps attached to this path yet.
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          {path.steps.map((step) => (
                            <div
                              key={step.id}
                              className={`flex items-start gap-3.5 p-4 rounded-sm border transition-colors ${
                                step.is_completed
                                  ? 'bg-card border-border/60 text-muted-foreground'
                                  : 'bg-card border-border'
                              }`}
                            >
                              <button
                                onClick={() => handleStepCheck(step.id)}
                                className="mt-0.5 text-foreground hover:opacity-75 transition cursor-pointer flex-shrink-0"
                                title={step.is_completed ? 'Mark pending' : 'Mark completed'}
                              >
                                {step.is_completed ? (
                                  <CheckSquare className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                ) : (
                                  <Square className="w-4 h-4 text-muted-foreground" />
                                )}
                              </button>

                              <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest font-semibold">
                                    [STEP {step.order < 10 ? `0${step.order}` : step.order}]
                                  </span>
                                  <h4
                                    className={`text-sm font-serif font-bold ${
                                      step.is_completed ? 'line-through text-muted-foreground' : 'text-foreground'
                                    }`}
                                  >
                                    {step.title}
                                  </h4>
                                </div>
                                {step.description && (
                                  <p className="text-xs text-muted-foreground leading-relaxed">
                                    {step.description}
                                  </p>
                                )}
                              </div>

                              {step.resource_url && (
                                <a
                                  href={step.resource_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-[11px] font-mono text-muted-foreground hover:text-foreground underline flex-shrink-0"
                                >
                                  <span>Docs</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}

      {/* New Path Modal */}
      <AnimatePresence>
        {isPathModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPathModalOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 8 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-lg bg-card border border-border p-7 sm:p-8 space-y-6 z-10 shadow-2xl rounded-sm"
            >
              <div className="flex items-baseline justify-between border-b border-border pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block">
                    [Form / Curriculum]
                  </span>
                  <h2 className="font-serif text-xl font-bold text-foreground">
                    New Learning Curriculum
                  </h2>
                </div>
                <button
                  onClick={() => setIsPathModalOpen(false)}
                  className="text-muted-foreground hover:text-foreground p-1 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {pathError && (
                <div className="p-3 rounded-sm bg-destructive/10 border border-destructive/20 text-destructive text-xs font-mono flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{pathError}</span>
                </div>
              )}

              <form onSubmit={handleCreatePathSubmit} className="space-y-4 text-xs font-mono">
                <div>
                  <label className="block uppercase tracking-wider text-muted-foreground mb-1.5">
                    Curriculum Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Distributed Consensus & Raft Architecture"
                    value={pathForm.title}
                    onChange={(e) => setPathForm({ ...pathForm, title: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border text-foreground font-sans text-xs focus:outline-none focus:border-foreground rounded-sm"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-muted-foreground mb-1.5">
                    Category
                  </label>
                  <select
                    value={pathForm.category}
                    onChange={(e) => setPathForm({ ...pathForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border text-foreground font-sans text-xs focus:outline-none focus:border-foreground rounded-sm"
                  >
                    <option value="Full-Stack">Full-Stack</option>
                    <option value="Machine Learning">Machine Learning</option>
                    <option value="DevOps & Cloud">DevOps & Cloud</option>
                    <option value="System Design">System Design</option>
                  </select>
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-muted-foreground mb-1.5">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Overview, prerequisites, and learning objectives..."
                    value={pathForm.description}
                    onChange={(e) => setPathForm({ ...pathForm, description: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border text-foreground font-sans text-xs focus:outline-none focus:border-foreground rounded-sm resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setIsPathModalOpen(false)}
                    className="px-4 py-2 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createPathMutation.isPending}
                    className="inline-flex items-center gap-2 px-5 py-2 bg-foreground text-background font-mono text-xs uppercase tracking-wider font-semibold hover:opacity-90 disabled:opacity-50 transition cursor-pointer rounded-sm"
                  >
                    {createPathMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    Create Curriculum
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Step Modal */}
      <AnimatePresence>
        {selectedPathForStep && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPathForStep(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 8 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-lg bg-card border border-border p-7 sm:p-8 space-y-6 z-10 shadow-2xl rounded-sm"
            >
              <div className="flex items-baseline justify-between border-b border-border pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block">
                    [Curriculum / Milestone]
                  </span>
                  <h2 className="font-serif text-xl font-bold text-foreground">
                    Add Milestone Step
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedPathForStep(null)}
                  className="text-muted-foreground hover:text-foreground p-1 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {stepError && (
                <div className="p-3 rounded-sm bg-destructive/10 border border-destructive/20 text-destructive text-xs font-mono flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{stepError}</span>
                </div>
              )}

              <form onSubmit={handleCreateStepSubmit} className="space-y-4 text-xs font-mono">
                <div className="grid grid-cols-4 gap-3">
                  <div className="col-span-3">
                    <label className="block uppercase tracking-wider text-muted-foreground mb-1.5">
                      Milestone Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Implement Log Replication & Election Timers"
                      value={stepForm.title}
                      onChange={(e) => setStepForm({ ...stepForm, title: e.target.value })}
                      className="w-full px-3 py-2 bg-background border border-border text-foreground font-sans text-xs focus:outline-none focus:border-foreground rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="block uppercase tracking-wider text-muted-foreground mb-1.5">
                      Order
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={stepForm.order}
                      onChange={(e) => setStepForm({ ...stepForm, order: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-background border border-border text-foreground font-sans text-xs focus:outline-none focus:border-foreground rounded-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-muted-foreground mb-1.5">
                    Step Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Specific engineering criteria for this milestone..."
                    value={stepForm.description}
                    onChange={(e) => setStepForm({ ...stepForm, description: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border text-foreground font-sans text-xs focus:outline-none focus:border-foreground rounded-sm resize-none"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-muted-foreground mb-1.5">
                    Reference / Documentation URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://raft.github.io/raft.pdf"
                    value={stepForm.resource_url}
                    onChange={(e) => setStepForm({ ...stepForm, resource_url: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border text-foreground font-sans text-xs focus:outline-none focus:border-foreground rounded-sm"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setSelectedPathForStep(null)}
                    className="px-4 py-2 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createStepMutation.isPending}
                    className="inline-flex items-center gap-2 px-5 py-2 bg-foreground text-background font-mono text-xs uppercase tracking-wider font-semibold hover:opacity-90 disabled:opacity-50 transition cursor-pointer rounded-sm"
                  >
                    {createStepMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    Save Milestone
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PathsPage;
