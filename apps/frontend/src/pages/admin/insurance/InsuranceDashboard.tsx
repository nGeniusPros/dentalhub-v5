import { useState } from 'react';
import { Plus, Search, Filter, Download, Upload } from 'lucide-react';
import { useInsurance } from '../../../hooks/useInsurance';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card } from '../../../components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/tabs';
import { AddPlanModal } from './components/AddPlanModal';
import { PlanList } from './components/PlanList';
import { PlanDetails } from './components/PlanDetails';
import { ProvidersTable } from './components/ProvidersTable';
import { ClaimsTable } from './components/ClaimsTable';
import { StatsCards } from './components/StatsCards';

export const InsuranceDashboard = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string>();
  const {
    plans,
    totalPlans,
    providers,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedProvider,
    setSelectedProvider,
    page,
    setPage,
    actions
  } = useInsurance();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Insurance Management</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Plan
        </Button>
      </div>

      <StatsCards />

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search plans..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
        <Button variant="outline">
          <Upload className="w-4 h-4 mr-2" />
          Import
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-12 lg:col-span-8">
          <Tabs defaultValue="plans">
            <TabsList>
              <TabsTrigger value="plans">Plans</TabsTrigger>
              <TabsTrigger value="providers">Providers</TabsTrigger>
              <TabsTrigger value="claims">Claims</TabsTrigger>
            </TabsList>

            <TabsContent value="plans">
              <PlanList
                plans={plans}
                totalPlans={totalPlans}
                isLoading={isLoading}
                page={page}
                onPageChange={setPage}
                onPlanSelect={setSelectedPlanId}
                selectedPlanId={selectedPlanId}
              />
            </TabsContent>

            <TabsContent value="providers">
              <ProvidersTable
                providers={providers}
                isLoading={isLoading}
              />
            </TabsContent>

            <TabsContent value="claims">
              <ClaimsTable />
            </TabsContent>
          </Tabs>
        </Card>

        <Card className="col-span-12 lg:col-span-4">
          {selectedPlanId ? (
            <PlanDetails
              planId={selectedPlanId}
              onClose={() => setSelectedPlanId(undefined)}
            />
          ) : (
            <div className="p-6 text-center text-gray-500">
              Select a plan to view details
            </div>
          )}
        </Card>
      </div>

      <AddPlanModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={actions.createPlan}
        providers={providers}
      />
    </div>
  );
};
