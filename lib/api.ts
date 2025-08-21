// API client for Genzura Rust backend
// Base URL: https://genzura.aphezis.com

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
  status: 'success' | 'error';
  offline?: boolean;
  retryAfter?: number;
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
  private isOffline: boolean = false;
  private lastOnlineCheck: number = 0;
  private retryAttempts: number = 0;
  private maxRetries: number = 3;

  constructor(baseUrl: string = 'https://genzura.aphezis.com') {
    this.baseUrl = baseUrl;
    this.token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    
    // Check online status on initialization
    if (typeof window !== 'undefined') {
      this.checkOnlineStatus();
      // Listen for online/offline events
      window.addEventListener('online', () => this.handleOnline());
      window.addEventListener('offline', () => this.handleOffline());
    }
  }

  private async checkOnlineStatus(): Promise<boolean> {
    const now = Date.now();
    // Only check every 30 seconds to avoid excessive requests
    if (now - this.lastOnlineCheck < 30000) {
      return !this.isOffline;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' }
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        this.isOffline = false;
        this.retryAttempts = 0;
        this.lastOnlineCheck = now;
        return true;
      } else {
        this.isOffline = true;
        return false;
      }
    } catch (error) {
      this.isOffline = true;
      this.lastOnlineCheck = now;
      return false;
    }
  }

  private handleOnline(): void {
    this.isOffline = false;
    this.retryAttempts = 0;
    console.log('Network connection restored');
  }

  private handleOffline(): void {
    this.isOffline = true;
    console.log('Network connection lost');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    // Check if we're offline first
    if (this.isOffline) {
      const online = await this.checkOnlineStatus();
      if (!online) {
        return {
          status: 'error',
          error: 'You are currently offline. Please check your internet connection and try again.',
          offline: true,
          retryAfter: 30
        };
      }
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    // Retry logic for failed requests
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        console.log(`Making API request to: ${url} (attempt ${attempt}/${this.maxRetries})`);
        
        // Add timeout to the request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
        
        const response = await fetch(url, {
          ...options,
          headers,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        console.log(`Response status: ${response.status} ${response.statusText}`);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Backend error response:', errorData);
          const errorMessage = errorData.message || errorData.error || `HTTP error! status: ${response.status}`;
          
          // Don't retry on client errors (4xx)
          if (response.status >= 400 && response.status < 500) {
            return {
              status: 'error',
              error: errorMessage,
            };
          }
          
          // Retry on server errors (5xx) or network issues
          if (attempt < this.maxRetries) {
            console.log(`Request failed, retrying in ${attempt * 2} seconds...`);
            await new Promise(resolve => setTimeout(resolve, attempt * 2000));
            continue;
          }
          
          return {
            status: 'error',
            error: errorMessage,
          };
        }

        const data = await response.json();
        console.log('Backend response data:', data);
        
        // Reset offline status on successful request
        this.isOffline = false;
        this.retryAttempts = 0;
        
        // Check if the response has the expected structure
        if (data.token && data.user) {
          // Standard login response
          return {
            status: 'success',
            data: data,
          };
        } else if (data.data) {
          // Response wrapped in data field
          return {
            status: 'success',
            data: data.data,
          };
        } else if (Array.isArray(data)) {
          // Direct array response (e.g., for lists)
          return {
            status: 'success',
            data: data,
          };
        } else if (data.id) {
          // Single object response
          return {
            status: 'success',
            data: data,
          };
        } else {
          // Generic success response
          return {
            status: 'success',
            data: data,
          };
        }
      } catch (error) {
        console.error(`API request failed (attempt ${attempt}/${this.maxRetries}):`, error);
        
        // Handle timeout errors
        if (error instanceof Error && error.name === 'AbortError') {
          if (attempt < this.maxRetries) {
            console.log(`Request timeout, retrying in ${attempt * 2} seconds...`);
            await new Promise(resolve => setTimeout(resolve, attempt * 2000));
            continue;
          }
          
          this.isOffline = true;
          return {
            status: 'error',
            error: 'Request timeout: The server took too long to respond. Please try again.',
            offline: true,
            retryAfter: 15
          };
        }
        
        // Handle specific network errors
        if (error instanceof TypeError && error.message.includes('fetch')) {
          if (attempt < this.maxRetries) {
            console.log(`Network error, retrying in ${attempt * 2} seconds...`);
            await new Promise(resolve => setTimeout(resolve, attempt * 2000));
            continue;
          }
          
          this.isOffline = true;
          return {
            status: 'error',
            error: 'Network error: Unable to connect to the backend server. Please check your internet connection and try again.',
            offline: true,
            retryAfter: 30
          };
        }
        
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
          if (attempt < this.maxRetries) {
            console.log(`Connection failed, retrying in ${attempt * 2} seconds...`);
            await new Promise(resolve => setTimeout(resolve, attempt * 2000));
            continue;
          }
          
          this.isOffline = true;
          return {
            status: 'error',
            error: 'Connection failed: The backend server is not accessible. Please try again later or contact support.',
            offline: true,
            retryAfter: 60
          };
        }
        
        // If we've exhausted all retries, return the error
        if (attempt === this.maxRetries) {
          return {
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error occurred',
          };
        }
      }
    }
    
    return {
      status: 'error',
      error: 'Maximum retry attempts exceeded',
    };
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

  async signup(signupData: {
    organizationName: string;
    email: string;
    password: string;
    businessType: string;
    businessCategory: string;
  }): Promise<ApiResponse<LoginResponse>> {
    const response = await this.request<LoginResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        organization: {
          name: signupData.organizationName,
          tier: 'Basic',
          subscription_start: new Date().toISOString().split('T')[0],
          subscription_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        },
        user: {
          email: signupData.email,
          password: signupData.password,
          role: 'SuperAdmin',
        },
        business_type: signupData.businessType,
        business_category: signupData.businessCategory,
      }),
    });

    if (response.status === 'success' && response.data?.token) {
      this.token = response.data.token;
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userRole', response.data.user.role);
        localStorage.setItem('organizationId', response.data.user.organization_id?.toString() || '');
        localStorage.setItem('businessType', signupData.businessType);
        localStorage.setItem('organizationName', signupData.organizationName);
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

  // Method to validate credentials before sending to backend
  validateCredentials(email: string, password: string): { isValid: boolean; error?: string } {
    if (!email || !password) {
      return { isValid: false, error: 'Email and password are required' };
    }
    
    if (!email.includes('@')) {
      return { isValid: false, error: 'Please enter a valid email address' };
    }
    
    if (password.length < 3) {
      return { isValid: false, error: 'Password must be at least 3 characters long' };
    }

    return { isValid: true };
  }

  // Password Reset
  async forgotPassword(email: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, new_password: newPassword }),
    });
  }

  async verifyResetToken(token: string): Promise<ApiResponse<{ email: string }>> {
    return this.request<{ email: string }>('/auth/verify-reset-token', {
      method: 'GET',
    });
  }

  // Token Refresh
  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    const response = await this.request<{ token: string }>('/auth/refresh', {
      method: 'POST',
    });

    if (response.status === 'success' && response.data?.token) {
      this.token = response.data.token;
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', response.data.token);
      }
    }

    return response;
  }

  // Health Check
  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string; version?: string }>> {
    return this.request<{ status: string; timestamp: string; version?: string }>('/health');
  }

  // Get current offline status
  getOfflineStatus(): boolean {
    return this.isOffline;
  }

  // Force check online status
  async forceCheckOnline(): Promise<boolean> {
    this.lastOnlineCheck = 0;
    return await this.checkOnlineStatus();
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
