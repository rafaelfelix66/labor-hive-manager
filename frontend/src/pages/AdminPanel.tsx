
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, FileText, Download, Search, Filter } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface Application {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  englishLevel: number;
  hasDriversLicense: boolean;
  workExperience: string[];
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

const AdminPanel = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [englishFilter, setEnglishFilter] = useState("all");
  const [licenseFilter, setLicenseFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userRole = localStorage.getItem('userRole');
    
    if (!isLoggedIn || userRole !== 'admin') {
      navigate('/login');
      return;
    }

    // Load applications from localStorage
    const savedApplications = JSON.parse(localStorage.getItem('applications') || '[]');
    setApplications(savedApplications);
    setFilteredApplications(savedApplications);
  }, [navigate]);

  useEffect(() => {
    let filtered = applications;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(app => 
        `${app.firstName} ${app.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // English level filter
    if (englishFilter !== "all") {
      const minLevel = parseInt(englishFilter);
      filtered = filtered.filter(app => app.englishLevel >= minLevel);
    }

    // License filter
    if (licenseFilter !== "all") {
      const hasLicense = licenseFilter === "yes";
      filtered = filtered.filter(app => app.hasDriversLicense === hasLicense);
    }

    setFilteredApplications(filtered);
  }, [applications, searchTerm, statusFilter, englishFilter, licenseFilter]);

  const updateApplicationStatus = (id: string, status: 'approved' | 'rejected') => {
    const updatedApplications = applications.map(app =>
      app.id === id ? { ...app, status } : app
    );
    setApplications(updatedApplications);
    localStorage.setItem('applications', JSON.stringify(updatedApplications));
    
    toast({
      title: "Status Updated",
      description: `Application has been ${status}.`,
    });
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'English Level', 'Driver License', 'Work Experience', 'Status', 'Submitted At'];
    const csvData = filteredApplications.map(app => [
      `${app.firstName} ${app.lastName}`,
      app.email,
      app.phone,
      `${app.englishLevel}%`,
      app.hasDriversLicense ? 'Yes' : 'No',
      app.workExperience.join('; '),
      app.status,
      new Date(app.submittedAt).toLocaleDateString()
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'applications.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/dashboard" className="flex items-center">
                <Building2 className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">LaborPro</span>
              </Link>
              <span className="ml-4 text-gray-400">|</span>
              <span className="ml-4 text-lg font-medium text-gray-700">Admin Panel</span>
            </div>
            <Link to="/dashboard">
              <Button variant="outline">← Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Job Applications</h1>
            <p className="text-gray-600">Review and manage service provider applications</p>
          </div>
          <Button onClick={exportToCSV} className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={englishFilter} onValueChange={setEnglishFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by English level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All English Levels</SelectItem>
                  <SelectItem value="75">75%+ (Advanced)</SelectItem>
                  <SelectItem value="50">50%+ (Intermediate)</SelectItem>
                  <SelectItem value="25">25%+ (Basic)</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={licenseFilter} onValueChange={setLicenseFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by license" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All License Status</SelectItem>
                  <SelectItem value="yes">Has License</SelectItem>
                  <SelectItem value="no">No License</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Applications Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredApplications.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
                  <p className="text-gray-600">
                    {applications.length === 0 
                      ? "No applications have been submitted yet."
                      : "No applications match your current filters."
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredApplications.map((application) => (
              <Card key={application.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{application.firstName} {application.lastName}</CardTitle>
                      <CardDescription>{application.email}</CardDescription>
                    </div>
                    <Badge 
                      variant={
                        application.status === 'approved' ? 'default' :
                        application.status === 'rejected' ? 'destructive' : 'secondary'
                      }
                    >
                      {application.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div><strong>Phone:</strong> {application.phone}</div>
                    <div><strong>English Level:</strong> {application.englishLevel}%</div>
                    <div><strong>Driver's License:</strong> {application.hasDriversLicense ? 'Yes' : 'No'}</div>
                    <div>
                      <strong>Experience:</strong>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {application.workExperience.slice(0, 3).map((exp, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {exp}
                          </Badge>
                        ))}
                        {application.workExperience.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{application.workExperience.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-gray-500">
                      Submitted: {new Date(application.submittedAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  {application.status === 'pending' && (
                    <div className="flex gap-2 mt-4">
                      <Button 
                        size="sm" 
                        onClick={() => updateApplicationStatus(application.id, 'approved')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => updateApplicationStatus(application.id, 'rejected')}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
