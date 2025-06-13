
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ApplicationData } from "../ApplicationForm";

interface PersonalInfoStepProps {
  data: ApplicationData;
  updateData: (data: Partial<ApplicationData>) => void;
}

export const PersonalInfoStep = ({ data, updateData }: PersonalInfoStepProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={data.firstName}
            onChange={(e) => updateData({ firstName: e.target.value })}
            placeholder="Enter your first name"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={data.lastName}
            onChange={(e) => updateData({ lastName: e.target.value })}
            placeholder="Enter your last name"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => updateData({ email: e.target.value })}
            placeholder="your.email@example.com"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            value={data.phone}
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
              updateData({ phone: formatted });
            }}
            placeholder="(555) 123-4567"
            maxLength={14}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={data.dateOfBirth || ''}
            onChange={(e) => updateData({ dateOfBirth: e.target.value })}
            max={new Date(new Date().setFullYear(new Date().getFullYear() - 16)).toISOString().split('T')[0]}
            required
          />
          <p className="text-xs text-gray-500">Must be at least 16 years old</p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="ssn">Social Security Number *</Label>
          <Input
            id="ssn"
            value={data.ssn}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              let formatted = value;
              if (value.length >= 5) {
                formatted = `${value.slice(0, 3)}-${value.slice(3, 5)}-${value.slice(5, 9)}`;
              } else if (value.length >= 3) {
                formatted = `${value.slice(0, 3)}-${value.slice(3)}`;
              }
              updateData({ ssn: formatted });
            }}
            placeholder="XXX-XX-XXXX"
            maxLength={11}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="gender">Gender *</Label>
        <Select value={data.gender} onValueChange={(value) => updateData({ gender: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select your gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Male">Male</SelectItem>
            <SelectItem value="Female">Female</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
