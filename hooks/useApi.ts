import { useState, useCallback, useRef } from 'react';
import { apiClient, ApiResponse } from '@/lib/api';

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<ApiResponse<T> | null>;
  reset: () => void;
  setData: (data: T) => void;
}

export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<ApiResponse<T>>,
  initialData: T | null = null
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: initialData,
    loading: false,
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const execute = useCallback(
    async (...args: any[]): Promise<ApiResponse<T> | null> => {
      // Cancel previous request if it exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const response = await apiFunction(...args);

        if (response.status === 'success') {
          setState(prev => ({
            ...prev,
            data: response.data || null,
            loading: false,
            error: null,
          }));
        } else {
          setState(prev => ({
            ...prev,
            loading: false,
            error: response.error || 'Operation failed',
          }));
        }

        return response;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred';
        setState(prev => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));
        return null;
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({
      data: initialData,
      loading: false,
      error: null,
    });
  }, [initialData]);

  const setData = useCallback((data: T) => {
    setState(prev => ({ ...prev, data }));
  }, []);

  return {
    ...state,
    execute,
    reset,
    setData,
  };
}

// Specialized hooks for common operations
export function useLogin() {
  return useApi(apiClient.login.bind(apiClient));
}

export function usePlatformLogin() {
  return useApi(apiClient.platformLogin.bind(apiClient));
}

export function useSignup() {
  return useApi(apiClient.signup.bind(apiClient));
}

export function useOrganizations() {
  return useApi(apiClient.getOrganizations.bind(apiClient));
}

export function useOrganization(id: number | null) {
  const fetchOrganization = useCallback(
    async () => {
      if (!id) return { status: 'error', error: 'No organization ID provided' };
      return apiClient.getOrganization(id);
    },
    [id]
  );
  
  return useApi(fetchOrganization);
}

export function useBranches(limit?: number, offset?: number) {
  return useApi(apiClient.getBranches.bind(apiClient, limit, offset));
}

export function useBranch(id: number | null) {
  const fetchBranch = useCallback(
    async () => {
      if (!id) return { status: 'error', error: 'No branch ID provided' };
      return apiClient.getBranch(id);
    },
    [id]
  );
  
  return useApi(fetchBranch);
}

export function useEmployees(limit?: number, offset?: number, branchId?: number) {
  return useApi(apiClient.getEmployees.bind(apiClient, limit, offset, branchId));
}

export function useEmployee(id: number | null) {
  const fetchEmployee = useCallback(
    async () => {
      if (!id) return { status: 'error', error: 'No employee ID provided' };
      return apiClient.getEmployee(id);
    },
    [id]
  );
  
  return useApi(fetchEmployee);
}

export function useBranchEmployees(branchId: number | null) {
  const fetchBranchEmployees = useCallback(
    async () => {
      if (!branchId) return { status: 'error', error: 'No branch ID provided' };
      return apiClient.getBranchEmployees(branchId);
    },
    [branchId]
  );
  
  return useApi(fetchBranchEmployees);
}

// Mutation hooks for create/update/delete operations
export function useCreateOrganization() {
  return useApi(apiClient.createOrganization.bind(apiClient));
}

export function useUpdateOrganization() {
  return useApi(apiClient.updateOrganization.bind(apiClient));
}

export function useDeleteOrganization() {
  return useApi(apiClient.deleteOrganization.bind(apiClient));
}

export function useCreateBranch() {
  return useApi(apiClient.createBranch.bind(apiClient));
}

export function useUpdateBranch() {
  return useApi(apiClient.updateBranch.bind(apiClient));
}

export function useDeleteBranch() {
  return useApi(apiClient.deleteBranch.bind(apiClient));
}

export function useCreateEmployee() {
  return useApi(apiClient.createEmployee.bind(apiClient));
}

export function useUpdateEmployee() {
  return useApi(apiClient.updateEmployee.bind(apiClient));
}

export function useDeleteEmployee() {
  return useApi(apiClient.deleteEmployee.bind(apiClient));
}

// Password Reset hooks
export function useForgotPassword() {
  return useApi(apiClient.forgotPassword.bind(apiClient));
}

export function useResetPassword() {
  return useApi(apiClient.resetPassword.bind(apiClient));
}

export function useVerifyResetToken() {
  return useApi(apiClient.verifyResetToken.bind(apiClient));
}

// Token refresh hook
export function useRefreshToken() {
  return useApi(apiClient.refreshToken.bind(apiClient));
}

// Health check hook
export function useHealthCheck() {
  return useApi(apiClient.healthCheck.bind(apiClient));
}
