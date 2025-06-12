import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { apiService } from "@/services/api";

interface EditClientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string | null;
  onSuccess: () => void;
}

const EditClientModal = ({ open, onOpenChange, clientId, onSuccess }: EditClientModalProps) => {
  const [loading, setLoading] = useState(false);
  const [loadingClient, setLoadingClient] = useState(false);
  const [originalData, setOriginalData] = useState<any>(null);
  const [formData, setFormData] = useState({
    companyName: '',
    entity: '',
    street: '',
    suite: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    wcClass: '',
    markupType: '',
    markupValue: '',
    commission: '',
    assignedTo: '',
    internalNotes: '',
    active: true
  });

  const entityTypes = ['Corporation', 'LLC', 'Partnership'];
  const markupTypes = ['Percent', 'Dollar'];
  const salesReps = ['Sales Rep A', 'Sales Rep B', 'Sales Rep C', 'Sales Rep D'];
  const wcClasses = ['A', 'B', 'C', 'D', 'E'];

  useEffect(() => {
    if (open && clientId) {
      fetchClientDetails();
    }
  }, [open, clientId]);

  const fetchClientDetails = async () => {
    if (!clientId) return;

    try {
      setLoadingClient(true);
      const response = await apiService.getClient(clientId);
      
      if (response.success && response.data) {
        const client = response.data;
        setOriginalData(client);
        setFormData({
          companyName: client.companyName || '',
          entity: client.entity || '',
          street: client.street || '',
          suite: client.suite || '',
          city: client.city || '',
          state: client.state || '',
          zipCode: client.zipCode || '',
          country: client.country || 'USA',
          wcClass: client.wcClass || 'none',
          markupType: client.markupType || 'none',
          markupValue: client.markupValue ? client.markupValue.toString() : '',
          commission: client.commission ? client.commission.toString() : '',
          assignedTo: client.assignedTo || 'unassigned',
          internalNotes: client.internalNotes || '',
          active: client.active
        });
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
      setLoadingClient(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.companyName || !formData.entity || !formData.street || 
        !formData.city || !formData.state || !formData.zipCode) {
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
        ...formData,
        wcClass: formData.wcClass === 'none' ? undefined : formData.wcClass,
        markupType: formData.markupType === 'none' ? undefined : formData.markupType,
        markupValue: formData.markupValue ? parseFloat(formData.markupValue) : undefined,
        commission: formData.commission ? parseFloat(formData.commission) : undefined,
        assignedTo: formData.assignedTo === 'unassigned' ? undefined : formData.assignedTo,
      };

      // Remove empty optional fields
      Object.keys(submitData).forEach(key => {
        if (submitData[key as keyof typeof submitData] === '') {
          submitData[key as keyof typeof submitData] = undefined;
        }
      });

      const response = await apiService.updateClient(clientId!, submitData);

      if (response.success) {
        toast({
          title: "Success",
          description: "Client updated successfully",
        });
        onSuccess();
        onOpenChange(false);
      } else {
        throw new Error(response.error || 'Failed to update client');
      }
    } catch (error: any) {
      console.error('Error updating client:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update client",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!originalData && !loadingClient) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Client</DialogTitle>
          <DialogDescription>
            {loadingClient ? "Loading client information..." : `Update information for ${originalData?.companyName}`}
          </DialogDescription>
        </DialogHeader>

        {loadingClient ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading client details...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>

            <div className="grid gap-4 py-4">
              {/* Company Information */}
              <div className="grid gap-4">
                <h3 className="text-lg font-semibold">Company Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      placeholder="Enter company name"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="entity">Entity Type *</Label>
                    <Select 
                      value={formData.entity} 
                      onValueChange={(value) => handleInputChange('entity', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select entity type" />
                      </SelectTrigger>
                      <SelectContent>
                        {entityTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="grid gap-4">
                <h3 className="text-lg font-semibold">Address Information</h3>
                
                <div className="grid gap-2">
                  <Label htmlFor="street">Street Address *</Label>
                  <Input
                    id="street"
                    placeholder="Enter street address"
                    value={formData.street}
                    onChange={(e) => handleInputChange('street', e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="suite">Suite/Unit</Label>
                    <Input
                      id="suite"
                      placeholder="Suite, unit, etc."
                      value={formData.suite}
                      onChange={(e) => handleInputChange('suite', e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      placeholder="Enter city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      placeholder="CA"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="zipCode">Zip Code *</Label>
                    <Input
                      id="zipCode"
                      placeholder="90210"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Business Information */}
              <div className="grid gap-4">
                <h3 className="text-lg font-semibold">Business Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="wcClass">Workers' Comp Class</Label>
                    <Select 
                      value={formData.wcClass} 
                      onValueChange={(value) => handleInputChange('wcClass', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select WC class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {wcClasses.map((wcClass) => (
                          <SelectItem key={wcClass} value={wcClass}>
                            Class {wcClass}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="assignedTo">Assigned To</Label>
                    <Select 
                      value={formData.assignedTo} 
                      onValueChange={(value) => handleInputChange('assignedTo', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select sales rep" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        {salesReps.map((rep) => (
                          <SelectItem key={rep} value={rep}>
                            {rep}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="markupType">Markup Type</Label>
                    <Select 
                      value={formData.markupType} 
                      onValueChange={(value) => handleInputChange('markupType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select markup type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {markupTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="markupValue">Markup Value</Label>
                    <Input
                      id="markupValue"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder={formData.markupType === 'Percent' ? '20' : '75'}
                      value={formData.markupValue}
                      onChange={(e) => handleInputChange('markupValue', e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="commission">Commission (%)</Label>
                    <Input
                      id="commission"
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      placeholder="15"
                      value={formData.commission}
                      onChange={(e) => handleInputChange('commission', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Internal Notes */}
              <div className="grid gap-2">
                <Label htmlFor="internalNotes">Internal Notes</Label>
                <Textarea
                  id="internalNotes"
                  placeholder="Enter any internal notes about this client..."
                  rows={3}
                  value={formData.internalNotes}
                  onChange={(e) => handleInputChange('internalNotes', e.target.value)}
                />
              </div>

              {/* Active Status */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="active">Active Status</Label>
                  <p className="text-sm text-gray-600">
                    When inactive, the client won't appear in active listings
                  </p>
                </div>
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => handleInputChange('active', checked)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Client'
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditClientModal;