import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchProjects, createProject } from '../services/projectService';
import { useAuth } from '../context/AuthContext';
import type { CreateProjectPayload, Project } from '../types/project';
import {
  ExternalLink,
  Code2,
  Plus,
  Loader2,
  AlertCircle,
  Clock,
  User,
  X,
  Lock,
} from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<CreateProjectPayload>({
    title: '',
    description: '',
    github_url: '',
    live_url: '',
  });

  // Query: Fetch Projects
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['projects'],
    queryFn: () => fetchProjects(1),
  });

  // Mutation: Create Project
  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setIsModalOpen(false);
      setFormData({ title: '', description: '', github_url: '', live_url: '' });
      setFormError(null);
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.title?.[0] ||
        'Failed to create project. Please verify credentials.';
      setFormError(msg);
    },
  });

  const handleOpenCreateModal = () => {
    if (!user) {
      navigate('/signin', { state: { from: { pathname: '/projects' } } });
      return;
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormError('Title is required.');
      return;
    }
    createMutation.mutate(formData);
  };

  return (
    <div className="space-y-10 pb-12">
      {/* Top Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-border pb-6">
        <div className="space-y-2">
          <span className="text-[11px] font-mono tracking-widest uppercase text-muted-foreground block">
            [Index / Archive]
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
            Project Portfolio
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
            Curated repository of engineering systems, applications, and verified technical implementations.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-sm bg-foreground text-background font-mono text-xs uppercase tracking-wider font-semibold hover:opacity-90 transition cursor-pointer self-start sm:self-auto shadow-sm"
        >
          {user ? <Plus className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
          {user ? 'Add Project' : 'Sign In to Contribute'}
        </button>
      </div>

      {/* Projects List or States */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-foreground" />
          <p className="text-xs font-mono uppercase tracking-wider">Querying relational database...</p>
        </div>
      ) : isError ? (
        <div className="p-5 rounded-sm border border-destructive/30 bg-destructive/5 text-destructive text-xs font-mono space-y-1">
          <div className="flex items-center gap-2 font-semibold">
            <AlertCircle className="w-4 h-4" />
            <span>Connection Error</span>
          </div>
          <p className="text-muted-foreground">
            {(error as Error)?.message || 'Ensure Django backend service is operational.'}
          </p>
        </div>
      ) : data?.results.length === 0 ? (
        <div className="text-center py-20 px-4 rounded-sm border border-dashed border-border bg-card">
          <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground block mb-2">
            [Empty Index]
          </span>
          <h3 className="font-serif text-lg font-semibold text-foreground">No projects documented yet</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            Use the contribution action above to register your first engineering application.
          </p>
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.06 },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {data?.results.map((project: Project) => (
            <motion.div
              key={project.id}
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="editorial-card p-6 sm:p-7 flex flex-col justify-between space-y-6 group"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                  <span className="flex items-center gap-1.5 font-medium text-foreground">
                    <User className="w-3 h-3 text-muted-foreground" />
                    {project.owner}
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {new Date(project.created_at).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                  {project.title}
                </h3>

                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                  {project.description || 'No descriptive summary provided.'}
                </p>
              </div>

              {/* Action Links */}
              <div className="flex items-center gap-3 pt-4 border-t border-border text-xs font-mono">
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-foreground hover:underline font-medium"
                  >
                    <Code2 className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>Source</span>
                  </a>
                )}
                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-amber-700 dark:text-amber-400 hover:underline font-medium ml-auto"
                  >
                    <span>Live Demo</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Creation Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
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
                    [Form / New]
                  </span>
                  <h2 className="font-serif text-xl font-bold text-foreground">
                    Register Application
                  </h2>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-muted-foreground hover:text-foreground p-1 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {formError && (
                <div className="p-3 rounded-sm bg-destructive/10 border border-destructive/20 text-destructive text-xs font-mono flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
                <div>
                  <label className="block uppercase tracking-wider text-muted-foreground mb-1.5">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Distributed Task Orchestrator"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border text-foreground font-sans text-xs focus:outline-none focus:border-foreground rounded-sm"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-muted-foreground mb-1.5">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Engineering scope, architectural choices, and tech stack..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border text-foreground font-sans text-xs focus:outline-none focus:border-foreground rounded-sm resize-none"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-muted-foreground mb-1.5">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/org/repo"
                    value={formData.github_url}
                    onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border text-foreground font-sans text-xs focus:outline-none focus:border-foreground rounded-sm"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-muted-foreground mb-1.5">
                    Live Demo URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://deployment.domain.com"
                    value={formData.live_url}
                    onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border text-foreground font-sans text-xs focus:outline-none focus:border-foreground rounded-sm"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="inline-flex items-center gap-2 px-5 py-2 bg-foreground text-background font-mono text-xs uppercase tracking-wider font-semibold hover:opacity-90 disabled:opacity-50 transition cursor-pointer rounded-sm"
                  >
                    {createMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    Save Project
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

export default ProjectsPage;
