import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, Mail, Phone, MapPin, Calendar, DollarSign, User, Briefcase, CheckCircle, XCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { apiService } from "@/services/api";

interface ViewProviderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  providerId: string | null;
}

const ViewProviderModal = ({ open, onOpenChange, providerId }: ViewProviderModalProps) => {
  const [provider, setProvider] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && providerId) {
      fetchProviderDetails();
    }
  }, [open, providerId]);

  const fetchProviderDetails = async () => {
    if (!providerId) return;

    try {
      setLoading(true);
      const response = await apiService.getProvider(providerId);
      
      if (response.success && response.data) {
        setProvider(response.data);
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

  if (!provider && !loading) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Service Provider Details
          </DialogTitle>
          <DialogDescription>
            Complete information about the service provider
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading provider details...</span>
          </div>
        ) : provider ? (
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <User className="h-4 w-4" />
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Full Name</p>
                  <p className="text-lg font-semibold">{provider.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <Badge variant={provider.active ? "default" : "secondary"} className="mt-1">
                    {provider.active ? (
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
                  <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    Email
                  </p>
                  <p>{provider.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    Phone
                  </p>
                  <p>{provider.phone}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Professional Information */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Professional Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Services</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {provider.services?.map((service: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    Hourly Rate
                  </p>
                  <p className="text-lg font-semibold text-green-600">
                    ${provider.hourlyRate}/hour
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">English Level</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${provider.englishLevel}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{provider.englishLevel}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Driver's License</p>
                  <Badge variant={provider.hasLicense ? "default" : "secondary"} className="mt-1">
                    {provider.hasLicense ? "Yes" : "No"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Assigned To</p>
                  <p className="font-medium">{provider.assignedTo}</p>
                </div>
              </div>
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
                  <p>{formatDate(provider.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Last Updated</p>
                  <p>{formatDate(provider.updatedAt)}</p>
                </div>
              </div>
            </div>

            {/* Application Details (if available) */}
            {provider.application && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Application Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Address</p>
                      <p>
                        {provider.application.address1}
                        {provider.application.suite && `, ${provider.application.suite}`}
                      </p>
                      <p>
                        {provider.application.city}, {provider.application.state} {provider.application.zipCode}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Emergency Contact</p>
                      <p className="font-medium">{provider.application.emergencyContactName}</p>
                      <p>{provider.application.emergencyContactPhone}</p>
                      <p className="text-sm text-gray-500">({provider.application.emergencyContactRelation})</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Provider details not found</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewProviderModal;