
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PersonalInfoStep } from "./application-steps/PersonalInfoStep";
import { ProfessionalExperienceStep } from "./application-steps/ProfessionalExperienceStep";
import { AdditionalInfoStep } from "./application-steps/AdditionalInfoStep";
import { ReviewStep } from "./application-steps/ReviewStep";
import { toast } from "@/hooks/use-toast";

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
  workExperience: string[];
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
  workExperience: [],
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

  const handleSubmit = () => {
    // Store in localStorage for demo purposes
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    const newApplication = {
      ...formData,
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };
    applications.push(newApplication);
    localStorage.setItem('applications', JSON.stringify(applications));
    
    toast({
      title: "Application Submitted!",
      description: "Thank you for your application. We'll review it shortly.",
    });
    
    // Reset form
    setFormData(initialData);
    setCurrentStep(1);
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
        return <ReviewStep data={formData} />;
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
              <Button onClick={nextStep}>
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                Submit Application
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
