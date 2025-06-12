const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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
  private getAuthHeader(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
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
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout(): Promise<ApiResponse> {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/me');
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
    return this.request<any[]>(`/providers${query ? `?${query}` : ''}`);
  }

  async getProvider(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/providers/${id}`);
  }

  async createProvider(data: {
    applicationId: string;
    services: string[];
    hourlyRate: number;
    assignedTo: string;
  }): Promise<ApiResponse<any>> {
    return this.request<any>('/providers', {
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
    return this.request<any>(`/providers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProvider(id: string): Promise<ApiResponse> {
    return this.request(`/providers/${id}`, {
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
    return this.request<any[]>(`/clients${query ? `?${query}` : ''}`);
  }

  async getClient(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/clients/${id}`);
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
    return this.request<any>('/clients', {
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
    return this.request<any>(`/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteClient(id: string): Promise<ApiResponse> {
    return this.request(`/clients/${id}`, {
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
    return this.request<any[]>(`/suppliers${query ? `?${query}` : ''}`);
  }

  async getSupplier(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/suppliers/${id}`);
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
    return this.request<any>('/suppliers', {
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
    return this.request<any>(`/suppliers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteSupplier(id: string): Promise<ApiResponse> {
    return this.request(`/suppliers/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();