const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

class ApiService {
  private baseURL = API_BASE_URL;

  private getAuthHeader(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout(): Promise<ApiResponse> {
    return this.request('/api/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<User>('/api/auth/me');
  }

  // Service Providers
  async getProviders(params?: {
    active?: boolean;
    services?: string[];
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<any[]>> {
    const queryParams = new URLSearchParams();
    
    if (params?.active !== undefined) {
      queryParams.append('active', params.active.toString());
    }
    if (params?.services?.length) {
      params.services.forEach(service => queryParams.append('services', service));
    }
    if (params?.search) {
      queryParams.append('search', params.search);
    }
    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }
    if (params?.limit) {
      queryParams.append('limit', params.limit.toString());
    }

    const query = queryParams.toString();
    return this.request<any[]>(`/api/providers${query ? `?${query}` : ''}`);
  }

  async getProvider(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/api/providers/${id}`);
  }

  async createProvider(data: {
    applicationId: string;
    services: string[];
    hourlyRate: number;
    assignedTo: string;
  }): Promise<ApiResponse<any>> {
    return this.request<any>('/api/providers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProvider(id: string, data: {
    services?: string[];
    hourlyRate?: number;
    assignedTo?: string;
    active?: boolean;
  }): Promise<ApiResponse<any>> {
    return this.request<any>(`/api/providers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProvider(id: string): Promise<ApiResponse> {
    return this.request(`/api/providers/${id}`, {
      method: 'DELETE',
    });
  }

  // Clients
  async getClients(params?: {
    active?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<any[]>> {
    const queryParams = new URLSearchParams();
    
    if (params?.active !== undefined) {
      queryParams.append('active', params.active.toString());
    }
    if (params?.search) {
      queryParams.append('search', params.search);
    }
    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }
    if (params?.limit) {
      queryParams.append('limit', params.limit.toString());
    }

    const query = queryParams.toString();
    return this.request<any[]>(`/api/clients${query ? `?${query}` : ''}`);
  }

  async getClient(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/api/clients/${id}`);
  }

  async createClient(data: {
    companyName: string;
    entity: string;
    street: string;
    suite?: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
    wcClass?: string;
    markupType?: string;
    markupValue?: number;
    commission?: number;
    assignedTo?: string;
    internalNotes?: string;
  }): Promise<ApiResponse<any>> {
    return this.request<any>('/api/clients', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateClient(id: string, data: {
    companyName?: string;
    entity?: string;
    street?: string;
    suite?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    wcClass?: string;
    markupType?: string;
    markupValue?: number;
    commission?: number;
    assignedTo?: string;
    internalNotes?: string;
    active?: boolean;
  }): Promise<ApiResponse<any>> {
    return this.request<any>(`/api/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteClient(id: string): Promise<ApiResponse> {
    return this.request(`/api/clients/${id}`, {
      method: 'DELETE',
    });
  }

  // Suppliers
  async getSuppliers(params?: {
    active?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<any[]>> {
    const queryParams = new URLSearchParams();
    
    if (params?.active !== undefined) {
      queryParams.append('active', params.active.toString());
    }
    if (params?.search) {
      queryParams.append('search', params.search);
    }
    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }
    if (params?.limit) {
      queryParams.append('limit', params.limit.toString());
    }

    const query = queryParams.toString();
    return this.request<any[]>(`/api/suppliers${query ? `?${query}` : ''}`);
  }

  async getSupplier(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/api/suppliers/${id}`);
  }

  async createSupplier(data: {
    companyName: string;
    entity: string;
    street: string;
    suite?: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
    wcClass?: string;
    markupType?: string;
    markupValue?: number;
    commission?: number;
    assignedTo?: string;
    internalNotes?: string;
  }): Promise<ApiResponse<any>> {
    return this.request<any>('/api/suppliers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSupplier(id: string, data: {
    companyName?: string;
    entity?: string;
    street?: string;
    suite?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    wcClass?: string;
    markupType?: string;
    markupValue?: number;
    commission?: number;
    assignedTo?: string;
    internalNotes?: string;
    active?: boolean;
  }): Promise<ApiResponse<any>> {
    return this.request<any>(`/api/suppliers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteSupplier(id: string): Promise<ApiResponse> {
    return this.request(`/api/suppliers/${id}`, {
      method: 'DELETE',
    });
  }

  // Bills
  async getBills(params?: {
    page?: number;
    limit?: number;
    status?: string;
    clientId?: string;
    providerId?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
  }): Promise<ApiResponse<any[]>> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }
    if (params?.limit) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params?.status) {
      queryParams.append('status', params.status);
    }
    if (params?.clientId) {
      queryParams.append('clientId', params.clientId);
    }
    if (params?.providerId) {
      queryParams.append('providerId', params.providerId);
    }
    if (params?.startDate) {
      queryParams.append('startDate', params.startDate);
    }
    if (params?.endDate) {
      queryParams.append('endDate', params.endDate);
    }
    if (params?.search) {
      queryParams.append('search', params.search);
    }

    const query = queryParams.toString();
    return this.request<any[]>(`/api/bills${query ? `?${query}` : ''}`);
  }

  async getBill(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/api/bills/${id}`);
  }

  async createBill(data: {
    clientId: string;
    providerId: string;
    service: string;
    hoursWorked: number;
    serviceRate: number;
    dueDate?: string;
  }): Promise<ApiResponse<any>> {
    return this.request<any>('/api/bills', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBill(id: string, data: {
    service?: string;
    hoursWorked?: number;
    serviceRate?: number;
    status?: string;
    dueDate?: string;
    paidDate?: string;
  }): Promise<ApiResponse<any>> {
    return this.request<any>(`/api/bills/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteBill(id: string): Promise<ApiResponse> {
    return this.request(`/api/bills/${id}`, {
      method: 'DELETE',
    });
  }

  async getBillReports(params?: {
    startDate?: string;
    endDate?: string;
    period?: string;
  }): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();
    
    if (params?.startDate) {
      queryParams.append('startDate', params.startDate);
    }
    if (params?.endDate) {
      queryParams.append('endDate', params.endDate);
    }
    if (params?.period) {
      queryParams.append('period', params.period);
    }

    const query = queryParams.toString();
    return this.request<any>(`/api/bills/reports${query ? `?${query}` : ''}`);
  }

  async generateBillPDF(id: string, billNumber?: string): Promise<void> {
    const token = this.getAuthToken();
    if (!token) {
      throw new Error('No authentication token found. Please login again.');
    }

    try {
      const response = await fetch(`${this.baseURL}/api/bills/${id}/pdf`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to generate PDF: ${response.statusText}`);
      }

      // Get the PDF blob
      const blob = await response.blob();
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `bill-${billNumber || id}.pdf`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      throw error;
    }
  }

  // Applications methods
  async getApplications(params?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const queryParams = new URLSearchParams();
    
    if (params?.status) {
      queryParams.append('status', params.status);
    }
    if (params?.search) {
      queryParams.append('search', params.search);
    }
    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }
    if (params?.limit) {
      queryParams.append('limit', params.limit.toString());
    }

    const query = queryParams.toString();
    return this.request<any>(`/api/applications${query ? `?${query}` : ''}`);
  }

  async getApplication(id: string) {
    return this.request<any>(`/api/applications/${id}`);
  }

  async createApplication(data: any) {
    return this.request<any>('/api/applications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateApplication(id: string, data: any) {
    return this.request<any>(`/api/applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteApplication(id: string) {
    return this.request<any>(`/api/applications/${id}`, {
      method: 'DELETE',
    });
  }

  async getApplicationStats() {
    return this.request<any>('/api/applications/stats');
  }

  // Services methods
  async getServices(params?: {
    active?: boolean;
    page?: number;
    limit?: number;
  }) {
    const queryParams = new URLSearchParams();
    
    if (params?.active !== undefined) {
      queryParams.append('active', params.active.toString());
    }
    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }
    if (params?.limit) {
      queryParams.append('limit', params.limit.toString());
    }

    const query = queryParams.toString();
    return this.request<any>(`/api/services${query ? `?${query}` : ''}`);
  }

  async getService(id: string) {
    return this.request<any>(`/api/services/${id}`);
  }

  async createService(data: any) {
    return this.request<any>('/api/services', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateService(id: string, data: any) {
    return this.request<any>(`/api/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteService(id: string) {
    return this.request<any>(`/api/services/${id}`, {
      method: 'DELETE',
    });
  }

  // Upload methods
  async uploadLicense(file: File): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('license', file);

    const token = this.getAuthToken();
    
    try {
      const response = await fetch(`${this.baseURL}/api/uploads/license`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If JSON parsing fails, use the status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      // Check if response has content
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return response.json();
      } else {
        throw new Error('Server did not return a valid JSON response');
      }
    } catch (error) {
      console.error('Upload request failed:', error);
      throw error;
    }
  }

  getFileUrl(filename: string): string {
    return `${this.baseURL}/api/uploads/files/${filename}`;
  }

  getDownloadUrl(filename: string, originalName?: string): string {
    const url = `${this.baseURL}/api/uploads/download/${filename}`;
    return originalName ? `${url}?originalName=${encodeURIComponent(originalName)}` : url;
  }
}

export const apiService = new ApiService();