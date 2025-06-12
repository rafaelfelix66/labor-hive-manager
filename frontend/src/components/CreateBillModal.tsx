import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Calculator, DollarSign, Clock, User, Building } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { apiService } from "@/services/api";

interface CreateBillModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const CreateBillModal = ({ open, onOpenChange, onSuccess }: CreateBillModalProps) => {
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  
  const [formData, setFormData] = useState({
    clientId: '',
    providerId: '',
    service: '',
    hoursWorked: '',
    serviceRate: '',
    dueDate: ''
  });

  // Calculation states
  const [calculations, setCalculations] = useState({
    baseTotal: 0,
    clientTotal: 0,
    providerTotal: 0,
    markup: 0,
    commission: 0,
    profit: 0
  });

  useEffect(() => {
    if (open) {
      fetchClientsAndProviders();
    }
  }, [open]);

  useEffect(() => {
    if (formData.clientId && formData.hoursWorked && formData.serviceRate) {
      calculateTotals();
    }
  }, [formData.clientId, formData.hoursWorked, formData.serviceRate]);

  const fetchClientsAndProviders = async () => {
    try {
      setLoadingData(true);
      const [clientsResponse, providersResponse] = await Promise.all([
        apiService.getClients({ active: true }),
        apiService.getProviders({ active: true })
      ]);

      if (clientsResponse.success) {
        setClients(clientsResponse.data || []);
      }
      if (providersResponse.success) {
        setProviders(providersResponse.data || []);
      }
    } catch (error: any) {
      console.error('Error fetching clients and providers:', error);
      toast({
        title: "Error",
        description: "Failed to load clients and providers",
        variant: "destructive",
      });
    } finally {
      setLoadingData(false);
    }
  };

  const calculateTotals = () => {
    const hours = parseFloat(formData.hoursWorked) || 0;
    const rate = parseFloat(formData.serviceRate) || 0;
    const baseTotal = hours * rate;

    const selectedClient = clients.find(c => c.id === formData.clientId);
    
    let clientTotal = baseTotal;
    let providerTotal = baseTotal;
    let markup = 0;
    let commission = 0;

    if (selectedClient) {
      // Apply markup
      if (selectedClient.markupType && selectedClient.markupValue) {
        const markupValue = parseFloat(selectedClient.markupValue) || 0;
        if (selectedClient.markupType === 'Percent') {
          markup = baseTotal * (markupValue / 100);
          clientTotal = baseTotal + markup;
        } else if (selectedClient.markupType === 'Dollar') {
          markup = markupValue;
          clientTotal = baseTotal + markup;
        }
      }

      // Apply commission
      if (selectedClient.commission) {
        const commissionValue = parseFloat(selectedClient.commission) || 0;
        commission = providerTotal * (commissionValue / 100);
        providerTotal = providerTotal - commission;
      }
    }

    const profit = clientTotal - providerTotal;

    setCalculations({
      baseTotal: Number(baseTotal) || 0,
      clientTotal: Number(clientTotal) || 0,
      providerTotal: Number(providerTotal) || 0,
      markup: Number(markup) || 0,
      commission: Number(commission) || 0,
      profit: Number(profit) || 0
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      clientId: '',
      providerId: '',
      service: '',
      hoursWorked: '',
      serviceRate: '',
      dueDate: ''
    });
    setCalculations({
      baseTotal: 0,
      clientTotal: 0,
      providerTotal: 0,
      markup: 0,
      commission: 0,
      profit: 0
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.clientId || !formData.providerId || !formData.service || 
        !formData.hoursWorked || !formData.serviceRate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      const submitData = {
        clientId: formData.clientId,
        providerId: formData.providerId,
        service: formData.service,
        hoursWorked: parseFloat(formData.hoursWorked),
        serviceRate: parseFloat(formData.serviceRate),
        dueDate: formData.dueDate || undefined
      };

      const response = await apiService.createBill(submitData);

      if (response.success) {
        toast({
          title: "Success",
          description: "Bill created successfully",
        });
        onSuccess();
        onOpenChange(false);
        resetForm();
      } else {
        throw new Error(response.error || 'Failed to create bill');
      }
    } catch (error: any) {
      console.error('Error creating bill:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create bill",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedClient = clients.find(c => c.id === formData.clientId);
  const selectedProvider = providers.find(p => p.id === formData.providerId);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen);
      if (!isOpen) resetForm();
    }}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Create New Bill
          </DialogTitle>
          <DialogDescription>
            Generate a bill for services provided with automatic markup and commission calculations.
          </DialogDescription>
        </DialogHeader>

        {loadingData ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading data...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 py-4">
              {/* Client and Provider Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="clientId" className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Client *
                  </Label>
                  <Select 
                    value={formData.clientId} 
                    onValueChange={(value) => handleInputChange('clientId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          <div className="flex flex-col">
                            <span>{client.companyName}</span>
                            <span className="text-sm text-gray-500">{client.entity}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="providerId" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Service Provider *
                  </Label>
                  <Select 
                    value={formData.providerId} 
                    onValueChange={(value) => handleInputChange('providerId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {providers.map((provider) => (
                        <SelectItem key={provider.id} value={provider.id}>
                          <div className="flex flex-col">
                            <span>
                              {provider.application 
                                ? `${provider.application.firstName} ${provider.application.lastName}`
                                : provider.name || `${provider.firstName} ${provider.lastName}`
                              }
                            </span>
                            <span className="text-sm text-gray-500">
                              {provider.services?.join(', ')} - ${provider.hourlyRate}/h
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Service Details */}
              <div className="grid gap-2">
                <Label htmlFor="service">Service Provided *</Label>
                <Input
                  id="service"
                  placeholder="e.g. Plumbing, Cleaning, Landscaping..."
                  value={formData.service}
                  onChange={(e) => handleInputChange('service', e.target.value)}
                  required
                />
              </div>

              {/* Hours and Rate */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="hoursWorked" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Hours Worked *
                  </Label>
                  <Input
                    id="hoursWorked"
                    type="number"
                    step="0.5"
                    min="0"
                    placeholder="8"
                    value={formData.hoursWorked}
                    onChange={(e) => handleInputChange('hoursWorked', e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="serviceRate">Hourly Rate ($) *</Label>
                  <Input
                    id="serviceRate"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="25.00"
                    value={formData.serviceRate}
                    onChange={(e) => handleInputChange('serviceRate', e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  />
                </div>
              </div>

              {/* Calculations Preview */}
              {(formData.hoursWorked && formData.serviceRate) && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calculator className="h-5 w-5" />
                      Automatic Calculations
                    </CardTitle>
                    <CardDescription>
                      Values calculated based on client and configurations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Base Total</p>
                      <p className="text-lg font-semibold">
                        ${calculations.baseTotal.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Client Pays</p>
                      <p className="text-lg font-semibold text-green-600">
                        ${calculations.clientTotal.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Provider Gets</p>
                      <p className="text-lg font-semibold text-blue-600">
                        ${calculations.providerTotal.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Profit</p>
                      <p className="text-lg font-semibold text-purple-600">
                        ${calculations.profit.toFixed(2)}
                      </p>
                    </div>
                  </CardContent>
                  
                  {selectedClient && (
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {selectedClient.markupType && (
                          <div className="flex justify-between">
                            <span>Markup ({selectedClient.markupType}):</span>
                            <span className="font-medium">
                              {selectedClient.markupType === 'Percent' 
                                ? `${selectedClient.markupValue}% = $${calculations.markup.toFixed(2)}`
                                : `$${calculations.markup.toFixed(2)}`
                              }
                            </span>
                          </div>
                        )}
                        {selectedClient.commission && (
                          <div className="flex justify-between">
                            <span>Commission:</span>
                            <span className="font-medium">
                              {selectedClient.commission}% = $${calculations.commission.toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  )}
                </Card>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Bill'
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateBillModal;