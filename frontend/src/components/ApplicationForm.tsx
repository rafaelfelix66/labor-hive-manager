
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PersonalInfoStep } from "./application-steps/PersonalInfoStep";
import { ProfessionalExperienceStep } from "./application-steps/ProfessionalExperienceStep";
import { AdditionalInfoStep } from "./application-steps/AdditionalInfoStep";
import { ReviewStep } from "./application-steps/ReviewStep";
import { toast } from "@/hooks/use-toast";
import { apiService } from "@/services/api";
import { Loader2 } from "lucide-react";

export interface ApplicationData {
  // Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  ssn: string;
  gender: string;
  
  // Professional Experience
  englishLevel: number;
  hasDriversLicense: boolean;
  licenseFile?: File;
  services: string[];
  hourlyRate: number;
  additionalExperience: string;
  previousCompanyName: string;
  previousCompanyPhone: string;
  previousCompanyEmail: string;
  
  // Additional Info
  address1: string;
  suite: string;
  city: string;
  state: string;
  zipCode: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  howDidYouHear: string;
}

const initialData: ApplicationData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  ssn: "",
  gender: "",
  englishLevel: 50,
  hasDriversLicense: false,
  services: [],
  hourlyRate: 15,
  additionalExperience: "",
  previousCompanyName: "",
  previousCompanyPhone: "",
  previousCompanyEmail: "",
  address1: "",
  suite: "",
  city: "",
  state: "",
  zipCode: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  emergencyContactRelation: "",
  howDidYouHear: "",
};

export const ApplicationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ApplicationData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const steps = [
    { number: 1, title: "Personal Information" },
    { number: 2, title: "Professional Experience" },
    { number: 3, title: "Additional Information" },
    { number: 4, title: "Review & Submit" },
  ];

  const progress = (currentStep / steps.length) * 100;

  const updateFormData = (data: Partial<ApplicationData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return formData.firstName && formData.lastName && formData.email && 
               formData.phone && formData.dateOfBirth && formData.ssn && formData.gender;
      case 2:
        return formData.services.length > 0 && formData.hourlyRate > 0;
      case 3:
        return formData.address1 && formData.city && formData.state && 
               formData.zipCode && formData.emergencyContactName && 
               formData.emergencyContactPhone && formData.emergencyContactRelation && 
               formData.howDidYouHear;
      case 4:
        return agreedToTerms;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in all required fields before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Prepare data for API submission
      const applicationData = {
        ...formData,
        dateOfBirth: formData.dateOfBirth,
        // Handle file upload separately if needed
        // For now, we'll store the file name if it exists (until file upload is implemented)
        licenseFileUrl: formData.licenseFile ? `temp_${Date.now()}_${formData.licenseFile.name}` : null,
      };

      // Remove the File object as it can't be serialized
      const { licenseFile, ...submitData } = applicationData;

      const response = await apiService.createApplication(submitData);
      
      if (response.success) {
        toast({
          title: "Application Submitted Successfully!",
          description: "Thank you for your application. We'll review it shortly and contact you soon.",
        });
        
        // Reset form
        setFormData(initialData);
        setCurrentStep(1);
        setAgreedToTerms(false);
      } else {
        throw new Error(response.message || 'Failed to submit application');
      }
    } catch (error: any) {
      console.error('Error submitting application:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep data={formData} updateData={updateFormData} />;
      case 2:
        return <ProfessionalExperienceStep data={formData} updateData={updateFormData} />;
      case 3:
        return <AdditionalInfoStep data={formData} updateData={updateFormData} />;
      case 4:
        return <ReviewStep data={formData} onTermsChange={setAgreedToTerms} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {steps.map((step) => (
            <div key={step.number} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step.number
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {step.number}
              </div>
              <span className={`ml-2 text-sm ${
                currentStep >= step.number ? "text-blue-600" : "text-gray-600"
              } hidden sm:inline`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-gray-600 mt-2">
          Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}
        </p>
      </div>

      {/* Form Content */}
      <Card>
        <CardContent className="p-6">
          {renderStep()}
          
          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            {currentStep < steps.length ? (
              <Button 
                onClick={nextStep}
                disabled={!validateCurrentStep()}
              >
                Next
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                className="bg-green-600 hover:bg-green-700"
                disabled={isSubmitting || !validateCurrentStep()}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
