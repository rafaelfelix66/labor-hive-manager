import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { apiService } from "@/services/api";

interface AddEmployeeModalProps {
  open: boolean;
  onClose: () => void;
}

const AddEmployeeModal = ({ open, onClose }: AddEmployeeModalProps) => {
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState<any[]>([]);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [formData, setFormData] = useState({
    applicationId: '',
    jobs: [] as string[],
    hourlyRate: '',
    assignedTo: ''
  });
  const [newService, setNewService] = useState('');
  const [availableJobs, setAvailableJobs] = useState<string[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);

  useEffect(() => {
    if (open) {
      fetchApplications();
      fetchAvailableJobs();
      // Reset form when modal opens
      setFormData({
        applicationId: '',
        jobs: [],
        hourlyRate: '',
        assignedTo: ''
      });
      setNewService('');
    }
  }, [open]);

  const fetchApplications = async () => {
    try {
      setLoadingApplications(true);
      // We'll need to create an endpoint for approved applications
      // For now, we'll mock some data
      // TODO: Replace with actual API call when applications endpoint is ready
      setApplications([]);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Error",
        description: "Failed to load applications",
        variant: "destructive",
      });
    } finally {
      setLoadingApplications(false);
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
    if (newService.trim() && !formData.jobs.includes(newService.trim())) {
      setFormData(prev => ({
        ...prev,
        jobs: [...prev.jobs, newService.trim()]
      }));
      setNewService('');
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
    
    if (!formData.applicationId || !formData.hourlyRate || !formData.assignedTo || formData.jobs.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.createEmployee({
        applicationId: formData.applicationId,
        jobs: formData.jobs,
        hourlyRate: parseFloat(formData.hourlyRate),
        assignedTo: formData.assignedTo
      });

      if (response.success) {
        toast({
          title: "Success",
          description: "Employee created successfully",
        });
        onClose();
      } else {
        throw new Error(response.error || 'Failed to create employee');
      }
    } catch (error: any) {
      console.error('Error creating employee:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create employee",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
            <DialogDescription>
              Create a new employee from an approved application.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Application Selection */}
            <div className="grid gap-2">
              <Label htmlFor="application">Application *</Label>
              {loadingApplications ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading applications...</span>
                </div>
              ) : (
                <Select 
                  value={formData.applicationId} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, applicationId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an approved application" />
                  </SelectTrigger>
                  <SelectContent>
                    {applications.length === 0 ? (
                      <SelectItem value="none" disabled>
                        No approved applications available
                      </SelectItem>
                    ) : (
                      applications.map((app) => (
                        <SelectItem key={app.id} value={app.id}>
                          {app.firstName} {app.lastName} - {app.email}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
              {applications.length === 0 && !loadingApplications && (
                <p className="text-sm text-gray-500">
                  Note: Employees can only be created from approved applications.
                  For demo purposes, you can use an existing application ID.
                </p>
              )}
            </div>

            {/* Demo Application ID Input (temporary) */}
            <div className="grid gap-2">
              <Label htmlFor="demoAppId">Demo Application ID</Label>
              <Input
                id="demoAppId"
                placeholder="Enter an existing application ID for demo"
                value={formData.applicationId}
                onChange={(e) => setFormData(prev => ({ ...prev, applicationId: e.target.value }))}
              />
            </div>

            {/* Jobs */}
            <div className="grid gap-2">
              <Label>Jobs *</Label>
              <div className="flex gap-2">
                <Select value={newService} onValueChange={setNewService}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select a job" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableJobs.map((job) => (
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
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
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
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Employee'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEmployeeModal;