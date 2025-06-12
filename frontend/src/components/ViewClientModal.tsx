import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Building, MapPin, Calendar, DollarSign, FileText, CheckCircle, XCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { apiService } from "@/services/api";

interface ViewClientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string | null;
}

const ViewClientModal = ({ open, onOpenChange, clientId }: ViewClientModalProps) => {
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && clientId) {
      fetchClientDetails();
    }
  }, [open, clientId]);

  const fetchClientDetails = async () => {
    if (!clientId) return;

    try {
      setLoading(true);
      const response = await apiService.getClient(clientId);
      
      if (response.success && response.data) {
        setClient(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch client details');
      }
    } catch (error: any) {
      console.error('Error fetching client details:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load client details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (!client && !loading) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Client Details
          </DialogTitle>
          <DialogDescription>
            Complete information about the client company
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading client details...</span>
          </div>
        ) : client ? (
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Building className="h-4 w-4" />
                Company Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Company Name</p>
                  <p className="text-lg font-semibold">{client.companyName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Entity Type</p>
                  <Badge variant="outline" className="mt-1">
                    {client.entity}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <Badge variant={client.active ? "default" : "secondary"} className="mt-1">
                    {client.active ? (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Active
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3 mr-1" />
                        Inactive
                      </>
                    )}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Assigned To</p>
                  <p className="font-medium">{client.assignedTo || 'Unassigned'}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Address Information */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Address Information
              </h3>
              <div className="grid grid-cols-1 gap-2">
                <div>
                  <p className="text-sm font-medium text-gray-500">Street Address</p>
                  <p>
                    {client.street}
                    {client.suite && `, ${client.suite}`}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">City, State, ZIP</p>
                  <p>{client.city}, {client.state} {client.zipCode}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Country</p>
                  <p>{client.country}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Business Information */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Business Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Workers' Comp Class</p>
                  <p>{client.wcClass ? `Class ${client.wcClass}` : 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Markup</p>
                  <p>
                    {client.markupType && client.markupValue ? (
                      client.markupType === 'Percent' 
                        ? `${client.markupValue}%` 
                        : formatCurrency(parseFloat(client.markupValue))
                    ) : 'Not specified'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Commission</p>
                  <p>{client.commission ? `${client.commission}%` : 'Not specified'}</p>
                </div>
              </div>
            </div>

            {/* Internal Notes */}
            {client.internalNotes && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Internal Notes
                  </h3>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-sm whitespace-pre-wrap">{client.internalNotes}</p>
                  </div>
                </div>
              </>
            )}

            <Separator />

            {/* Recent Bills */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Recent Bills
              </h3>
              {client.bills && client.bills.length > 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Latest Bills</CardTitle>
                    <CardDescription>
                      Showing the most recent {client.bills.length} bills
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Bill #</TableHead>
                          <TableHead>Service</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {client.bills.map((bill: any) => (
                          <TableRow key={bill.id}>
                            <TableCell className="font-medium">{bill.billNumber}</TableCell>
                            <TableCell>{bill.service}</TableCell>
                            <TableCell>{formatCurrency(parseFloat(bill.totalClient))}</TableCell>
                            <TableCell>
                              <Badge variant={
                                bill.status === 'Paid' ? 'default' : 
                                bill.status === 'Overdue' ? 'destructive' : 'secondary'
                              }>
                                {bill.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatDate(bill.createdAt)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <p>No bills found for this client</p>
                </div>
              )}
            </div>

            <Separator />

            {/* Dates */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Important Dates
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Created</p>
                  <p>{formatDate(client.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Last Updated</p>
                  <p>{formatDate(client.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Client details not found</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewClientModal;