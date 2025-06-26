
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Building, Plus, Edit, Eye, Loader2, ArrowUpDown } from "lucide-react";
import { Link } from "react-router-dom";
import { apiService } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import AddCustomerModal from "@/components/AddCustomerModal";
import ViewCustomerModal from "@/components/ViewCustomerModal";
import EditCustomerModal from "@/components/EditCustomerModal";
import TableFilters from "@/components/TableFilters";

const Customers = () => {
  const [customers, setCustomers] = useState<any[]>([]);
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
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getCustomers();
      
      if (response.success && response.data) {
        setCustomers(response.data);
      } else {
        setError('Failed to fetch customers');
      }
    } catch (error: any) {
      console.error('Error fetching customers:', error);
      setError(error.message || 'Failed to fetch customers');
      toast({
        title: "Error",
        description: "Failed to load customers. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewCustomer = (customerId: string) => {
    setSelectedCustomerId(customerId);
    setViewModalOpen(true);
  };

  const handleEditCustomer = (customerId: string) => {
    setSelectedCustomerId(customerId);
    setEditModalOpen(true);
  };

  const handleModalSuccess = () => {
    fetchCustomers(); // Refresh the customers list
  };

  // Filter and sort logic
  const filteredAndSortedCustomers = useMemo(() => {
    let filtered = customers.filter(customer => {
      // Search filter
      const searchMatch = !searchTerm || 
        customer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.street.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customer.assignedTo && customer.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()));

      // Status filter
      const statusMatch = statusFilter === 'all' || 
        (statusFilter === 'active' && customer.active) ||
        (statusFilter === 'inactive' && !customer.active);

      // Entity filter
      const entityMatch = entityFilter === 'all' || customer.entity === entityFilter;

      // Assigned to filter
      const assignedMatch = assignedToFilter === 'all' || 
        (assignedToFilter === 'unassigned' && !customer.assignedTo) ||
        customer.assignedTo === assignedToFilter;

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
  }, [customers, searchTerm, statusFilter, entityFilter, assignedToFilter, sortBy, sortOrder]);

  // Get unique values for filters
  const uniqueEntities = useMemo(() => {
    const entities = [...new Set(customers.map(customer => customer.entity))];
    return entities.map(entity => ({ value: entity, label: entity }));
  }, [customers]);

  const uniqueAssignedTo = useMemo(() => {
    const assigned = [...new Set(customers.map(customer => customer.assignedTo).filter(Boolean))];
    return assigned.map(person => ({ value: person, label: person }));
  }, [customers]);

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
    { value: 'companyName', label: 'Company Name' },
    { value: 'entity', label: 'Entity Type' },
    { value: 'city', label: 'City' },
    { value: 'wcClass', label: 'WC Class' },
    { value: 'markup', label: 'Markup' },
    { value: 'commission', label: 'Commission' },
    { value: 'assignedTo', label: 'Assigned To' },
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
            <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
            <p className="text-gray-600">Manage customer companies and relationships</p>
          </div>
          <Button onClick={() => setAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
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
              placeholder: "All entities",
              label: "Entity Type"
            },
            {
              value: assignedToFilter,
              onChange: setAssignedToFilter,
              options: [
                { value: 'unassigned', label: 'Unassigned' },
                ...uniqueAssignedTo
              ],
              placeholder: "All assigned to",
              label: "Assigned To"
            }
          ]}
          sortOptions={sortOptions}
          placeholder="Search by name, address, city..."
          activeFiltersCount={activeFiltersCount}
          onClearFilters={clearFilters}
        />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="h-5 w-5 mr-2" />
              All Customers
            </CardTitle>
            <CardDescription>
              Manage customer companies and their contract details
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading customers...</span>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={fetchCustomers} variant="outline">
                  Try Again
                </Button>
              </div>
            ) : filteredAndSortedCustomers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">
                  {customers.length === 0 ? "No customers found." : "No customers match the applied filters."}
                </p>
                {customers.length === 0 ? (
                  <Button onClick={() => setAddModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Customer
                  </Button>
                ) : (
                  <Button onClick={clearFilters} variant="outline">
                    Clear Filters
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
                        Company
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
                        Entity
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
                        Location
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
                        WC Class
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
                        Commission
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
                        Assigned To
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.companyName}</TableCell>
                      <TableCell>{customer.entity}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{customer.street}</div>
                          <div className="text-gray-500">
                            {customer.city}, {customer.state} {customer.zipCode}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{customer.wcClass || 'N/A'}</TableCell>
                      <TableCell>
                        {customer.markupType && customer.markupValue ? (
                          customer.markupType === "Percent" ? `${customer.markupValue}%` : `$${customer.markupValue}`
                        ) : 'N/A'}
                      </TableCell>
                      <TableCell>{customer.commission ? `${customer.commission}%` : 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant={customer.active ? "default" : "secondary"}>
                          {customer.active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>{customer.assignedTo || 'Unassigned'}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            title="View Details"
                            onClick={() => handleViewCustomer(customer.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            title="Edit Customer"
                            onClick={() => handleEditCustomer(customer.id)}
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
      <AddCustomerModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onSuccess={handleModalSuccess}
      />
      
      <ViewCustomerModal
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
        customerId={selectedCustomerId}
      />
      
      <EditCustomerModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        customerId={selectedCustomerId}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default Customers;
