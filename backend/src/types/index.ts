// Common types and interfaces

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// User types
export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
}

// Application types
export type ApplicationStatus = 'pending' | 'approved' | 'rejected';
export type GenderType = 'Male' | 'Female' | 'Other';

export interface Application {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  ssn: string;
  gender: GenderType;
  englishLevel: number;
  hasDriversLicense: boolean;
  licenseFileUrl?: string;
  workExperience: string[];
  additionalExperience?: string;
  previousCompanyName?: string;
  previousCompanyPhone?: string;
  previousCompanyEmail?: string;
  address1: string;
  suite?: string;
  city: string;
  state: string;
  zipCode: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  howDidYouHear: string;
  status: ApplicationStatus;
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
}

export interface CreateApplicationRequest extends Omit<Application, 'id' | 'status' | 'submittedAt' | 'reviewedAt' | 'reviewedBy'> {}

export interface UpdateApplicationStatusRequest {
  status: ApplicationStatus;
  reviewedBy: string;
}

export interface ApplicationFilters {
  status?: ApplicationStatus;
  search?: string;
  page?: number;
  limit?: number;
}

// Service Provider types
export interface ServiceProvider {
  id: string;
  applicationId: string;
  services: string[];
  hourlyRate: number;
  assignedTo: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Joined data from application
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  englishLevel?: number;
  hasLicense?: boolean;
}

export interface CreateServiceProviderRequest {
  applicationId: string;
  services: string[];
  hourlyRate: number;
  assignedTo: string;
}

// Company types (clients and suppliers)
export type EntityType = 'Corporation' | 'LLC' | 'Partnership';
export type MarkupType = 'Percent' | 'Dollar';
export type CompanyType = 'client' | 'supplier';

export interface Company {
  id: string;
  companyName: string;
  entity: EntityType;
  type: CompanyType;
  street: string;
  suite?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  wcClass?: string;
  markupType?: MarkupType;
  markupValue?: number;
  commission?: number;
  assignedTo?: string;
  internalNotes?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCompanyRequest extends Omit<Company, 'id' | 'createdAt' | 'updatedAt'> {}

// Bill types
export type BillStatus = 'Paid' | 'Pending' | 'Overdue';

export interface Bill {
  id: string;
  billNumber: string;
  clientId: string;
  providerId: string;
  service: string;
  hoursWorked: number;
  serviceRate: number;
  totalClient: number;
  totalProvider: number;
  status: BillStatus;
  dueDate?: Date;
  paidDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  // Joined data
  clientName?: string;
  providerName?: string;
}

export interface CreateBillRequest extends Omit<Bill, 'id' | 'billNumber' | 'createdAt' | 'updatedAt'> {}

// Filter types
export interface ApplicationFilters {
  status?: ApplicationStatus;
  englishLevel?: number;
  hasLicense?: boolean;
  search?: string;
}

export interface ProviderFilters {
  active?: boolean;
  services?: string[];
  search?: string;
}

export interface CompanyFilters {
  active?: boolean;
  type?: CompanyType;
  search?: string;
}

export interface BillFilters {
  status?: BillStatus;
  clientId?: string;
  providerId?: string;
  dateFrom?: string;
  dateTo?: string;
}