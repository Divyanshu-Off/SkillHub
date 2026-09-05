import apiClient from './apiClient';
import type { Project, PaginatedResponse, CreateProjectPayload } from '../types/project';

export const fetchProjects = async (page = 1): Promise<PaginatedResponse<Project>> => {
  const response = await apiClient.get<PaginatedResponse<Project>>(`/projects/?page=${page}`);
  return response.data;
};

export const createProject = async (payload: CreateProjectPayload): Promise<Project> => {
  const response = await apiClient.post<Project>('/projects/', payload);
  return response.data;
};

export const deleteProject = async (id: number): Promise<void> => {
  await apiClient.delete(`/projects/${id}/`);
};
