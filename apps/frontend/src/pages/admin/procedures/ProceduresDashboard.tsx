import { useState } from 'react';
import { Plus, Search, Filter, Download, Upload, Edit } from 'lucide-react';
import { useProcedureCodes } from '../../../hooks/useProcedureCodes';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card } from '../../../components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/tabs';
import { DataTable } from '../../../components/ui/data-table';
import { AddProcedureModal } from './components/AddProcedureModal';
import { EditProcedureModal } from './components/EditProcedureModal';
import { ImportCodesModal } from './components/ImportCodesModal';
import { FeeScheduleEditor } from './components/FeeScheduleEditor';
import type { ProcedureCode } from '../../../types/procedures';

export const ProceduresDashboard = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState<ProcedureCode>();
  const {
    codes,
    totalCodes,
    categories,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    page,
    setPage,
    actions
  } = useProcedureCodes();

  const columns = [
    {
      accessorKey: 'code',
      header: 'Code',
    },
    {
      accessorKey: 'description',
      header: 'Description',
    },
    {
      accessorKey: 'category.name',
      header: 'Category',
    },
    {
      accessorKey: 'type',
      header: 'Type',
    },
    {
      accessorKey: 'defaultFee',
      header: 'Default Fee',
      cell: ({ row }) => (
        <span>${row.original.defaultFee.toFixed(2)}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <span className={`capitalize ${
          row.original.status === 'active' ? 'text-green-600' : 'text-red-600'
        }`}>
          {row.original.status}
        </span>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedCode(row.original)}
        >
          <Edit className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Procedure Codes</h1>
        <div className="space-x-2">
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Code
          </Button>
          <Button variant="outline" onClick={() => setIsImportModalOpen(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button
            variant="outline"
            onClick={() => actions.exportCodes('csv')}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <Tabs defaultValue="codes">
          <TabsList>
            <TabsTrigger value="codes">Procedure Codes</TabsTrigger>
            <TabsTrigger value="fees">Fee Schedule</TabsTrigger>
          </TabsList>

          <TabsContent value="codes" className="space-y-4">
            <div className="flex gap-4 p-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search codes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border rounded-md px-3 py-2"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>

            <DataTable
              columns={columns}
              data={codes}
              pageCount={Math.ceil(totalCodes / 20)}
              pageIndex={page - 1}
              pageSize={20}
              onPageChange={(newPage) => setPage(newPage + 1)}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="fees">
            <FeeScheduleEditor />
          </TabsContent>
        </Tabs>
      </Card>

      <AddProcedureModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={actions.createCode}
        categories={categories}
      />

      {selectedCode && (
        <EditProcedureModal
          isOpen={true}
          onClose={() => setSelectedCode(undefined)}
          code={selectedCode}
          onSubmit={(updates) =>
            actions.updateCode({ id: selectedCode.id, updates })
          }
          categories={categories}
        />
      )}

      <ImportCodesModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSubmit={actions.importCodes}
      />
    </div>
  );
};
