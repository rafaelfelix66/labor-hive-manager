
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Users, FileText, DollarSign, LogOut, Factory, Building, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { apiService } from "@/services/api";

const Dashboard = () => {
  const [userRole, setUserRole] = useState("");
  const [stats, setStats] = useState({
    activeProviders: 0,
    activeClients: 0,
    monthlyRevenue: 0,
    pendingApplications: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const role = localStorage.getItem('userRole');
    
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    
    setUserRole(role || 'user');
    fetchDashboardStats();
  }, [navigate]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Check if user has valid auth token
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.warn('No auth token found, redirecting to login');
        navigate('/login');
        return;
      }

      // Fetch providers with error handling
      let activeProviders = 0;
      try {
        const providersResponse = await apiService.getProviders();
        activeProviders = providersResponse.success ? 
          (providersResponse.data || []).filter((p: any) => p.active).length : 0;
      } catch (error) {
        console.warn('Failed to fetch providers:', error);
      }

      // Fetch companies (clients) with error handling
      let activeClients = 0;
      try {
        const companiesResponse = await apiService.getClients();
        activeClients = companiesResponse.success ? 
          (companiesResponse.data || []).length : 0;
      } catch (error) {
        console.warn('Failed to fetch clients:', error);
      }

      // Fetch applications with error handling
      let pendingApplications = 0;
      try {
        const applicationsResponse = await apiService.getApplications();
        pendingApplications = applicationsResponse.success ? 
          (applicationsResponse.data || []).filter((app: any) => app.status === 'pending').length : 0;
      } catch (error) {
        console.warn('Failed to fetch applications:', error);
      }

      // Fetch bills for revenue calculation with error handling
      let monthlyRevenue = 0;
      try {
        const billsResponse = await apiService.getBills();
        if (billsResponse.success) {
          const currentMonth = new Date().getMonth();
          const currentYear = new Date().getFullYear();
          monthlyRevenue = (billsResponse.data || [])
            .filter((bill: any) => {
              const billDate = new Date(bill.createdAt);
              return billDate.getMonth() === currentMonth && billDate.getFullYear() === currentYear;
            })
            .reduce((sum: number, bill: any) => sum + parseFloat(bill.totalClient || 0), 0);
        }
      } catch (error) {
        console.warn('Failed to fetch bills:', error);
      }

      setStats({
        activeProviders,
        activeClients,
        monthlyRevenue,
        pendingApplications
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast({
        title: "Authentication Error",
        description: "Please login again to access dashboard data",
        variant: "destructive",
      });
      // Clear invalid auth and redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userRole');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };

  const statsConfig = [
    {
      title: "Active Providers",
      value: loading ? "..." : stats.activeProviders.toString(),
      description: "Currently available",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Active Clients",
      value: loading ? "..." : stats.activeClients.toString(),
      description: "Ongoing projects",
      icon: Building2,
      color: "text-green-600"
    },
    {
      title: "Monthly Revenue",
      value: loading ? "..." : `$${stats.monthlyRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      description: "This month",
      icon: DollarSign,
      color: "text-purple-600"
    },
    {
      title: "Pending Applications",
      value: loading ? "..." : stats.pendingApplications.toString(),
      description: "Awaiting review",
      icon: FileText,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src="/eom staffing.png" alt="EOM Staffing" className="h-17 w-auto" />
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {userRole}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Manage your labor outsourcing operations</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsConfig.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-600" />
                Service Providers
              </CardTitle>
              <CardDescription>
                Manage freelancers and their assignments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/providers">
                <Button className="w-full" variant="outline">
                  Manage Providers
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="h-5 w-5 mr-2 text-green-600" />
                Clients
              </CardTitle>
              <CardDescription>
                Track clients and manage relationships
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/clients">
                <Button className="w-full" variant="outline">
                  Manage Clients
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Factory className="h-5 w-5 mr-2 text-purple-600" />
                Suppliers
              </CardTitle>
              <CardDescription>
                Manage contractor companies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/suppliers">
                <Button className="w-full" variant="outline">
                  Manage Suppliers
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-orange-600" />
                Billing & Reports
              </CardTitle>
              <CardDescription>
                Generate bills and track payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/billing">
                <Button className="w-full" variant="outline">
                  View Billing
                </Button>
              </Link>
            </CardContent>
          </Card>

          {userRole === 'admin' && (
            <>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-red-600" />
                    Applications
                  </CardTitle>
                  <CardDescription>
                    Review and manage job applications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to="/admin">
                    <Button className="w-full">
                      Admin Panel
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-indigo-600" />
                    Service Management
                  </CardTitle>
                  <CardDescription>
                    Configure available services and rates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to="/services">
                    <Button className="w-full" variant="outline">
                      Manage Services
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
