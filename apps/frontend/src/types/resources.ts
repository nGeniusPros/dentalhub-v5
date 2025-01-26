export type ResourceType = 'document' | 'form' | 'video' | 'link';
export type ResourceStatus = 'draft' | 'published' | 'archived';
export type ResourceCategory =
  | 'clinical'
  | 'administrative'
  | 'hr'
  | 'compliance'
  | 'patient-education'
  | 'provider'
  | 'financial';

export interface ResourceMetadata {
  version: string;
  status: ResourceStatus;
  approvalRequired: boolean;
  workflow: string[];
  permissions: string[];
  tags: string[];
  expirationDate?: string;
  reviewDate?: string;
  department?: string;
  language: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  type: ResourceType;
  url?: string;
  fileUrl?: string;
  metadata: ResourceMetadata;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastModifiedBy: string;
}

export interface ResourceActivity {
  type: 'download' | 'upload' | 'view' | 'edit';
  resourceId: string;
  userId: string;
  timestamp: string;
}

export interface ResourceStats {
  totalResources: number;
  downloadsToday: number;
  activeUsers: number;
  requiredForms: number;
  recentActivity: ResourceActivity[];
}

export interface ResourceCategory {
  id: string;
  name: string;
  count: number;
  icon?: string;
}

export interface ResourceFilter {
  id: string;
  label: string;
  icon: string;
}

export interface ResourceTypeInfo {
  id: string;
  name: string;
  count: number;
  icon: string;
}

export interface ResourceVersion {
  version: string;
  createdAt: string;
  createdBy: string;
  changes: string[];
}

export interface ResourcePermission {
  role: string;
  actions: Array<'view' | 'edit' | 'delete' | 'download' | 'assign'>;
}

export interface ResourceWorkflowStep {
  id: string;
  name: string;
  type: 'approval' | 'review' | 'notification';
  assignedTo: string[];
  status: 'pending' | 'completed' | 'rejected';
  dueDate?: string;
  completedAt?: string;
  completedBy?: string;
  comments?: string[];
}

export interface ResourceAssignment {
  resourceId: string;
  userId: string;
  assignedAt: string;
  assignedBy: string;
  dueDate?: string;
  status: 'pending' | 'completed' | 'overdue';
  completedAt?: string;
}

export interface ResourceSearchParams {
  category?: string;
  type?: string;
  search?: string;
  filters?: string[];
  page?: number;
  limit?: number;
  sortBy?: 'title' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  status?: ResourceStatus[];
  department?: string;
  language?: string;
  tags?: string[];
}
