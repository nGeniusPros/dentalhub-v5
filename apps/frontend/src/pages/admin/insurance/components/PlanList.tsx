import { useMemo } from 'react';
import { DataTable } from '../../../../components/ui/data-table';
import { Badge } from '../../../../components/ui/badge';
import { ErrorBoundary } from '../../../../components/ui/error-boundary';
import { Skeleton } from '../../../../components/ui/skeleton';
import type { InsurancePlan } from '../../../../types/insurance';

interface PlanListProps {
  plans: InsurancePlan[];
  totalPlans: number;
  isLoading: boolean;
  page: number;
  onPageChange: (page: number) => void;
  onPlanSelect: (id: string) => void;
  selectedPlanId?: string;
}

export const PlanList = ({
  plans,
  totalPlans,
  isLoading,
  page,
  onPageChange,
  onPlanSelect,
  selectedPlanId
}: PlanListProps) => {
  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Plan Name',
        cell: ({ row }) => (
          <button
            onClick={() => onPlanSelect(row.original.id)}
            className={`text-left font-medium ${
              row.original.id === selectedPlanId ? 'text-primary' : ''
            }`}
          >
            {row.original.name}
          </button>
        ),
      },
      {
        accessorKey: 'provider.name',
        header: 'Provider',
      },
      {
        accessorKey: 'planType',
        header: 'Type',
        cell: ({ row }) => (
          <Badge variant="outline">{row.original.planType}</Badge>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const status = row.original.status;
          const variants = {
            active: 'success',
            inactive: 'destructive',
            pending: 'warning',
          } as const;

          return (
            <Badge variant={variants[status as keyof typeof variants]}>
              {status}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'deductible.individual',
        header: 'Individual Deductible',
        cell: ({ row }) => (
          <span>${row.original.deductible.individual.toFixed(2)}</span>
        ),
      },
      {
        accessorKey: 'maximumBenefit.annual',
        header: 'Annual Maximum',
        cell: ({ row }) => (
          <span>${row.original.maximumBenefit.annual.toFixed(2)}</span>
        ),
      },
    ],
    [selectedPlanId, onPlanSelect]
  );

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="rounded-md border">
        <DataTable
          columns={columns}
          data={plans}
          pageCount={Math.ceil(totalPlans / 10)}
          pageIndex={page - 1}
          pageSize={10}
          onPageChange={(newPage) => onPageChange(newPage + 1)}
          enableSorting
          enableRowSelection={false}
          manualPagination
          className="h-[calc(100vh-24rem)]"
        />
      </div>
    </ErrorBoundary>
  );
};
