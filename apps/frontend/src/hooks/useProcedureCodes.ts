import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { procedureCodeService } from '../services/procedureCode';
import type { ProcedureCode, ProcedureFee } from '../types/procedures';
import { toast } from '../components/ui/toast';

export const useProcedureCodes = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [page, setPage] = useState(1);
  const limit = 20;

  const {
    data: codesData,
    isLoading: isLoadingCodes,
    error: codesError
  } = useQuery(
    ['procedure-codes', searchQuery, selectedCategory, page],
    () => procedureCodeService.getProcedureCodes({
      search: searchQuery,
      category: selectedCategory,
      page,
      limit
    }),
    {
      keepPreviousData: true
    }
  );

  const {
    data: categories,
    isLoading: isLoadingCategories
  } = useQuery(
    ['procedure-categories'],
    () => procedureCodeService.getCategories()
  );

  const createCodeMutation = useMutation(
    (code: Partial<ProcedureCode>) => procedureCodeService.createProcedureCode(code),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['procedure-codes']);
        toast.success('Procedure code created successfully');
      },
      onError: (error: Error) => {
        toast.error('Failed to create procedure code: ' + error.message);
      }
    }
  );

  const updateCodeMutation = useMutation(
    ({ id, updates }: { id: string; updates: Partial<ProcedureCode> }) =>
      procedureCodeService.updateProcedureCode(id, updates),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['procedure-codes']);
        toast.success('Procedure code updated successfully');
      },
      onError: (error: Error) => {
        toast.error('Failed to update procedure code: ' + error.message);
      }
    }
  );

  const deleteCodeMutation = useMutation(
    (id: string) => procedureCodeService.deleteProcedureCode(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['procedure-codes']);
        toast.success('Procedure code deleted successfully');
      },
      onError: (error: Error) => {
        toast.error('Failed to delete procedure code: ' + error.message);
      }
    }
  );

  const updateFeeScheduleMutation = useMutation(
    (fees: ProcedureFee[]) => procedureCodeService.updateFeeSchedule(fees),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['procedure-codes']);
        toast.success('Fee schedule updated successfully');
      },
      onError: (error: Error) => {
        toast.error('Failed to update fee schedule: ' + error.message);
      }
    }
  );

  const importCodesMutation = useMutation(
    (file: File) => procedureCodeService.importCodes(file),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['procedure-codes']);
        toast.success(
          `Successfully imported ${data.imported} codes, updated ${data.updated} codes`
        );
        if (data.errors.length > 0) {
          toast.error(`${data.errors.length} errors occurred during import`);
        }
      },
      onError: (error: Error) => {
        toast.error('Failed to import codes: ' + error.message);
      }
    }
  );

  const validateCodeMutation = useMutation(
    (code: string) => procedureCodeService.validateCode(code),
    {
      onSuccess: (data) => {
        if (data.valid) {
          toast.success('Code is valid');
        } else {
          toast.error(`Invalid code: ${data.message}`);
        }
      }
    }
  );

  const exportCodes = async (format: 'csv' | 'excel' = 'csv') => {
    try {
      const blob = await procedureCodeService.exportCodes({ format });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `procedure-codes.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Export started');
    } catch (error) {
      toast.error('Failed to export codes');
    }
  };

  return {
    codes: codesData?.codes || [],
    totalCodes: codesData?.total || 0,
    categories: categories || [],
    isLoading: isLoadingCodes || isLoadingCategories,
    error: codesError,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    page,
    setPage,
    limit,
    actions: {
      createCode: createCodeMutation.mutate,
      updateCode: updateCodeMutation.mutate,
      deleteCode: deleteCodeMutation.mutate,
      updateFeeSchedule: updateFeeScheduleMutation.mutate,
      importCodes: importCodesMutation.mutate,
      validateCode: validateCodeMutation.mutate,
      exportCodes
    },
    mutations: {
      isCreating: createCodeMutation.isLoading,
      isUpdating: updateCodeMutation.isLoading,
      isDeleting: deleteCodeMutation.isLoading,
      isUpdatingFees: updateFeeScheduleMutation.isLoading,
      isImporting: importCodesMutation.isLoading,
      isValidating: validateCodeMutation.isLoading
    }
  };
};
