import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { X, Plus, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { apiService } from "@/services/api";

interface EditProviderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  providerId: string | null;
  onSuccess: () => void;
}

const EditProviderModal = ({ open, onOpenChange, providerId, onSuccess }: EditProviderModalProps) => {
  const [loading, setLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState(false);
  const [formData, setFormData] = useState({
    services: [] as string[],
    hourlyRate: '',
    assignedTo: '',
    active: true
  });
  const [originalData, setOriginalData] = useState<any>(null);
  const [newService, setNewService] = useState('');

  const commonServices = [
    'Plumbing', 'Electrical', 'Landscaping', 'Janitorial', 'Construction', 
    'Carpentry', 'Roofing', 'Painting', 'HVAC', 'Security', 'Cleaning'
  ];

  useEffect(() => {
    if (open && providerId) {
      fetchProviderDetails();
    }
  }, [open, providerId]);

  const fetchProviderDetails = async () => {
    if (!providerId) return;

    try {
      setLoadingProvider(true);
      const response = await apiService.getProvider(providerId);
      
      if (response.success && response.data) {
        const provider = response.data;
        setOriginalData(provider);
        setFormData({
          services: [...provider.services],
          hourlyRate: provider.hourlyRate.toString(),
          assignedTo: provider.assignedTo,
          active: provider.active
        });
      } else {
        throw new Error(response.error || 'Failed to fetch provider details');
      }
    } catch (error: any) {
      console.error('Error fetching provider details:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load provider details",
        variant: "destructive",
      });
    } finally {
      setLoadingProvider(false);
    }
  };

  const handleAddService = () => {
    if (newService.trim() && !formData.services.includes(newService.trim())) {
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, newService.trim()]
      }));
      setNewService('');
    }
  };

  const handleRemoveService = (serviceToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter(service => service !== serviceToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.hourlyRate || !formData.assignedTo || formData.services.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.updateProvider(providerId!, {
        services: formData.services,
        hourlyRate: parseFloat(formData.hourlyRate),
        assignedTo: formData.assignedTo,
        active: formData.active
      });

      if (response.success) {
        toast({
          title: "Success",
          description: "Service provider updated successfully",
        });
        onSuccess();
        onOpenChange(false);
      } else {
        throw new Error(response.error || 'Failed to update provider');
      }
    } catch (error: any) {
      console.error('Error updating provider:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update service provider",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!originalData && !loadingProvider) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Service Provider</DialogTitle>
          <DialogDescription>
            {loadingProvider ? "Loading provider information..." : `Update information for ${originalData?.name}`}
          </DialogDescription>
        </DialogHeader>

        {loadingProvider ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading provider details...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>

            <div className="grid gap-4 py-4">
              {/* Provider Basic Info (Read-only) */}
              <div className="grid gap-2">
                <Label>Provider Information</Label>
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="font-medium">{originalData?.name}</p>
                  <p className="text-sm text-gray-600">{originalData?.email}</p>
                  <p className="text-sm text-gray-600">{originalData?.phone}</p>
                </div>
              </div>

              {/* Services */}
              <div className="grid gap-2">
                <Label>Services *</Label>
                <div className="flex gap-2">
                  <Select value={newService} onValueChange={setNewService}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {commonServices
                        .filter(service => !formData.services.includes(service))
                        .map((service) => (
                          <SelectItem key={service} value={service}>
                            {service}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <Button type="button" onClick={handleAddService} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Or type a custom service"
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddService())}
                  />
                  <Button type="button" onClick={handleAddService} size="sm">
                    Add
                  </Button>
                </div>
                {formData.services.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {formData.services.map((service, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {service}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => handleRemoveService(service)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Hourly Rate */}
              <div className="grid gap-2">
                <Label htmlFor="hourlyRate">Hourly Rate ($) *</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="25.00"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData(prev => ({ ...prev, hourlyRate: e.target.value }))}
                  required
                />
              </div>

              {/* Assigned To */}
              <div className="grid gap-2">
                <Label htmlFor="assignedTo">Assigned To *</Label>
                <Select 
                  value={formData.assignedTo} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, assignedTo: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a manager" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manager A">Manager A</SelectItem>
                    <SelectItem value="Manager B">Manager B</SelectItem>
                    <SelectItem value="Manager C">Manager C</SelectItem>
                    <SelectItem value="Manager D">Manager D</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Active Status */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="active">Active Status</Label>
                  <p className="text-sm text-gray-600">
                    When inactive, the provider won't appear in active listings
                  </p>
                </div>
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
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
                  'Update Provider'
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditProviderModal;