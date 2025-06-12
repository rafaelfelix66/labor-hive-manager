
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ApplicationData } from "../ApplicationForm";

interface AdditionalInfoStepProps {
  data: ApplicationData;
  updateData: (data: Partial<ApplicationData>) => void;
}

const hearAboutOptions = [
  "Google Search",
  "Social Media",
  "Friend/Family Referral",
  "Job Board",
  "Company Website",
  "Advertisement",
  "Other"
];

export const AdditionalInfoStep = ({ data, updateData }: AdditionalInfoStepProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Information</h2>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Address</h3>
        
        <div className="space-y-2">
          <Label htmlFor="address1">Address Line 1 *</Label>
          <Input
            id="address1"
            value={data.address1}
            onChange={(e) => updateData({ address1: e.target.value })}
            placeholder="Street address"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="suite">Suite (Optional)</Label>
          <Input
            id="suite"
            value={data.suite}
            onChange={(e) => updateData({ suite: e.target.value })}
            placeholder="Apt, Suite, Unit, etc."
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              value={data.city}
              onChange={(e) => updateData({ city: e.target.value })}
              placeholder="City"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="state">State *</Label>
            <Input
              id="state"
              value={data.state}
              onChange={(e) => updateData({ state: e.target.value })}
              placeholder="State"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="zipCode">Zip Code *</Label>
            <Input
              id="zipCode"
              value={data.zipCode}
              onChange={(e) => updateData({ zipCode: e.target.value })}
              placeholder="12345"
              required
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Emergency Contact</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="emergencyContactName">Name *</Label>
            <Input
              id="emergencyContactName"
              value={data.emergencyContactName}
              onChange={(e) => updateData({ emergencyContactName: e.target.value })}
              placeholder="Emergency contact name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="emergencyContactPhone">Phone Number *</Label>
            <Input
              id="emergencyContactPhone"
              type="tel"
              value={data.emergencyContactPhone}
              onChange={(e) => updateData({ emergencyContactPhone: e.target.value })}
              placeholder="(555) 123-4567"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="emergencyContactRelation">Relationship to You *</Label>
          <Input
            id="emergencyContactRelation"
            value={data.emergencyContactRelation}
            onChange={(e) => updateData({ emergencyContactRelation: e.target.value })}
            placeholder="e.g., Spouse, Parent, Sibling"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="howDidYouHear">How did you hear about us? *</Label>
        <Select value={data.howDidYouHear} onValueChange={(value) => updateData({ howDidYouHear: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {hearAboutOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
