
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Building2, Building, Plus, Edit, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const Clients = () => {
  const [clients] = useState([
    {
      id: 1,
      companyName: "Tech Solutions Inc.",
      entity: "Corporation",
      active: true,
      street: "789 Business Blvd",
      zipCode: "11111",
      city: "Los Angeles",
      state: "CA",
      country: "USA",
      wcClass: "A",
      markupType: "Percent",
      markupValue: 20,
      commission: 12,
      assignedTo: "Sales Rep A",
      internalNotes: "High-value client, pays on time"
    },
    {
      id: 2,
      companyName: "Green Industries LLC",
      entity: "LLC",
      active: true,
      street: "321 Corporate Way",
      zipCode: "22222",
      city: "San Diego",
      state: "CA",
      country: "USA",
      wcClass: "B",
      markupType: "Dollar",
      markupValue: 75,
      commission: 15,
      assignedTo: "Sales Rep B",
      internalNotes: "Seasonal client, mainly summer projects"
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
            <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
            <p className="text-gray-600">Manage client companies and relationships</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        </div>

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
                {clients.map((client) => (
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
                    <TableCell>{client.wcClass}</TableCell>
                    <TableCell>
                      {client.markupType === "Percent" ? `${client.markupValue}%` : `$${client.markupValue}`}
                    </TableCell>
                    <TableCell>{client.commission}%</TableCell>
                    <TableCell>
                      <Badge variant={client.active ? "default" : "secondary"}>
                        {client.active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>{client.assignedTo}</TableCell>
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

export default Clients;
