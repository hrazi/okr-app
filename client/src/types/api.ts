export interface Summary {
  id: number;
  title: string;
  description?: string;
  created_at: string;
  updated_at: string;
  version: number;
  status: 'draft' | 'published' | 'archived';
}

export interface WorkItem {
  id: number;
  summary_id: number;
  title: string;
  work_item_type?: string;
  state?: string;
  assigned_to?: string;
  area_path?: string;
  iteration_path?: string;
  description?: string;
  created_date?: string;
  changed_date?: string;
  tags?: string;
  priority?: number;
  effort?: number;
  business_value?: number;
}

export interface ApiResponse<T> {
  data: T;
  total?: number;
}