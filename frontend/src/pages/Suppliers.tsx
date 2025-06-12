
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Building2, Factory, Plus, Edit, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const Suppliers = () => {
  const [suppliers] = useState([
    {
      id: 1,
      companyName: "ABC Construction Co.",
      entity: "Corporation",
      active: true,
      street: "123 Main St",
      zipCode: "12345",
      city: "Los Angeles",
      state: "CA",
      country: "USA",
      wcClass: "A",
      markupType: "Percent",
      markupValue: 15,
      commission: 8,
      assignedTo: "Manager A",
      internalNotes: "Reliable contractor, excellent quality work"
    },
    {
      id: 2,
      companyName: "XYZ Services LLC",
      entity: "LLC",
      active: true,
      street: "456 Oak Ave",
      zipCode: "67890",
      city: "San Francisco",
      state: "CA",
      country: "USA",
      wcClass: "B",
      markupType: "Dollar",
      markupValue: 50,
      commission: 10,
      assignedTo: "Manager B",
      internalNotes: "New supplier, needs monitoring"
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
            <h1 className="text-3xl font-bold text-gray-900">Suppliers</h1>
            <p className="text-gray-600">Manage contractor companies and suppliers</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Supplier
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Factory className="h-5 w-5 mr-2" />
              All Suppliers
            </CardTitle>
            <CardDescription>
              Manage contractor companies and their details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>WC Class</TableHead>
                  <TableHead>Markup</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suppliers.map((supplier) => (
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
                    <TableCell>{supplier.wcClass}</TableCell>
                    <TableCell>
                      {supplier.markupType === "Percent" ? `${supplier.markupValue}%` : `$${supplier.markupValue}`}
                    </TableCell>
                    <TableCell>{supplier.commission}%</TableCell>
                    <TableCell>
                      <Badge variant={supplier.active ? "default" : "secondary"}>
                        {supplier.active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>{supplier.assignedTo}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
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

export default Suppliers;
