import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProjects, createProject } from '../services/projectService';
import type { CreateProjectPayload, Project } from '../types/project';
import {
  FolderGit2,
  ExternalLink,
  Code2,
  Plus,
  Loader2,
  AlertCircle,
  Clock,
  User,
  X,
} from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const queryClient = useQueryClient();
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
        'Failed to create project. Please verify if you are logged in.';
      setFormError(msg);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormError('Title is required.');
      return;
    }
    createMutation.mutate(formData);
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <FolderGit2 className="w-8 h-8 text-indigo-400" />
            Projects Showcase
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Browse full-stack and machine learning applications or add your own project.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium shadow-md shadow-indigo-600/30 transition-all active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      {/* Projects Grid or States */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          <p className="text-sm">Fetching projects from backend API...</p>
        </div>
      ) : isError ? (
        <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-center gap-3">
          <AlertCircle className="w-6 h-6 flex-shrink-0 text-rose-400" />
          <div>
            <p className="font-semibold text-sm">Failed to connect to backend</p>
            <p className="text-xs text-rose-400/80 mt-0.5">
              {(error as Error)?.message || 'Make sure the Django dev server is running on http://127.0.0.1:8000.'}
            </p>
          </div>
        </div>
      ) : data?.results.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-slate-800 bg-slate-900/30">
          <FolderGit2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-300">No projects yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Get started by adding your first showcase project using the button above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.results.map((project: Project) => (
            <div
              key={project.id}
              className="flex flex-col justify-between p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded-md text-slate-300">
                    <User className="w-3 h-3 text-indigo-400" />
                    {project.owner}
                  </span>
                  <span className="inline-flex items-center gap-1 text-slate-500 text-[11px]">
                    <Clock className="w-3 h-3" />
                    {new Date(project.created_at).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors">
                  {project.title}
                </h3>

                <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed">
                  {project.description || 'No description provided.'}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-6 mt-4 border-t border-slate-800/60">
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 px-3 py-1.5 rounded-lg border border-slate-700/50 transition"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    Code
                  </a>
                )}
                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-300 hover:text-indigo-200 bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-lg border border-indigo-500/20 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Create New Project</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Project Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. End-to-End LLM Chatbot"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="What does this project do and what technologies did you use?"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  GitHub URL
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/username/repository"
                  value={formData.github_url}
                  onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Live URL (optional)
                </label>
                <input
                  type="url"
                  placeholder="https://myproject.com"
                  value={formData.live_url}
                  onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium shadow-md shadow-indigo-600/30 transition"
                >
                  {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
