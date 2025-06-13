import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
  DollarSign, 
  Download, 
  Plus, 
  Eye, 
  Edit, 
  Loader2,
  Search,
  Filter,
  TrendingUp,
  Users,
  Calendar,
  ArrowUpDown,
  AlertCircle,
  CheckCircle,
  XCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { apiService } from "@/services/api";
import CreateBillModal from "@/components/CreateBillModal";
import ViewBillModal from "@/components/ViewBillModal";
// import WorkingFinancialCharts from "@/components/WorkingFinancialCharts";

const Billing = () => {
  const [bills, setBills] = useState<any[]>([]);
  const [reports, setReports] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reportsLoading, setReportsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  
  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedBillId, setSelectedBillId] = useState<string | null>(null);

  useEffect(() => {
    fetchBills();
    fetchReports();
  }, []);

  const fetchBills = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getBills({ limit: 100 });
      
      if (response.success && response.data) {
        setBills(response.data);
      } else {
        setError('Failed to fetch bills');
      }
    } catch (error: any) {
      console.error('Error fetching bills:', error);
      setError(error.message || 'Failed to fetch bills');
      toast({
        title: "Error",
        description: "Failed to load bills. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async () => {
    try {
      setReportsLoading(true);
      const response = await apiService.getBillReports();
      
      if (response.success && response.data) {
        setReports(response.data);
      }
    } catch (error: any) {
      console.error('Error fetching reports:', error);
    } finally {
      setReportsLoading(false);
    }
  };

  const handleViewBill = (billId: string) => {
    setSelectedBillId(billId);
    setViewModalOpen(true);
  };

  const handleModalSuccess = () => {
    fetchBills();
    fetchReports();
  };

  const handleDownloadPDF = async (billId: string, billNumber: string) => {
    try {
      await apiService.generateBillPDF(billId, billNumber);
      toast({
        title: "PDF Downloaded",
        description: "Bill PDF has been downloaded successfully",
      });
    } catch (error: any) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate bill PDF",
        variant: "destructive",
      });
    }
  };

  const handleStatusUpdate = async (billId: string, newStatus: string) => {
    try {
      const updateData: any = { status: newStatus };
      if (newStatus === 'Paid') {
        updateData.paidDate = new Date().toISOString().split('T')[0];
      }
      
      const response = await apiService.updateBill(billId, updateData);
      
      if (response.success) {
        toast({
          title: "Success",
          description: "Bill status updated successfully",
        });
        fetchBills();
        fetchReports();
      }
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update bill status",
        variant: "destructive",
      });
    }
  };

  // Filter and sort bills
  const filteredAndSortedBills = useMemo(() => {
    let filtered = bills.filter(bill => {
      const searchMatch = !searchTerm || 
        bill.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${bill.provider.application.firstName} ${bill.provider.application.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());

      const statusMatch = statusFilter === 'all' || bill.status === statusFilter;

      return searchMatch && statusMatch;
    });

    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'billNumber':
          aValue = a.billNumber;
          bValue = b.billNumber;
          break;
        case 'client':
          aValue = a.client.companyName.toLowerCase();
          bValue = b.client.companyName.toLowerCase();
          break;
        case 'provider':
          aValue = `${a.provider.application.firstName} ${a.provider.application.lastName}`.toLowerCase();
          bValue = `${b.provider.application.firstName} ${b.provider.application.lastName}`.toLowerCase();
          break;
        case 'service':
          aValue = a.service.toLowerCase();
          bValue = b.service.toLowerCase();
          break;
        case 'totalClient':
          aValue = a.totalClient;
          bValue = b.totalClient;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'createdAt':
        default:
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
    });

    return filtered;
  }, [bills, searchTerm, statusFilter, sortBy, sortOrder]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Paid':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Overdue':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'default';
      case 'Overdue':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'Paid';
      case 'Overdue':
        return 'Overdue';
      case 'Pending':
        return 'Pending';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/dashboard" className="flex items-center">
              <img src="/eom staffing.png" alt="EOM Staffing" className="h-12 w-auto" />
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
            <h1 className="text-3xl font-bold text-gray-900">Billing & Reports</h1>
            <p className="text-gray-600">Generate bills and track payments</p>
          </div>
          <Button onClick={() => setCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Bill
          </Button>
        </div>

        {/* Summary Cards */}
        {reportsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="flex items-center justify-center h-24">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : reports ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${reports.summary.totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Profit</CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${reports.summary.profit.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Margin: {reports.summary.profitMargin}%</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <AlertCircle className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reports.summary.pendingBills}</div>
                <p className="text-xs text-muted-foreground">Awaiting payment</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bills Generated</CardTitle>
                <FileText className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reports.summary.totalBills}</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {/* Financial Summary - Simple Version */}
        {bills.length > 0 && (
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Financial Overview
                </CardTitle>
                <CardDescription>
                  Key financial metrics from your bills
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {bills.filter(b => b.status === 'Paid').length}
                    </div>
                    <p className="text-sm text-green-700">Paid Bills</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {bills.filter(b => b.status === 'Pending').length}
                    </div>
                    <p className="text-sm text-yellow-700">Pending Bills</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {bills.filter(b => b.status === 'Overdue').length}
                    </div>
                    <p className="text-sm text-red-700">Overdue Bills</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      ${bills.filter(b => b.status === 'Paid').reduce((sum, b) => sum + b.totalClient, 0).toFixed(2)}
                    </div>
                    <p className="text-sm text-blue-700">Total Revenue</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Bills Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Bills ({filteredAndSortedBills.length})
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </CardTitle>
            <CardDescription>
              Track all generated bills and payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            {showFilters && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Number, client, service..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Paid">Paid</SelectItem>
                        <SelectItem value="Overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Sort by</label>
                    <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="createdAt">Creation Date</SelectItem>
                        <SelectItem value="billNumber">Bill Number</SelectItem>
                        <SelectItem value="client">Client</SelectItem>
                        <SelectItem value="totalClient">Amount</SelectItem>
                        <SelectItem value="status">Status</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading bills...</span>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => {
                        if (sortBy === 'billNumber') {
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        } else {
                          setSortBy('billNumber');
                          setSortOrder('asc');
                        }
                      }}
                    >
                      <div className="flex items-center">
                        # Bill
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => {
                        if (sortBy === 'client') {
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        } else {
                          setSortBy('client');
                          setSortOrder('asc');
                        }
                      }}
                    >
                      <div className="flex items-center">
                        Client
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => {
                        if (sortBy === 'totalClient') {
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        } else {
                          setSortBy('totalClient');
                          setSortOrder('desc');
                        }
                      }}
                    >
                      <div className="flex items-center">
                        Client Total
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Provider Gets</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedBills.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <FileText className="h-8 w-8 text-gray-400" />
                          <p className="text-gray-500">
                            {searchTerm || statusFilter !== 'all'
                              ? 'No bills found with applied filters'
                              : 'No bills found'}
                          </p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setCreateModalOpen(true)}
                          >
                            Create first bill
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAndSortedBills.map((bill) => (
                      <TableRow key={bill.id}>
                        <TableCell className="font-medium">{bill.billNumber}</TableCell>
                        <TableCell>{bill.client.companyName}</TableCell>
                        <TableCell>
                          {bill.provider.application.firstName} {bill.provider.application.lastName}
                        </TableCell>
                        <TableCell>{bill.service}</TableCell>
                        <TableCell>{bill.hoursWorked}h</TableCell>
                        <TableCell className="font-semibold text-green-600">
                          {formatCurrency(bill.totalClient)}
                        </TableCell>
                        <TableCell className="font-semibold text-blue-600">
                          {formatCurrency(bill.totalProvider)}
                        </TableCell>
                        <TableCell>{formatDate(bill.createdAt)}</TableCell>
                        <TableCell>
                          <Select 
                            value={bill.status} 
                            onValueChange={(value) => handleStatusUpdate(bill.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <Badge variant={getStatusVariant(bill.status)} className="border-0">
                                {getStatusIcon(bill.status)}
                                <span className="ml-1">{getStatusLabel(bill.status)}</span>
                              </Badge>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="Paid">Paid</SelectItem>
                              <SelectItem value="Overdue">Overdue</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewBill(bill.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDownloadPDF(bill.id, bill.billNumber)}
                            >
                              <Download className="h-4 w-4" />
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
      <CreateBillModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSuccess={handleModalSuccess}
      />
      
      <ViewBillModal
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
        billId={selectedBillId}
      />
    </div>
  );
};

export default Billing;