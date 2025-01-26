import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { resourceService, type Resource } from '../services/resources';
import { toast } from '../components/ui/toast';

export const useResources = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const limit = 12;

  const {
    data: resourcesData,
    isLoading: isLoadingResources,
    error: resourcesError
  } = useQuery(
    ['resources', searchQuery, selectedCategory, selectedFilters, page],
    () => resourceService.getResources({
      search: searchQuery,
      category: selectedCategory === 'all' ? undefined : selectedCategory,
      filters: selectedFilters,
      page,
      limit
    }),
    {
      keepPreviousData: true
    }
  );

  const {
    data: stats,
    isLoading: isLoadingStats,
    error: statsError
  } = useQuery(
    ['resourceStats'],
    () => resourceService.getResourceStats(),
    {
      refetchInterval: 5 * 60 * 1000 // Refetch every 5 minutes
    }
  );

  const {
    data: categories,
    isLoading: isLoadingCategories
  } = useQuery(
    ['resourceCategories'],
    () => resourceService.getCategories()
  );

  const createResourceMutation = useMutation(
    (resource: Partial<Resource>) => resourceService.createResource(resource),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['resources']);
        queryClient.invalidateQueries(['resourceStats']);
        toast.success('Resource created successfully');
      },
      onError: (error: Error) => {
        toast.error('Failed to create resource: ' + error.message);
      }
    }
  );

  const uploadResourceMutation = useMutation(
    ({ file, metadata }: { file: File; metadata: Partial<Resource> }) =>
      resourceService.uploadFile(file, metadata),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['resources']);
        queryClient.invalidateQueries(['resourceStats']);
        toast.success('Resource uploaded successfully');
      },
      onError: (error: Error) => {
        toast.error('Failed to upload resource: ' + error.message);
      }
    }
  );

  const deleteResourceMutation = useMutation(
    (id: string) => resourceService.deleteResource(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['resources']);
        queryClient.invalidateQueries(['resourceStats']);
        toast.success('Resource deleted successfully');
      },
      onError: (error: Error) => {
        toast.error('Failed to delete resource: ' + error.message);
      }
    }
  );

  const downloadResource = useCallback(async (id: string, filename: string) => {
    try {
      const blob = await resourceService.downloadResource(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Download started');
    } catch (error) {
      toast.error('Failed to download resource');
    }
  }, []);

  const archiveResourceMutation = useMutation(
    (id: string) => resourceService.archiveResource(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['resources']);
        toast.success('Resource archived successfully');
      },
      onError: (error: Error) => {
        toast.error('Failed to archive resource: ' + error.message);
      }
    }
  );

  const assignResourceMutation = useMutation(
    ({ resourceId, userId }: { resourceId: string; userId: string }) =>
      resourceService.assignResource(resourceId, userId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['resources']);
        toast.success('Resource assigned successfully');
      },
      onError: (error: Error) => {
        toast.error('Failed to assign resource: ' + error.message);
      }
    }
  );

  return {
    resources: resourcesData?.resources || [],
    totalResources: resourcesData?.total || 0,
    stats,
    categories,
    isLoading: isLoadingResources || isLoadingStats || isLoadingCategories,
    error: resourcesError || statsError,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedFilters,
    setSelectedFilters,
    page,
    setPage,
    limit,
    actions: {
      createResource: createResourceMutation.mutate,
      uploadResource: uploadResourceMutation.mutate,
      deleteResource: deleteResourceMutation.mutate,
      downloadResource,
      archiveResource: archiveResourceMutation.mutate,
      assignResource: assignResourceMutation.mutate
    },
    mutations: {
      isCreating: createResourceMutation.isLoading,
      isUploading: uploadResourceMutation.isLoading,
      isDeleting: deleteResourceMutation.isLoading,
      isArchiving: archiveResourceMutation.isLoading,
      isAssigning: assignResourceMutation.isLoading
    }
  };
};
