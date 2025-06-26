import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { apiService } from "@/services/api";

interface AddCustomerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AddCustomerModal = ({ open, onOpenChange, onSuccess }: AddCustomerModalProps) => {
  const [loading, setLoading] = useState(false);
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
    internalNotes: ''
  });

  const entityTypes = ['Corporation', 'LLC', 'Partnership'];
  const markupTypes = ['Percent', 'Dollar'];
  const salesReps = ['Sales Rep A', 'Sales Rep B', 'Sales Rep C', 'Sales Rep D'];
  const wcClasses = ['A', 'B', 'C', 'D', 'E'];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData({
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
      internalNotes: ''
    });
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
        markupValue: formData.markupValue ? parseFloat(formData.markupValue) : undefined,
        commission: formData.commission ? parseFloat(formData.commission) : undefined,
      };

      // Remove empty optional fields
      Object.keys(submitData).forEach(key => {
        if (submitData[key as keyof typeof submitData] === '') {
          delete submitData[key as keyof typeof submitData];
        }
      });

      const response = await apiService.createCustomer(submitData);

      if (response.success) {
        toast({
          title: "Success",
          description: "Customer created successfully",
        });
        onSuccess();
        onOpenChange(false);
        resetForm();
      } else {
        throw new Error(response.error || 'Failed to create customer');
      }
    } catch (error: any) {
      console.error('Error creating customer:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create customer",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen);
      if (!isOpen) resetForm();
    }}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>
              Create a new customer company record.
            </DialogDescription>
          </DialogHeader>

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
                'Create Client'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCustomerModal;