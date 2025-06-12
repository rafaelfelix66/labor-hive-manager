
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Plus, Edit, Eye, Loader2, ArrowUpDown } from "lucide-react";
import { Link } from "react-router-dom";
import { apiService } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import AddProviderModal from "@/components/AddProviderModal";
import ViewProviderModal from "@/components/ViewProviderModal";
import EditProviderModal from "@/components/EditProviderModal";
import TableFilters from "@/components/TableFilters";

const ServiceProviders = () => {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter and sort states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [assignedToFilter, setAssignedToFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getProviders();
      
      if (response.success && response.data) {
        setProviders(response.data);
      } else {
        setError('Failed to fetch providers');
      }
    } catch (error: any) {
      console.error('Error fetching providers:', error);
      setError(error.message || 'Failed to fetch providers');
      toast({
        title: "Error",
        description: "Failed to load service providers. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewProvider = (providerId: string) => {
    setSelectedProviderId(providerId);
    setViewModalOpen(true);
  };

  const handleEditProvider = (providerId: string) => {
    setSelectedProviderId(providerId);
    setEditModalOpen(true);
  };

  const handleModalSuccess = () => {
    fetchProviders(); // Refresh the providers list
  };

  // Filter and sort logic
  const filteredAndSortedProviders = useMemo(() => {
    let filtered = providers.filter(provider => {
      // Search filter
      const searchMatch = !searchTerm || 
        provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (provider.assignedTo && provider.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())) ||
        provider.services.some((service: string) => service.toLowerCase().includes(searchTerm.toLowerCase()));

      // Status filter
      const statusMatch = statusFilter === 'all' || 
        (statusFilter === 'active' && provider.active) ||
        (statusFilter === 'inactive' && !provider.active);

      // Service filter
      const serviceMatch = serviceFilter === 'all' || 
        provider.services.includes(serviceFilter);

      // Assigned to filter
      const assignedMatch = assignedToFilter === 'all' || 
        (assignedToFilter === 'unassigned' && !provider.assignedTo) ||
        provider.assignedTo === assignedToFilter;

      return searchMatch && statusMatch && serviceMatch && assignedMatch;
    });

    // Sort logic
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'email':
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case 'hourlyRate':
          aValue = a.hourlyRate || 0;
          bValue = b.hourlyRate || 0;
          break;
        case 'englishLevel':
          aValue = a.englishLevel || 0;
          bValue = b.englishLevel || 0;
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
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
    });

    return filtered;
  }, [providers, searchTerm, statusFilter, serviceFilter, assignedToFilter, sortBy, sortOrder]);

  // Get unique values for filters
  const uniqueServices = useMemo(() => {
    const services = [...new Set(providers.flatMap(provider => provider.services))];
    return services.map(service => ({ value: service, label: service }));
  }, [providers]);

  const uniqueAssignedTo = useMemo(() => {
    const assigned = [...new Set(providers.map(provider => provider.assignedTo).filter(Boolean))];
    return assigned.map(person => ({ value: person, label: person }));
  }, [providers]);

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchTerm) count++;
    if (statusFilter !== 'all') count++;
    if (serviceFilter !== 'all') count++;
    if (assignedToFilter !== 'all') count++;
    return count;
  }, [searchTerm, statusFilter, serviceFilter, assignedToFilter]);

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setServiceFilter('all');
    setAssignedToFilter('all');
  };

  const sortOptions = [
    { value: 'name', label: 'Nome' },
    { value: 'email', label: 'Email' },
    { value: 'hourlyRate', label: 'Taxa/Hora' },
    { value: 'englishLevel', label: 'Nível de Inglês' },
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
            <h1 className="text-3xl font-bold text-gray-900">Service Providers</h1>
            <p className="text-gray-600">Manage freelancers and their assignments</p>
          </div>
          <Button onClick={() => setAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Provider
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
              value: serviceFilter,
              onChange: setServiceFilter,
              options: uniqueServices,
              placeholder: "Todos os serviços",
              label: "Serviços"
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
          placeholder="Pesquisar por nome, email, telefone, serviços..."
          activeFiltersCount={activeFiltersCount}
          onClearFilters={clearFilters}
        />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              All Service Providers
            </CardTitle>
            <CardDescription>
              Manage and track all registered service providers
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading service providers...</span>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={fetchProviders} variant="outline">
                  Try Again
                </Button>
              </div>
            ) : filteredAndSortedProviders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">
                  {providers.length === 0 ? "Nenhum provedor de serviços encontrado." : "Nenhum provedor corresponde aos filtros aplicados."}
                </p>
                {providers.length === 0 ? (
                  <Button onClick={() => setAddModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Primeiro Provedor
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
                        if (sortBy === 'name') {
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        } else {
                          setSortBy('name');
                          setSortOrder('asc');
                        }
                      }}
                    >
                      <div className="flex items-center gap-1">
                        Nome
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50 select-none"
                      onClick={() => {
                        if (sortBy === 'email') {
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        } else {
                          setSortBy('email');
                          setSortOrder('asc');
                        }
                      }}
                    >
                      <div className="flex items-center gap-1">
                        Contato
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead>Serviços</TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50 select-none"
                      onClick={() => {
                        if (sortBy === 'hourlyRate') {
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        } else {
                          setSortBy('hourlyRate');
                          setSortOrder('asc');
                        }
                      }}
                    >
                      <div className="flex items-center gap-1">
                        Taxa/Hora
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50 select-none"
                      onClick={() => {
                        if (sortBy === 'englishLevel') {
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        } else {
                          setSortBy('englishLevel');
                          setSortOrder('asc');
                        }
                      }}
                    >
                      <div className="flex items-center gap-1">
                        Nível de Inglês
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead>Licença</TableHead>
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
                  {filteredAndSortedProviders.map((provider) => (
                    <TableRow key={provider.id}>
                      <TableCell className="font-medium">{provider.name}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{provider.email}</div>
                          <div className="text-gray-500">{provider.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {provider.services.map((service: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>${provider.hourlyRate}/hr</TableCell>
                      <TableCell>{provider.englishLevel}%</TableCell>
                      <TableCell>
                        <Badge variant={provider.hasLicense ? "default" : "secondary"}>
                          {provider.hasLicense ? "Yes" : "No"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={provider.active ? "default" : "secondary"}>
                          {provider.active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>{provider.assignedTo}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            title="View Details"
                            onClick={() => handleViewProvider(provider.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            title="Edit Provider"
                            onClick={() => handleEditProvider(provider.id)}
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
      <AddProviderModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onSuccess={handleModalSuccess}
      />
      
      <ViewProviderModal
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
        providerId={selectedProviderId}
      />
      
      <EditProviderModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        providerId={selectedProviderId}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default ServiceProviders;
