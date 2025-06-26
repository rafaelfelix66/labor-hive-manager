import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { X, Plus, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { apiService } from "@/services/api";

interface EditEmployeeModalProps {
  open: boolean;
  onClose: () => void;
  employeeId: string | null;
}

const EditEmployeeModal = ({ open, onClose, employeeId }: EditEmployeeModalProps) => {
  const [loading, setLoading] = useState(false);
  const [loadingEmployee, setLoadingEmployee] = useState(false);
  const [formData, setFormData] = useState({
    jobs: [] as string[],
    hourlyRate: '',
    assignedTo: '',
    active: true
  });
  const [originalData, setOriginalData] = useState<any>(null);
  const [newJob, setNewJob] = useState('');
  const [availableJobs, setAvailableJobs] = useState<string[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);

  useEffect(() => {
    if (open && employeeId) {
      fetchEmployeeDetails();
      fetchAvailableJobs();
    }
  }, [open, employeeId]);

  const fetchEmployeeDetails = async () => {
    if (!employeeId) return;

    try {
      setLoadingEmployee(true);
      const response = await apiService.getEmployee(employeeId);
      
      if (response.success && response.data) {
        const employee = response.data;
        setOriginalData(employee);
        setFormData({
          jobs: [...employee.jobs],
          hourlyRate: employee.hourlyRate.toString(),
          assignedTo: employee.assignedTo,
          active: employee.active
        });
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
      setLoadingEmployee(false);
    }
  };

  const fetchAvailableJobs = async () => {
    try {
      setLoadingJobs(true);
      const response = await apiService.getJobs();
      
      if (response.success && response.data) {
        const jobNames = response.data.map((job: any) => job.name);
        setAvailableJobs(jobNames);
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      toast({
        title: "Error",
        description: "Failed to load available jobs",
        variant: "destructive",
      });
    } finally {
      setLoadingJobs(false);
    }
  };

  const handleAddJob = () => {
    if (newJob.trim() && !formData.jobs.includes(newJob.trim())) {
      setFormData(prev => ({
        ...prev,
        jobs: [...prev.jobs, newJob.trim()]
      }));
      setNewJob('');
    }
  };

  const handleRemoveJob = (jobToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      jobs: prev.jobs.filter(job => job !== jobToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.hourlyRate || !formData.assignedTo || formData.jobs.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.updateEmployee(employeeId!, {
        jobs: formData.jobs,
        hourlyRate: parseFloat(formData.hourlyRate),
        assignedTo: formData.assignedTo,
        active: formData.active
      });

      if (response.success) {
        toast({
          title: "Success",
          description: "Employee updated successfully",
        });
        onClose();
      } else {
        throw new Error(response.error || 'Failed to update employee');
      }
    } catch (error: any) {
      console.error('Error updating employee:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update employee",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!originalData && !loadingEmployee) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Employee</DialogTitle>
          <DialogDescription>
            {loadingEmployee ? "Loading employee information..." : `Update information for ${originalData?.name}`}
          </DialogDescription>
        </DialogHeader>

        {loadingEmployee ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading employee details...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>

            <div className="grid gap-4 py-4">
              {/* Employee Basic Info (Read-only) */}
              <div className="grid gap-2">
                <Label>Employee Information</Label>
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="font-medium">{originalData?.name}</p>
                  <p className="text-sm text-gray-600">{originalData?.email}</p>
                  <p className="text-sm text-gray-600">{originalData?.phone}</p>
                </div>
              </div>

              {/* Jobs */}
              <div className="grid gap-2">
                <Label>Jobs *</Label>
                <div className="flex gap-2">
                  <Select value={newJob} onValueChange={setNewJob}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select a job" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableJobs
                        .filter(job => !formData.jobs.includes(job))
                        .map((job) => (
                          <SelectItem key={job} value={job}>
                            {job}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <Button type="button" onClick={handleAddJob} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Or type a custom job"
                    value={newJob}
                    onChange={(e) => setNewJob(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddJob())}
                  />
                  <Button type="button" onClick={handleAddJob} size="sm">
                    Add
                  </Button>
                </div>
                {formData.jobs.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {formData.jobs.map((job, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {job}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => handleRemoveJob(job)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Hourly Rate */}
              <div className="grid gap-2">
                <Label htmlFor="hourlyRate">Hourly Rate ($) *</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="25.00"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData(prev => ({ ...prev, hourlyRate: e.target.value }))}
                  required
                />
              </div>

              {/* Assigned To */}
              <div className="grid gap-2">
                <Label htmlFor="assignedTo">Assigned To *</Label>
                <Select 
                  value={formData.assignedTo} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, assignedTo: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a manager" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manager A">Manager A</SelectItem>
                    <SelectItem value="Manager B">Manager B</SelectItem>
                    <SelectItem value="Manager C">Manager C</SelectItem>
                    <SelectItem value="Manager D">Manager D</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Active Status */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="active">Active Status</Label>
                  <p className="text-sm text-gray-600">
                    When inactive, the employee won't appear in active listings
                  </p>
                </div>
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Employee'
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditEmployeeModal;