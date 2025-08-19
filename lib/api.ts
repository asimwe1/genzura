// API client for Genzura Rust backend
// Base URL: https://genzura.aphezis.com

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
  status: 'success' | 'error';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    role: string;
    organization_id?: number;
  };
}

export interface Organization {
  id: number;
  name: string;
  tier: string;
  subscription_start: string;
  subscription_end: string;
  created_at: string;
  updated_at: string;
}

export interface Branch {
  id: number;
  name: string;
  location: string;
  phone: string;
  email: string;
  manager_id?: number;
  organization_id: number;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  job_title: string;
  basic_salary: string;
  hire_date: string;
  status: 'active' | 'inactive';
  branch_id?: number;
  organization_id: number;
  created_at: string;
  updated_at: string;
}

export interface CreateOrganizationRequest {
  name: string;
  tier: string;
  subscription_start: string;
  subscription_end: string;
}

export interface CreateBranchRequest {
  name: string;
  location: string;
  phone: string;
  email: string;
  manager_id?: number;
}

export interface CreateEmployeeRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  job_title: string;
  basic_salary: string;
  hire_date: string;
  branch_id?: number;
}

export interface UpdateOrganizationRequest extends Partial<CreateOrganizationRequest> {}
export interface UpdateBranchRequest extends Partial<CreateBranchRequest> {}
export interface UpdateEmployeeRequest extends Partial<CreateEmployeeRequest> {}

class ApiClient {
  private baseUrl: string;
  private token: string | null;

  constructor(baseUrl: string = 'https://genzura.aphezis.com') {
    this.baseUrl = baseUrl;
    this.token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Authentication
  async platformLogin(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await this.request<LoginResponse>('/auth/platform/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.status === 'success' && response.data?.token) {
      this.token = response.data.token;
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userRole', 'platform_admin');
      }
    }

    return response;
  }

  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.status === 'success' && response.data?.token) {
      this.token = response.data.token;
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userRole', response.data.user.role);
        localStorage.setItem('organizationId', response.data.user.organization_id?.toString() || '');
      }
    }

    return response;
  }

  logout(): void {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('organizationId');
    }
  }

  // Organizations
  async createOrganization(data: CreateOrganizationRequest): Promise<ApiResponse<Organization>> {
    return this.request<Organization>('/organizations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getOrganizations(): Promise<ApiResponse<Organization[]>> {
    return this.request<Organization[]>('/organizations');
  }

  async getOrganization(id: number): Promise<ApiResponse<Organization>> {
    return this.request<Organization>(`/organizations/${id}`);
  }

  async updateOrganization(id: number, data: UpdateOrganizationRequest): Promise<ApiResponse<Organization>> {
    return this.request<Organization>(`/organizations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteOrganization(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/organizations/${id}`, {
      method: 'DELETE',
    });
  }

  // Branches
  async createBranch(data: CreateBranchRequest): Promise<ApiResponse<Branch>> {
    return this.request<Branch>('/branches', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getBranches(limit?: number, offset?: number): Promise<ApiResponse<Branch[]>> {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    
    const query = params.toString();
    const endpoint = query ? `/branches?${query}` : '/branches';
    
    return this.request<Branch[]>(endpoint);
  }

  async getBranch(id: number): Promise<ApiResponse<Branch>> {
    return this.request<Branch>(`/branches/${id}`);
  }

  async updateBranch(id: number, data: UpdateBranchRequest): Promise<ApiResponse<Branch>> {
    return this.request<Branch>(`/branches/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteBranch(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/branches/${id}`, {
      method: 'DELETE',
    });
  }

  async getBranchEmployees(branchId: number): Promise<ApiResponse<Employee[]>> {
    return this.request<Employee[]>(`/branches/${branchId}/employees`);
  }

  // Employees
  async createEmployee(data: CreateEmployeeRequest): Promise<ApiResponse<Employee>> {
    return this.request<Employee>('/employees', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getEmployees(limit?: number, offset?: number, branchId?: number): Promise<ApiResponse<Employee[]>> {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    if (branchId) params.append('branch_id', branchId.toString());
    
    const query = params.toString();
    const endpoint = query ? `/employees?${query}` : '/employees';
    
    return this.request<Employee[]>(endpoint);
  }

  async getEmployee(id: number): Promise<ApiResponse<Employee>> {
    return this.request<Employee>(`/employees/${id}`);
  }

  async updateEmployee(id: number, data: UpdateEmployeeRequest): Promise<ApiResponse<Employee>> {
    return this.request<Employee>(`/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteEmployee(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/employees/${id}`, {
      method: 'DELETE',
    });
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.token;
  }

  getUserRole(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userRole');
    }
    return null;
  }

  getOrganizationId(): number | null {
    if (typeof window !== 'undefined') {
      const id = localStorage.getItem('organizationId');
      return id ? parseInt(id, 10) : null;
    }
    return null;
  }

  setToken(token: string): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export types for use in components
export type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  Organization,
  Branch,
  Employee,
  CreateOrganizationRequest,
  CreateBranchRequest,
  CreateEmployeeRequest,
  UpdateOrganizationRequest,
  UpdateBranchRequest,
  UpdateEmployeeRequest,
};
