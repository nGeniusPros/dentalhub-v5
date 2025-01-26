import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { insuranceService } from '../services/insurance';
import type { InsurancePlan, InsuranceCoverage } from '../types/insurance';
import { toast } from '../components/ui/toast';

export const useInsurance = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<string>();
  const [page, setPage] = useState(1);
  const limit = 10;

  const {
    data: plansData,
    isLoading: isLoadingPlans,
    error: plansError
  } = useQuery(
    ['insurance-plans', searchQuery, selectedProvider, page],
    () => insuranceService.getPlans({
      search: searchQuery,
      provider: selectedProvider,
      page,
      limit
    }),
    {
      keepPreviousData: true
    }
  );

  const {
    data: providers,
    isLoading: isLoadingProviders
  } = useQuery(
    ['insurance-providers'],
    () => insuranceService.getProviders()
  );

  const createPlanMutation = useMutation(
    (plan: Partial<InsurancePlan>) => insuranceService.createPlan(plan),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['insurance-plans']);
        toast.success('Insurance plan created successfully');
      },
      onError: (error: Error) => {
        toast.error('Failed to create insurance plan: ' + error.message);
      }
    }
  );

  const updatePlanMutation = useMutation(
    ({ id, updates }: { id: string; updates: Partial<InsurancePlan> }) =>
      insuranceService.updatePlan(id, updates),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['insurance-plans']);
        toast.success('Insurance plan updated successfully');
      },
      onError: (error: Error) => {
        toast.error('Failed to update insurance plan: ' + error.message);
      }
    }
  );

  const deletePlanMutation = useMutation(
    (id: string) => insuranceService.deletePlan(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['insurance-plans']);
        toast.success('Insurance plan deleted successfully');
      },
      onError: (error: Error) => {
        toast.error('Failed to delete insurance plan: ' + error.message);
      }
    }
  );

  const updateCoverageMutation = useMutation(
    ({ planId, coverage }: { planId: string; coverage: Partial<InsuranceCoverage>[] }) =>
      insuranceService.updateCoverage(planId, coverage),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['insurance-plans']);
        toast.success('Coverage updated successfully');
      },
      onError: (error: Error) => {
        toast.error('Failed to update coverage: ' + error.message);
      }
    }
  );

  const verifyEligibilityMutation = useMutation(
    ({ planId, patientId }: { planId: string; patientId: string }) =>
      insuranceService.verifyEligibility(planId, patientId),
    {
      onSuccess: (data) => {
        if (data.eligible) {
          toast.success('Patient is eligible for coverage');
        } else {
          toast.error('Patient is not eligible: ' + data.message);
        }
      },
      onError: (error: Error) => {
        toast.error('Failed to verify eligibility: ' + error.message);
      }
    }
  );

  const submitClaimMutation = useMutation(
    (claim: Parameters<typeof insuranceService.submitClaim>[0]) =>
      insuranceService.submitClaim(claim),
    {
      onSuccess: (data) => {
        toast.success(`Claim submitted successfully. Claim ID: ${data.claimId}`);
      },
      onError: (error: Error) => {
        toast.error('Failed to submit claim: ' + error.message);
      }
    }
  );

  return {
    plans: plansData?.plans || [],
    totalPlans: plansData?.total || 0,
    providers: providers || [],
    isLoading: isLoadingPlans || isLoadingProviders,
    error: plansError,
    searchQuery,
    setSearchQuery,
    selectedProvider,
    setSelectedProvider,
    page,
    setPage,
    limit,
    actions: {
      createPlan: createPlanMutation.mutate,
      updatePlan: updatePlanMutation.mutate,
      deletePlan: deletePlanMutation.mutate,
      updateCoverage: updateCoverageMutation.mutate,
      verifyEligibility: verifyEligibilityMutation.mutate,
      submitClaim: submitClaimMutation.mutate
    },
    mutations: {
      isCreating: createPlanMutation.isLoading,
      isUpdating: updatePlanMutation.isLoading,
      isDeleting: deletePlanMutation.isLoading,
      isUpdatingCoverage: updateCoverageMutation.isLoading,
      isVerifyingEligibility: verifyEligibilityMutation.isLoading,
      isSubmittingClaim: submitClaimMutation.isLoading
    }
  };
};
