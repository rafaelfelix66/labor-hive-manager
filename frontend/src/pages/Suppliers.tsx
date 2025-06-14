
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Factory, Plus, Edit, Eye, Loader2, ArrowUpDown } from "lucide-react";
import { Link } from "react-router-dom";
import { apiService } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import AddSupplierModal from "@/components/AddSupplierModal";
import ViewSupplierModal from "@/components/ViewSupplierModal";
import EditSupplierModal from "@/components/EditSupplierModal";
import TableFilters from "@/components/TableFilters";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter and sort states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [entityFilter, setEntityFilter] = useState('all');
  const [assignedToFilter, setAssignedToFilter] = useState('all');
  const [sortBy, setSortBy] = useState('companyName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getSuppliers();
      
      if (response.success && response.data) {
        setSuppliers(response.data);
      } else {
        setError('Falha ao buscar fornecedores');
      }
    } catch (error: any) {
      console.error('Erro ao buscar fornecedores:', error);
      setError(error.message || 'Falha ao buscar fornecedores');
      toast({
        title: "Erro",
        description: "Falha ao carregar fornecedores. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewSupplier = (supplierId: string) => {
    setSelectedSupplierId(supplierId);
    setViewModalOpen(true);
  };

  const handleEditSupplier = (supplierId: string) => {
    setSelectedSupplierId(supplierId);
    setEditModalOpen(true);
  };

  const handleModalSuccess = () => {
    fetchSuppliers(); // Refresh the suppliers list
  };

  // Filter and sort logic
  const filteredAndSortedSuppliers = useMemo(() => {
    let filtered = suppliers.filter(supplier => {
      // Search filter
      const searchMatch = !searchTerm || 
        supplier.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.street.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (supplier.assignedTo && supplier.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()));

      // Status filter
      const statusMatch = statusFilter === 'all' || 
        (statusFilter === 'active' && supplier.active) ||
        (statusFilter === 'inactive' && !supplier.active);

      // Entity filter
      const entityMatch = entityFilter === 'all' || supplier.entity === entityFilter;

      // Assigned to filter
      const assignedMatch = assignedToFilter === 'all' || 
        (assignedToFilter === 'unassigned' && !supplier.assignedTo) ||
        supplier.assignedTo === assignedToFilter;

      return searchMatch && statusMatch && entityMatch && assignedMatch;
    });

    // Sort logic
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'companyName':
          aValue = a.companyName.toLowerCase();
          bValue = b.companyName.toLowerCase();
          break;
        case 'entity':
          aValue = a.entity;
          bValue = b.entity;
          break;
        case 'city':
          aValue = a.city.toLowerCase();
          bValue = b.city.toLowerCase();
          break;
        case 'wcClass':
          aValue = a.wcClass || '';
          bValue = b.wcClass || '';
          break;
        case 'markup':
          aValue = a.markupValue || 0;
          bValue = b.markupValue || 0;
          break;
        case 'commission':
          aValue = a.commission || 0;
          bValue = b.commission || 0;
          break;
        case 'assignedTo':
          aValue = a.assignedTo || '';
          bValue = b.assignedTo || '';
          break;
        case 'status':
          aValue = a.active ? 1 : 0;
          bValue = b.active ? 1 : 0;
          break;
        default:
          aValue = a.companyName.toLowerCase();
          bValue = b.companyName.toLowerCase();
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
    });

    return filtered;
  }, [suppliers, searchTerm, statusFilter, entityFilter, assignedToFilter, sortBy, sortOrder]);

  // Get unique values for filters
  const uniqueEntities = useMemo(() => {
    const entities = [...new Set(suppliers.map(supplier => supplier.entity))];
    return entities.map(entity => ({ value: entity, label: entity }));
  }, [suppliers]);

  const uniqueAssignedTo = useMemo(() => {
    const assigned = [...new Set(suppliers.map(supplier => supplier.assignedTo).filter(Boolean))];
    return assigned.map(person => ({ value: person, label: person }));
  }, [suppliers]);

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchTerm) count++;
    if (statusFilter !== 'all') count++;
    if (entityFilter !== 'all') count++;
    if (assignedToFilter !== 'all') count++;
    return count;
  }, [searchTerm, statusFilter, entityFilter, assignedToFilter]);

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setEntityFilter('all');
    setAssignedToFilter('all');
  };

  const sortOptions = [
    { value: 'companyName', label: 'Nome da Empresa' },
    { value: 'entity', label: 'Tipo de Entidade' },
    { value: 'city', label: 'Cidade' },
    { value: 'wcClass', label: 'Classe WC' },
    { value: 'markup', label: 'Markup' },
    { value: 'commission', label: 'Comissão' },
    { value: 'assignedTo', label: 'Designado Para' },
    { value: 'status', label: 'Status' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/dashboard" className="flex items-center">
              <img src="/eom staffing.png" alt="EOM Staffing" className="h-17 w-auto" />
            </Link>
            <Link to="/dashboard" className="text-blue-600 hover:text-blue-800 text-sm">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Suppliers</h1>
            <p className="text-gray-600">Manage contractor companies and suppliers</p>
          </div>
          <Button onClick={() => setAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Supplier
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Factory className="h-5 w-5 mr-2" />
              All Suppliers ({filteredAndSortedSuppliers.length})
            </CardTitle>
            <CardDescription>
              Manage contractor companies and their details
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <TableFilters
              searchValue={searchTerm}
              onSearchChange={setSearchTerm}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={(newSortBy, newOrder) => {
                setSortBy(newSortBy);
                setSortOrder(newOrder);
              }}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              additionalFilters={[
                {
                  value: entityFilter,
                  onChange: setEntityFilter,
                  options: uniqueEntities,
                  placeholder: "Todas as entidades",
                  label: "Tipo de Entidade"
                },
                {
                  value: assignedToFilter,
                  onChange: setAssignedToFilter,
                  options: [
                    { value: 'unassigned', label: 'Não designado' },
                    ...uniqueAssignedTo
                  ],
                  placeholder: "Todos os managers",
                  label: "Designado Para"
                }
              ]}
              sortOptions={sortOptions}
              placeholder="Pesquisar fornecedores..."
              activeFiltersCount={activeFiltersCount}
              onClearFilters={clearFilters}
            />

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Carregando fornecedores...</span>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50 select-none"
                      onClick={() => {
                        if (sortBy === 'companyName') {
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        } else {
                          setSortBy('companyName');
                          setSortOrder('asc');
                        }
                      }}
                    >
                      <div className="flex items-center">
                        Company
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50 select-none"
                      onClick={() => {
                        if (sortBy === 'entity') {
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        } else {
                          setSortBy('entity');
                          setSortOrder('asc');
                        }
                      }}
                    >
                      <div className="flex items-center">
                        Entity
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50 select-none"
                      onClick={() => {
                        if (sortBy === 'city') {
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        } else {
                          setSortBy('city');
                          setSortOrder('asc');
                        }
                      }}
                    >
                      <div className="flex items-center">
                        Location
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50 select-none"
                      onClick={() => {
                        if (sortBy === 'wcClass') {
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        } else {
                          setSortBy('wcClass');
                          setSortOrder('asc');
                        }
                      }}
                    >
                      <div className="flex items-center">
                        WC Class
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50 select-none"
                      onClick={() => {
                        if (sortBy === 'markup') {
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        } else {
                          setSortBy('markup');
                          setSortOrder('asc');
                        }
                      }}
                    >
                      <div className="flex items-center">
                        Markup
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50 select-none"
                      onClick={() => {
                        if (sortBy === 'commission') {
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        } else {
                          setSortBy('commission');
                          setSortOrder('asc');
                        }
                      }}
                    >
                      <div className="flex items-center">
                        Commission
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50 select-none"
                      onClick={() => {
                        if (sortBy === 'status') {
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        } else {
                          setSortBy('status');
                          setSortOrder('asc');
                        }
                      }}
                    >
                      <div className="flex items-center">
                        Status
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50 select-none"
                      onClick={() => {
                        if (sortBy === 'assignedTo') {
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        } else {
                          setSortBy('assignedTo');
                          setSortOrder('asc');
                        }
                      }}
                    >
                      <div className="flex items-center">
                        Assigned To
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedSuppliers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <Factory className="h-8 w-8 text-gray-400" />
                          <p className="text-gray-500">
                            {searchTerm || statusFilter !== 'all' || entityFilter !== 'all' || assignedToFilter !== 'all'
                              ? 'Nenhum fornecedor encontrado com os filtros aplicados'
                              : 'Nenhum fornecedor encontrado'}
                          </p>
                          {(searchTerm || statusFilter !== 'all' || entityFilter !== 'all' || assignedToFilter !== 'all') && (
                            <Button variant="outline" size="sm" onClick={clearFilters}>
                              Limpar filtros
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAndSortedSuppliers.map((supplier) => (
                      <TableRow key={supplier.id}>
                        <TableCell className="font-medium">{supplier.companyName}</TableCell>
                        <TableCell>{supplier.entity}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{supplier.street}</div>
                            <div className="text-gray-500">
                              {supplier.city}, {supplier.state} {supplier.zipCode}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{supplier.wcClass || '-'}</TableCell>
                        <TableCell>
                          {supplier.markupType && supplier.markupValue ? (
                            supplier.markupType === "Percent" ? `${supplier.markupValue}%` : `$${supplier.markupValue}`
                          ) : '-'}
                        </TableCell>
                        <TableCell>{supplier.commission ? `${supplier.commission}%` : '-'}</TableCell>
                        <TableCell>
                          <Badge variant={supplier.active ? "default" : "secondary"}>
                            {supplier.active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>{supplier.assignedTo || '-'}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewSupplier(supplier.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditSupplier(supplier.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <AddSupplierModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onSuccess={handleModalSuccess}
      />
      
      <ViewSupplierModal
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
        supplierId={selectedSupplierId}
      />
      
      <EditSupplierModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        supplierId={selectedSupplierId}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default Suppliers;
