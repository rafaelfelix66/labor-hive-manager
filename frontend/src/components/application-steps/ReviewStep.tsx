
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ApplicationData } from "../ApplicationForm";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ReviewStepProps {
  data: ApplicationData;
  onTermsChange?: (agreed: boolean) => void;
}

export const ReviewStep = ({ data, onTermsChange }: ReviewStepProps) => {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    professional: false,
    additional: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Review & Submit</h2>
      <p className="text-gray-600 mb-6">
        Please review your information before submitting your application.
      </p>

      {/* Personal Information Section */}
      <Card>
        <Collapsible 
          open={expandedSections.personal} 
          onOpenChange={() => toggleSection('personal')}
        >
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50">
              <CardTitle className="flex items-center justify-between">
                Personal Information
                {expandedSections.personal ? <ChevronUp /> : <ChevronDown />}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><strong>Name:</strong> {data.firstName} {data.lastName}</div>
              <div><strong>Email:</strong> {data.email}</div>
              <div><strong>Phone:</strong> {data.phone}</div>
              <div><strong>Date of Birth:</strong> {data.dateOfBirth}</div>
              <div><strong>SSN:</strong> {data.ssn}</div>
              <div><strong>Gender:</strong> {data.gender}</div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Professional Experience Section */}
      <Card>
        <Collapsible 
          open={expandedSections.professional} 
          onOpenChange={() => toggleSection('professional')}
        >
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50">
              <CardTitle className="flex items-center justify-between">
                Professional Experience
                {expandedSections.professional ? <ChevronUp /> : <ChevronDown />}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><strong>English Level:</strong> {data.englishLevel}%</div>
                <div><strong>Driver's License:</strong> {data.hasDriversLicense ? 'Yes' : 'No'}</div>
              </div>
              
              {data.workExperience && data.workExperience.length > 0 && (
                <div>
                  <strong>Work Experience:</strong>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {data.workExperience.map((exp, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {data.additionalExperience && (
                <div><strong>Additional Experience:</strong> {data.additionalExperience}</div>
              )}
              
              {data.previousCompanyName && (
                <div>
                  <strong>Previous Company:</strong> {data.previousCompanyName}
                  {data.previousCompanyPhone && <span> - {data.previousCompanyPhone}</span>}
                  {data.previousCompanyEmail && <span> - {data.previousCompanyEmail}</span>}
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Additional Information Section */}
      <Card>
        <Collapsible 
          open={expandedSections.additional} 
          onOpenChange={() => toggleSection('additional')}
        >
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50">
              <CardTitle className="flex items-center justify-between">
                Additional Information
                {expandedSections.additional ? <ChevronUp /> : <ChevronDown />}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div>
                <strong>Address:</strong><br />
                {data.address1}{data.suite && `, ${data.suite}`}<br />
                {data.city}, {data.state} {data.zipCode}
              </div>
              
              <div>
                <strong>Emergency Contact:</strong><br />
                {data.emergencyContactName} ({data.emergencyContactRelation})<br />
                {data.emergencyContactPhone}
              </div>
              
              {data.howDidYouHear && (
                <div><strong>How did you hear about us:</strong> {data.howDidYouHear}</div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Terms Agreement */}
      <Card className="border-2 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <Checkbox 
              id="terms"
              checked={agreedToTerms}
              onCheckedChange={(checked) => {
                const agreed = checked as boolean;
                setAgreedToTerms(agreed);
                onTermsChange?.(agreed);
              }}
            />
            <Label htmlFor="terms" className="text-sm leading-relaxed">
              I confirm that all the information provided is accurate and complete. 
              I understand and agree to the Privacy Policy and Terms of Service.
            </Label>
          </div>
        </CardContent>
      </Card>

      {!agreedToTerms && (
        <p className="text-red-600 text-sm">
          Please agree to the terms and conditions to submit your application.
        </p>
      )}
    </div>
  );
};
