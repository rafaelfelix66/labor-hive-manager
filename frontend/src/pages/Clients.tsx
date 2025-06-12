
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Building2, Building, Plus, Edit, Eye, Loader2, ArrowUpDown } from "lucide-react";
import { Link } from "react-router-dom";
import { apiService } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import AddClientModal from "@/components/AddClientModal";
import ViewClientModal from "@/components/ViewClientModal";
import EditClientModal from "@/components/EditClientModal";
import TableFilters from "@/components/TableFilters";

const Clients = () => {
  const [clients, setClients] = useState<any[]>([]);
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
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getClients();
      
      if (response.success && response.data) {
        setClients(response.data);
      } else {
        setError('Failed to fetch clients');
      }
    } catch (error: any) {
      console.error('Error fetching clients:', error);
      setError(error.message || 'Failed to fetch clients');
      toast({
        title: "Error",
        description: "Failed to load clients. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewClient = (clientId: string) => {
    setSelectedClientId(clientId);
    setViewModalOpen(true);
  };

  const handleEditClient = (clientId: string) => {
    setSelectedClientId(clientId);
    setEditModalOpen(true);
  };

  const handleModalSuccess = () => {
    fetchClients(); // Refresh the clients list
  };

  // Filter and sort logic
  const filteredAndSortedClients = useMemo(() => {
    let filtered = clients.filter(client => {
      // Search filter
      const searchMatch = !searchTerm || 
        client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.street.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (client.assignedTo && client.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()));

      // Status filter
      const statusMatch = statusFilter === 'all' || 
        (statusFilter === 'active' && client.active) ||
        (statusFilter === 'inactive' && !client.active);

      // Entity filter
      const entityMatch = entityFilter === 'all' || client.entity === entityFilter;

      // Assigned to filter
      const assignedMatch = assignedToFilter === 'all' || 
        (assignedToFilter === 'unassigned' && !client.assignedTo) ||
        client.assignedTo === assignedToFilter;

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
  }, [clients, searchTerm, statusFilter, entityFilter, assignedToFilter, sortBy, sortOrder]);

  // Get unique values for filters
  const uniqueEntities = useMemo(() => {
    const entities = [...new Set(clients.map(client => client.entity))];
    return entities.map(entity => ({ value: entity, label: entity }));
  }, [clients]);

  const uniqueAssignedTo = useMemo(() => {
    const assigned = [...new Set(clients.map(client => client.assignedTo).filter(Boolean))];
    return assigned.map(person => ({ value: person, label: person }));
  }, [clients]);

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
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">LaborPro</span>
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
            <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
            <p className="text-gray-600">Manage client companies and relationships</p>
          </div>
          <Button onClick={() => setAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        </div>

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
              placeholder: "Todos os responsáveis",
              label: "Designado Para"
            }
          ]}
          sortOptions={sortOptions}
          placeholder="Pesquisar por nome, endereço, cidade..."
          activeFiltersCount={activeFiltersCount}
          onClearFilters={clearFilters}
        />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="h-5 w-5 mr-2" />
              All Clients
            </CardTitle>
            <CardDescription>
              Manage client companies and their contract details
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading clients...</span>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={fetchClients} variant="outline">
                  Try Again
                </Button>
              </div>
            ) : filteredAndSortedClients.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">
                  {clients.length === 0 ? "Nenhum cliente encontrado." : "Nenhum cliente corresponde aos filtros aplicados."}
                </p>
                {clients.length === 0 ? (
                  <Button onClick={() => setAddModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Primeiro Cliente
                  </Button>
                ) : (
                  <Button onClick={clearFilters} variant="outline">
                    Limpar Filtros
                  </Button>
                )}
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
                      <div className="flex items-center gap-1">
                        Empresa
                        <ArrowUpDown className="h-3 w-3" />
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
                      <div className="flex items-center gap-1">
                        Entidade
                        <ArrowUpDown className="h-3 w-3" />
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
                      <div className="flex items-center gap-1">
                        Localização
                        <ArrowUpDown className="h-3 w-3" />
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
                      <div className="flex items-center gap-1">
                        Classe WC
                        <ArrowUpDown className="h-3 w-3" />
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
                      <div className="flex items-center gap-1">
                        Markup
                        <ArrowUpDown className="h-3 w-3" />
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
                      <div className="flex items-center gap-1">
                        Comissão
                        <ArrowUpDown className="h-3 w-3" />
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
                      <div className="flex items-center gap-1">
                        Status
                        <ArrowUpDown className="h-3 w-3" />
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
                      <div className="flex items-center gap-1">
                        Designado Para
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">{client.companyName}</TableCell>
                      <TableCell>{client.entity}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{client.street}</div>
                          <div className="text-gray-500">
                            {client.city}, {client.state} {client.zipCode}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{client.wcClass || 'N/A'}</TableCell>
                      <TableCell>
                        {client.markupType && client.markupValue ? (
                          client.markupType === "Percent" ? `${client.markupValue}%` : `$${client.markupValue}`
                        ) : 'N/A'}
                      </TableCell>
                      <TableCell>{client.commission ? `${client.commission}%` : 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant={client.active ? "default" : "secondary"}>
                          {client.active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>{client.assignedTo || 'Unassigned'}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            title="View Details"
                            onClick={() => handleViewClient(client.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            title="Edit Client"
                            onClick={() => handleEditClient(client.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Modals */}
      <AddClientModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onSuccess={handleModalSuccess}
      />
      
      <ViewClientModal
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
        clientId={selectedClientId}
      />
      
      <EditClientModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        clientId={selectedClientId}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default Clients;
