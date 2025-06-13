
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Upload, FileText, CheckCircle, Loader2 } from "lucide-react";
import { ApplicationData } from "../ApplicationForm";
import { useState, useEffect } from "react";
import { apiService } from "@/services/api";
import { toast } from "@/hooks/use-toast";

interface ProfessionalExperienceStepProps {
  data: ApplicationData;
  updateData: (data: Partial<ApplicationData>) => void;
}

interface Service {
  id: string;
  name: string;
  description: string;
  averageHourlyRate: string;
  active: boolean;
}

export const ProfessionalExperienceStep = ({ data, updateData }: ProfessionalExperienceStepProps) => {
  const [englishLevel, setEnglishLevel] = useState([data.englishLevel]);
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoadingServices(true);
      console.log('Fetching services...');
      const response = await apiService.getServices();
      console.log('Services response:', response);
      if (response.success) {
        setServices(response.data || []);
        console.log('Services loaded:', response.data?.length || 0);
      } else {
        console.error('Services fetch failed:', response.message);
        toast({
          title: "Error",
          description: "Failed to load services",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      toast({
        title: "Error",
        description: "Failed to load services. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingServices(false);
    }
  };

  const handleEnglishLevelChange = (value: number[]) => {
    setEnglishLevel(value);
    updateData({ englishLevel: value[0] });
  };

  const toggleService = (service: string) => {
    const currentServices = data.services || [];
    const updated = currentServices.includes(service)
      ? currentServices.filter(srv => srv !== service)
      : [...currentServices, service];
    updateData({ services: updated });
  };

  const validateAndUploadFile = async (file: File) => {
    // Validate file type and size
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload only JPEG, PNG, or PDF files.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB
      toast({
        title: "File Too Large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);
      const response = await apiService.uploadLicense(file);
      
      if (response.success) {
        updateData({ 
          licenseFileUrl: response.data.filename,
          licenseFileOriginalName: response.data.originalName
        });
        toast({
          title: "File Uploaded Successfully",
          description: "Your license file has been uploaded and verified.",
        });
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await validateAndUploadFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (uploading) return;
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      await validateAndUploadFile(files[0]);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Professional Experience</h2>
      
      <div className="space-y-4">
        <Label>English Level: {englishLevel[0]}%</Label>
        <Slider
          value={englishLevel}
          onValueChange={handleEnglishLevelChange}
          max={100}
          min={0}
          step={25}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>0% (None)</span>
          <span>25% (Basic)</span>
          <span>50% (Intermediate)</span>
          <span>75% (Advanced)</span>
          <span>100% (Native)</span>
        </div>
      </div>

      <div className="space-y-4">
        <Label>Do you have a driver's license? *</Label>
        <RadioGroup
          value={data.hasDriversLicense ? "yes" : "no"}
          onValueChange={(value) => updateData({ hasDriversLicense: value === "yes" })}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="license-yes" />
            <Label htmlFor="license-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="license-no" />
            <Label htmlFor="license-no">No</Label>
          </div>
        </RadioGroup>
        
        {data.hasDriversLicense && (
          <div className="space-y-3">
            <Label htmlFor="licenseUpload">Upload Driver's License</Label>
            
            {/* Upload Area */}
            <div 
              className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
                dragActive 
                  ? 'border-blue-400 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="text-center">
                {uploading ? (
                  <div className="space-y-2">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
                    <p className="text-sm text-blue-600">Uploading your license file...</p>
                    <p className="text-xs text-gray-500">Please wait while we securely upload your file</p>
                  </div>
                ) : data.licenseFileUrl ? (
                  <div className="space-y-2">
                    <CheckCircle className="h-8 w-8 mx-auto text-green-600" />
                    <p className="text-sm text-green-600 font-medium">
                      ✓ License uploaded successfully
                    </p>
                    <p className="text-xs text-gray-500">
                      {data.licenseFileOriginalName || 'license-file'}
                    </p>
                    <div className="flex gap-2 justify-center mt-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const url = apiService.getFileUrl(data.licenseFileUrl!);
                          window.open(url, '_blank');
                        }}
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const url = apiService.getDownloadUrl(data.licenseFileUrl!, data.licenseFileOriginalName);
                          window.open(url, '_blank');
                        }}
                      >
                        <Upload className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          updateData({ licenseFileUrl: undefined, licenseFileOriginalName: undefined });
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Upload className={`h-8 w-8 mx-auto ${dragActive ? 'text-blue-500' : 'text-gray-400'}`} />
                    <div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('licenseUpload')?.click()}
                        className="text-blue-600 hover:text-blue-700 border-blue-200 hover:bg-blue-50"
                        disabled={uploading}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Choose License File
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600">
                      {dragActive ? 'Drop your file here' : 'or drag and drop your file here'}
                    </p>
                    <p className="text-xs text-gray-500">
                      Accepted formats: PNG, JPG, PDF (maximum 10MB)
                    </p>
                    <p className="text-xs text-gray-400">
                      🔒 Your license information will be kept secure and confidential
                    </p>
                  </div>
                )}
              </div>
              
              <input
                id="licenseUpload"
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                disabled={uploading}
                style={{ display: 'none' }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <Label>Select Services You Can Provide *</Label>
        <p className="text-sm text-gray-600">Choose the services you are qualified and willing to provide</p>
        {loadingServices ? (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">Loading services...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-red-500">No services available. Please contact support.</p>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchServices}
              className="mt-2"
            >
              Retry Loading Services
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <p className="col-span-full text-xs text-gray-500 mb-2">
              {services.length} services available
            </p>
            {services.map((service) => (
              <Button
                key={service.id}
                variant={data.services?.includes(service.name) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleService(service.name)}
                className="justify-start"
                title={service.description || service.name}
              >
                {service.name}
              </Button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <Label htmlFor="hourlyRate">Desired Hourly Rate (USD) *</Label>
        <p className="text-sm text-gray-600">Enter your expected hourly rate for services</p>
        <div className="flex items-center space-x-2">
          <span className="text-lg font-medium">$</span>
          <Input
            id="hourlyRate"
            type="number"
            min="10"
            max="100"
            step="0.50"
            value={data.hourlyRate || ""}
            onChange={(e) => updateData({ hourlyRate: parseFloat(e.target.value) || 0 })}
            placeholder="15.00"
            className="w-32"
          />
          <span className="text-sm text-gray-500">per hour</span>
        </div>
        <p className="text-xs text-gray-500">Minimum: $10/hr, Maximum: $100/hr</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="additionalExperience">Additional Experience / Comments</Label>
        <Textarea
          id="additionalExperience"
          value={data.additionalExperience}
          onChange={(e) => updateData({ additionalExperience: e.target.value })}
          placeholder="Describe any additional experience or comments..."
          rows={4}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Previous Employment (Optional)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="previousCompanyName">Company Name</Label>
            <Input
              id="previousCompanyName"
              value={data.previousCompanyName}
              onChange={(e) => updateData({ previousCompanyName: e.target.value })}
              placeholder="Previous company name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="previousCompanyPhone">Company Phone</Label>
            <Input
              id="previousCompanyPhone"
              type="tel"
              value={data.previousCompanyPhone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                let formatted = value;
                if (value.length >= 6) {
                  formatted = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
                } else if (value.length >= 3) {
                  formatted = `(${value.slice(0, 3)}) ${value.slice(3)}`;
                } else if (value.length > 0) {
                  formatted = `(${value}`;
                }
                updateData({ previousCompanyPhone: formatted });
              }}
              placeholder="(555) 123-4567"
              maxLength={14}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="previousCompanyEmail">Company Email</Label>
          <Input
            id="previousCompanyEmail"
            type="email"
            value={data.previousCompanyEmail}
            onChange={(e) => updateData({ previousCompanyEmail: e.target.value })}
            placeholder="company@example.com"
          />
        </div>
      </div>
    </div>
  );
};
