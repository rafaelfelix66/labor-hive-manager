
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Building2, FileText, DollarSign, Download, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const Billing = () => {
  const [bills] = useState([
    {
      id: "INV-001",
      clientName: "Tech Solutions Inc.",
      providerName: "John Smith",
      service: "Plumbing",
      hoursWorked: 8,
      serviceRate: 35,
      totalClient: 480,
      totalProvider: 280,
      date: "2024-06-10",
      status: "Paid"
    },
    {
      id: "INV-002", 
      clientName: "Green Industries LLC",
      providerName: "Maria Garcia",
      service: "Landscaping",
      hoursWorked: 12,
      serviceRate: 25,
      totalClient: 375,
      totalProvider: 300,
      date: "2024-06-09",
      status: "Pending"
    }
  ]);

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
            <h1 className="text-3xl font-bold text-gray-900">Billing & Reports</h1>
            <p className="text-gray-600">Generate bills and track payments</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Bill
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12,450</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
              <FileText className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2,850</div>
              <p className="text-xs text-muted-foreground">Pending payment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bills Generated</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">127</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Bills Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Recent Bills
            </CardTitle>
            <CardDescription>
              Track all generated bills and payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bill ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Client Total</TableHead>
                  <TableHead>Provider Pay</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bills.map((bill) => (
                  <TableRow key={bill.id}>
                    <TableCell className="font-medium">{bill.id}</TableCell>
                    <TableCell>{bill.clientName}</TableCell>
                    <TableCell>{bill.providerName}</TableCell>
                    <TableCell>{bill.service}</TableCell>
                    <TableCell>{bill.hoursWorked}h</TableCell>
                    <TableCell>${bill.serviceRate}/hr</TableCell>
                    <TableCell className="font-semibold text-green-600">${bill.totalClient}</TableCell>
                    <TableCell className="font-semibold text-blue-600">${bill.totalProvider}</TableCell>
                    <TableCell>{bill.date}</TableCell>
                    <TableCell>
                      <Badge variant={bill.status === "Paid" ? "default" : "secondary"}>
                        {bill.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        PDF
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Billing;
