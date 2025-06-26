import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Edit, Eye, Loader2, ArrowUpDown } from "lucide-react";
import { Link } from "react-router-dom";
import { apiService } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import AddEmployeeModal from "@/components/AddEmployeeModal";
import ViewEmployeeModal from "@/components/ViewEmployeeModal";
import EditEmployeeModal from "@/components/EditEmployeeModal";
import TableFilters from "@/components/TableFilters";

const Employees = () => {
  const [employees, setEmployees] = useState<any[]>([]);
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
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getEmployees();
      
      if (response.success && response.data) {
        setEmployees(response.data);
      } else {
        setError('Failed to fetch employees');
      }
    } catch (error: any) {
      console.error('Error fetching employees:', error);
      setError(error.message || 'Failed to fetch employees');
      toast({
        title: "Error",
        description: "Failed to fetch employees. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Get unique values for filters
  const uniqueJobs = useMemo(() => {
    const allJobs = employees.flatMap(employee => employee.jobs || []);
    return [...new Set(allJobs)];
  }, [employees]);

  const uniqueAssignedTo = useMemo(() => {
    const allAssignedTo = employees.map(employee => employee.assignedTo).filter(Boolean);
    return [...new Set(allAssignedTo)];
  }, [employees]);

  // Filtered and sorted employees
  const filteredAndSortedEmployees = useMemo(() => {
    let filtered = employees.filter(employee => {
      const matchesSearch = searchTerm === '' || 
        employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.phone?.includes(searchTerm);
      
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && employee.active) ||
        (statusFilter === 'inactive' && !employee.active);
      
      const matchesService = serviceFilter === 'all' || 
        employee.jobs?.includes(serviceFilter);
      
      const matchesAssignedTo = assignedToFilter === 'all' || 
        employee.assignedTo === assignedToFilter;
      
      return matchesSearch && matchesStatus && matchesService && matchesAssignedTo;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name || '';
          bValue = b.name || '';
          break;
        case 'email':
          aValue = a.email || '';
          bValue = b.email || '';
          break;
        case 'hourlyRate':
          aValue = parseFloat(a.hourlyRate) || 0;
          bValue = parseFloat(b.hourlyRate) || 0;
          break;
        case 'englishLevel':
          aValue = a.englishLevel || 0;
          bValue = b.englishLevel || 0;
          break;
        case 'assignedTo':
          aValue = a.assignedTo || '';
          bValue = b.assignedTo || '';
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        default:
          aValue = a.name || '';
          bValue = b.name || '';
      }
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [employees, searchTerm, statusFilter, serviceFilter, assignedToFilter, sortBy, sortOrder]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleViewEmployee = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    setViewModalOpen(true);
  };

  const handleEditEmployee = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    setEditModalOpen(true);
  };

  const handleModalClose = () => {
    setAddModalOpen(false);
    setViewModalOpen(false);
    setEditModalOpen(false);
    setSelectedEmployeeId(null);
    fetchEmployees(); // Refresh data
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading employees...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchEmployees}>Try Again</Button>
        </div>
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
            <p className="text-gray-600">Manage your employee workforce and their assignments</p>
          </div>
          <Button onClick={() => setAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        </div>

        {/* Filters */}
        <TableFilters
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={(field, order) => {
            setSortBy(field);
            setSortOrder(order);
          }}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          additionalFilters={[
            {
              value: serviceFilter,
              onChange: setServiceFilter,
              options: [
                { value: 'all', label: 'All Jobs' },
                ...uniqueJobs.map(job => ({ value: job, label: job }))
              ],
              placeholder: 'Select job...',
              label: 'Job'
            },
            {
              value: assignedToFilter,
              onChange: setAssignedToFilter,
              options: [
                { value: 'all', label: 'All Assignments' },
                { value: 'Equipe A', label: 'Team A' },
                { value: 'Equipe B', label: 'Team B' },
                { value: 'Equipe C', label: 'Team C' },
                { value: 'Freelance', label: 'Freelance' }
              ],
              placeholder: 'Select assignment...',
              label: 'Assigned To'
            }
          ]}
          sortOptions={[
            { value: 'name', label: 'Name' },
            { value: 'email', label: 'Email' },
            { value: 'hourlyRate', label: 'Hourly Rate' },
            { value: 'createdAt', label: 'Date Created' }
          ]}
          placeholder="Search employees..."
        />

      {/* Employees Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employees ({filteredAndSortedEmployees.length})</CardTitle>
          <CardDescription>
            A list of all employees in your system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredAndSortedEmployees.length === 0 ? (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold text-muted-foreground">No employees found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {employees.length === 0 ? 'Get started by adding your first employee.' : 'Try adjusting your filters.'}
              </p>
              {employees.length === 0 && (
                <div className="mt-6">
                  <Button onClick={() => setAddModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Employee
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center">
                        Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted"
                      onClick={() => handleSort('email')}
                    >
                      <div className="flex items-center">
                        Contact
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Jobs</TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted"
                      onClick={() => handleSort('hourlyRate')}
                    >
                      <div className="flex items-center">
                        Hourly Rate
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted"
                      onClick={() => handleSort('englishLevel')}
                    >
                      <div className="flex items-center">
                        English Level
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted"
                      onClick={() => handleSort('assignedTo')}
                    >
                      <div className="flex items-center">
                        Assigned To
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-semibold">{employee.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {employee.hasLicense && (
                              <Badge variant="outline" className="text-xs">
                                Has License
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{employee.email}</div>
                          <div className="text-muted-foreground">{employee.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {employee.jobs?.slice(0, 2).map((job: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {job}
                            </Badge>
                          ))}
                          {employee.jobs?.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{employee.jobs.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        ${parseFloat(employee.hourlyRate || 0).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="text-sm font-medium">{employee.englishLevel}%</div>
                        </div>
                      </TableCell>
                      <TableCell>{employee.assignedTo}</TableCell>
                      <TableCell>
                        <Badge variant={employee.active ? "default" : "secondary"}>
                          {employee.active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewEmployee(employee.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditEmployee(employee.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <AddEmployeeModal 
        open={addModalOpen} 
        onClose={handleModalClose}
      />
      
      {selectedEmployeeId && (
        <>
          <ViewEmployeeModal 
            open={viewModalOpen} 
            onClose={handleModalClose}
            employeeId={selectedEmployeeId}
          />
          <EditEmployeeModal 
            open={editModalOpen} 
            onClose={handleModalClose}
            employeeId={selectedEmployeeId}
          />
        </>
      )}
      </div>
    </div>
  );
};

export default Employees;