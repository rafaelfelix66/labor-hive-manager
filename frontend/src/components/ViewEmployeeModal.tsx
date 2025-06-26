import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, Phone, MapPin, Calendar, DollarSign, User, Briefcase, CheckCircle, XCircle, Eye, FileImage, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { apiService } from "@/services/api"; // API service for backend communication

interface ViewEmployeeModalProps {
  open: boolean;
  onClose: () => void;
  employeeId: string | null;
}

const ViewEmployeeModal = ({ open, onClose, employeeId }: ViewEmployeeModalProps) => {
  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showLicense, setShowLicense] = useState(false);

  useEffect(() => {
    if (open && employeeId) {
      fetchEmployeeDetails();
    }
  }, [open, employeeId]);

  const fetchEmployeeDetails = async () => {
    if (!employeeId) return;

    try {
      setLoading(true);
      const response = await apiService.getEmployee(employeeId);
      
      if (response.success && response.data) {
        setEmployee(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch employee details');
      }
    } catch (error: any) {
      console.error('Error fetching employee details:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load employee details",
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

  // Helper function to get license file data from either structure
  const getLicenseData = () => {
    return {
      licenseFileUrl: employee?.licenseFileUrl || employee?.application?.licenseFileUrl,
      licenseFileOriginalName: employee?.licenseFileOriginalName || employee?.application?.licenseFileOriginalName
    };
  };

  const handleViewLicense = () => {
    console.log('Employee data:', employee);
    
    const { licenseFileUrl, licenseFileOriginalName } = getLicenseData();
    
    console.log('License file URL:', licenseFileUrl);
    console.log('License original name:', licenseFileOriginalName);
    
    if (licenseFileUrl) {
      // Check if it's a real file (new format) or old temporary reference
      if (licenseFileUrl.includes('temp_')) {
        toast({
          title: "File Preview Not Available", 
          description: "This is an old file reference. File upload service was not available when this was uploaded.",
          variant: "destructive",
        });
        setShowLicense(true);
      } else {
        // Open the actual file - ensure we're using the correct filename
        const filename = licenseFileUrl;
        const url = apiService.getFileUrl(filename);
        console.log('Opening file URL:', url);
        console.log('Full URL being opened:', url);
        
        // Test if file exists by trying to fetch it first
        fetch(url, { method: 'HEAD' })
          .then(response => {
            if (response.ok) {
              window.open(url, '_blank');
            } else {
              throw new Error(`File not found (${response.status})`);
            }
          })
          .catch(error => {
            console.error('Error accessing file:', error);
            toast({
              title: "File Access Error",
              description: `Could not access the license file. Please check if the file exists on the server.`,
              variant: "destructive",
            });
            setShowLicense(true); // Show the file info anyway
          });
      }
    } else {
      toast({
        title: "License File Not Available",
        description: "No license file found for this employee.",
        variant: "destructive",
      });
      console.log('No license file URL found in employee data');
    }
  };

  const handleDownloadLicense = () => {
    const { licenseFileUrl, licenseFileOriginalName } = getLicenseData();
    
    if (licenseFileUrl) {
      // Check if it's a real file (new format) or old temporary reference
      if (licenseFileUrl.includes('temp_')) {
        toast({
          title: "Download Not Available",
          description: "This is an old file reference. File upload service was not available when this was uploaded.",
          variant: "destructive",
        });
      } else {
        // Download the actual file
        const url = apiService.getDownloadUrl(
          licenseFileUrl, 
          licenseFileOriginalName || 'license-file'
        );
        window.open(url, '_blank');
      }
    }
  };

  if (!employee && !loading) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Employee Details
          </DialogTitle>
          <DialogDescription>
            Complete information about the employee
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading employee details...</span>
          </div>
        ) : employee ? (
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
                  <p className="text-lg font-semibold">{employee.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <Badge variant={employee.active ? "default" : "secondary"} className="mt-1">
                    {employee.active ? (
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
                  <p>{employee.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    Phone
                  </p>
                  <p>{employee.phone}</p>
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
                  <p className="text-sm font-medium text-gray-500">Jobs</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {employee.jobs && employee.jobs.length > 0 ? (
                      employee.jobs.map((job: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {job}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400">No jobs assigned</p>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    Hourly Rate
                  </p>
                  <p className="text-lg font-semibold text-green-600">
                    ${employee.hourlyRate}/hour
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">English Level</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${employee.englishLevel}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{employee.englishLevel}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Driver's License</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={employee.hasLicense ? "default" : "secondary"}>
                      {employee.hasLicense ? "Yes" : "No"}
                    </Badge>
                    {employee.hasLicense && getLicenseData().licenseFileUrl && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleViewLicense}
                          className="flex items-center gap-1"
                        >
                          <Eye className="h-3 w-3" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleDownloadLicense}
                          className="flex items-center gap-1"
                        >
                          <Download className="h-3 w-3" />
                          Download
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Assigned To</p>
                  <p className="font-medium">{employee.assignedTo}</p>
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
                  <p>{formatDate(employee.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Last Updated</p>
                  <p>{formatDate(employee.updatedAt)}</p>
                </div>
              </div>
            </div>

            {/* License File Viewer */}
            {showLicense && getLicenseData().licenseFileUrl && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <FileImage className="h-4 w-4" />
                    Driver's License File
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <FileImage className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm font-medium text-gray-600 mb-1">License File</p>
                      <p className="text-xs text-gray-500">{getLicenseData().licenseFileUrl}</p>
                      {getLicenseData().licenseFileUrl?.includes('temp_') ? (
                        <>
                          <p className="text-xs text-red-600 mt-2 font-medium">
                            ⚠ Legacy file reference
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            This is from before file upload service was implemented. Actual file is not available.
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-xs text-green-600 mt-2 font-medium">
                            ✓ File available for viewing and download
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Original filename: {getLicenseData().licenseFileOriginalName || 'Unknown'}
                          </p>
                        </>
                      )}
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleDownloadLicense}
                          className="flex items-center gap-1"
                          disabled={getLicenseData().licenseFileUrl?.includes('temp_')}
                        >
                          <Download className="h-3 w-3" />
                          Download File
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setShowLicense(false)}
                        >
                          Hide License
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Application Details (if available) */}
            {employee.application && (
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
                        {employee.address1}
                        {employee.suite && `, ${employee.suite}`}
                      </p>
                      <p>
                        {employee.city}, {employee.state} {employee.zipCode}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Emergency Contact</p>
                      <p className="font-medium">{employee.emergencyContactName}</p>
                      <p>{employee.emergencyContactPhone}</p>
                      <p className="text-sm text-gray-500">({employee.emergencyContactRelation})</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Employee details not found</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewEmployeeModal;