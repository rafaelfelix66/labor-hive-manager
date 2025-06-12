
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ApplicationData } from "../ApplicationForm";
import { useState } from "react";

interface ProfessionalExperienceStepProps {
  data: ApplicationData;
  updateData: (data: Partial<ApplicationData>) => void;
}

const workExperienceTypes = [
  "Warehouse", "Painter", "Construction", "Cooking", "Sales", "Landscaping",
  "Waiter", "Janitorial", "Delivery", "Mechanic", "Office", "Supermarket",
  "Handyman", "Plumbing", "Electrical", "Order Picker", "Forklift Operator",
  "Crew Leader", "Computer Skills"
];

export const ProfessionalExperienceStep = ({ data, updateData }: ProfessionalExperienceStepProps) => {
  const [englishLevel, setEnglishLevel] = useState([data.englishLevel]);

  const handleEnglishLevelChange = (value: number[]) => {
    setEnglishLevel(value);
    updateData({ englishLevel: value[0] });
  };

  const toggleWorkExperience = (experience: string) => {
    const currentExperience = data.workExperience || [];
    const updated = currentExperience.includes(experience)
      ? currentExperience.filter(exp => exp !== experience)
      : [...currentExperience, experience];
    updateData({ workExperience: updated });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateData({ licenseFile: file });
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
          <div className="space-y-2">
            <Label htmlFor="licenseUpload">Upload Driver's License</Label>
            <Input
              id="licenseUpload"
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileUpload}
            />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <Label>Select Work Experience Types *</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {workExperienceTypes.map((experience) => (
            <Button
              key={experience}
              variant={data.workExperience?.includes(experience) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleWorkExperience(experience)}
              className="justify-start"
            >
              {experience}
            </Button>
          ))}
        </div>
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
              onChange={(e) => updateData({ previousCompanyPhone: e.target.value })}
              placeholder="(555) 123-4567"
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
