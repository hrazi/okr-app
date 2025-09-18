// Enhanced types for OKR mapping
import type { WorkItem } from './api';

export interface Objective {
  id: string;
  title: string;
  description: string;
  owner: string;
  quarter: string;
  keyResults: KeyResult[];
}

export interface KeyResult {
  id: string;
  objectiveId: string;
  title: string;
  description: string;
  target: string;
  current: string;
  progress: number; // 0-100
  status: 'on-track' | 'at-risk' | 'behind' | 'completed';
  workItems: WorkItem[];
  summary: string;
}

export interface OKRProgress {
  objectiveId: string;
  totalEffort: number;
  completedEffort: number;
  totalBusinessValue: number;
  activeWorkItems: number;
  completedWorkItems: number;
  overallProgress: number;
  themes: string[];
}

export interface ExecutiveSummary {
  quarter: string;
  overallProgress: number;
  totalObjectives: number;
  objectivesOnTrack: number;
  objectivesAtRisk: number;
  totalKeyResults: number;
  keyResultsCompleted: number;
  totalWorkItems: number;
  completedWorkItems: number;
  majorThemes: string[];
  executiveNotes: string[];
}

// Re-export existing types
export type { Summary, WorkItem, ApiResponse } from './api';