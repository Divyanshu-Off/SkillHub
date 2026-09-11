import apiClient from './apiClient';
import type { LearningPath, CreateLearningPathPayload, CreatePathStepPayload, PathStep } from '../types/path';
import type { PaginatedResponse } from '../types/project';

export const fetchPaths = async (page = 1): Promise<PaginatedResponse<LearningPath>> => {
  const response = await apiClient.get<PaginatedResponse<LearningPath>>(`/paths/?page=${page}`);
  return response.data;
};

export const fetchPathDetail = async (id: number): Promise<LearningPath> => {
  const response = await apiClient.get<LearningPath>(`/paths/${id}/`);
  return response.data;
};

export const createLearningPath = async (payload: CreateLearningPathPayload): Promise<LearningPath> => {
  const response = await apiClient.post<LearningPath>('/paths/', payload);
  return response.data;
};

export const createPathStep = async (payload: CreatePathStepPayload): Promise<PathStep> => {
  const response = await apiClient.post<PathStep>('/steps/', payload);
  return response.data;
};

export const toggleStepCompletion = async (stepId: number): Promise<{ step_id: number; completed: boolean }> => {
  const response = await apiClient.post<{ step_id: number; completed: boolean }>(
    `/steps/${stepId}/toggle_completion/`
  );
  return response.data;
};
