import { api } from '../lib/api';

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'document' | 'form' | 'video' | 'link';
  url?: string;
  fileUrl?: string;
  metadata: {
    version: string;
    status: 'draft' | 'published' | 'archived';
    approvalRequired: boolean;
    workflow: string[];
    permissions: string[];
    tags: string[];
    expirationDate?: string;
    reviewDate?: string;
    department?: string;
    language: string;
  };
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastModifiedBy: string;
}

export interface ResourceStats {
  totalResources: number;
  downloadsToday: number;
  activeUsers: number;
  requiredForms: number;
  recentActivity: {
    type: 'download' | 'upload' | 'view' | 'edit';
    resourceId: string;
    userId: string;
    timestamp: string;
  }[];
}

class ResourceService {
  async getResources(params?: {
    category?: string;
    type?: string;
    search?: string;
    filters?: string[];
    page?: number;
    limit?: number;
  }): Promise<{ resources: Resource[]; total: number }> {
    const { data } = await api.get('/resources', { params });
    return data;
  }

  async getResourceById(id: string): Promise<Resource> {
    const { data } = await api.get(`/resources/${id}`);
    return data;
  }

  async createResource(resource: Partial<Resource>): Promise<Resource> {
    const { data } = await api.post('/resources', resource);
    return data;
  }

  async updateResource(id: string, updates: Partial<Resource>): Promise<Resource> {
    const { data } = await api.patch(`/resources/${id}`, updates);
    return data;
  }

  async deleteResource(id: string): Promise<void> {
    await api.delete(`/resources/${id}`);
  }

  async uploadFile(file: File, metadata: Partial<Resource>): Promise<Resource> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('metadata', JSON.stringify(metadata));
    
    const { data } = await api.post('/resources/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  }

  async getResourceStats(): Promise<ResourceStats> {
    const { data } = await api.get('/resources/stats');
    return data;
  }

  async downloadResource(id: string): Promise<Blob> {
    const { data } = await api.get(`/resources/${id}/download`, {
      responseType: 'blob',
    });
    return data;
  }

  async getCategories(): Promise<{ id: string; name: string; count: number }[]> {
    const { data } = await api.get('/resources/categories');
    return data;
  }

  async getResourceTypes(): Promise<{ id: string; name: string; count: number }[]> {
    const { data } = await api.get('/resources/types');
    return data;
  }

  async assignResource(resourceId: string, userId: string): Promise<void> {
    await api.post(`/resources/${resourceId}/assign`, { userId });
  }

  async archiveResource(id: string): Promise<void> {
    await api.post(`/resources/${id}/archive`);
  }

  async restoreResource(id: string): Promise<void> {
    await api.post(`/resources/${id}/restore`);
  }

  async getResourceVersions(id: string): Promise<{
    version: string;
    createdAt: string;
    createdBy: string;
    changes: string[];
  }[]> {
    const { data } = await api.get(`/resources/${id}/versions`);
    return data;
  }
}

export const resourceService = new ResourceService();
