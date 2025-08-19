"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api';
import { useOrganizations, useBranches, useEmployees } from '@/hooks/useApi';

export default function ApiTestPage() {
  const [testEmail, setTestEmail] = useState('admin@genzura.com');
  const [testPassword, setTestPassword] = useState('admin123');
  const [authToken, setAuthToken] = useState<string | null>(null);

  // API hooks
  const { data: organizations, execute: fetchOrganizations } = useOrganizations();
  const { data: branches, execute: fetchBranches } = useBranches();
  const { data: employees, execute: fetchEmployees } = useEmployees();

  // Test authentication
  const testAuth = async () => {
    try {
      const response = await apiClient.platformLogin({ email: testEmail, password: testPassword });
      
      if (response.status === 'success' && response.data?.token) {
        setAuthToken(response.data.token);
        toast.success('Authentication successful!');
        console.log('Auth response:', response);
      } else {
        toast.error(response.error || 'Authentication failed');
        console.error('Auth error:', response);
      }
    } catch (error) {
      toast.error('Authentication error occurred');
      console.error('Auth error:', error);
    }
  };

  // Test logout
  const testLogout = () => {
    apiClient.logout();
    setAuthToken(null);
    toast.success('Logged out successfully');
  };

  // Test API calls
  const testApiCalls = async () => {
    if (!authToken) {
      toast.error('Please authenticate first');
      return;
    }

    try {
      // Test organizations
      await fetchOrganizations();
      
      // Test branches
      await fetchBranches();
      
      // Test employees
      await fetchEmployees();
      
      toast.success('API calls completed successfully!');
    } catch (error) {
      toast.error('API calls failed');
      console.error('API error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">API Integration Test</h1>
          <p className="text-gray-600">Test the Rust backend integration with your Next.js frontend</p>
        </div>

        {/* Authentication Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant={authToken ? 'default' : 'secondary'}>
                {authToken ? 'Authenticated' : 'Not Authenticated'}
              </Badge>
              Authentication Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="admin@genzura.com"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={testPassword}
                  onChange={(e) => setTestPassword(e.target.value)}
                  placeholder="admin123"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={testAuth} disabled={!!authToken}>
                Test Login
              </Button>
              {authToken && (
                <Button variant="outline" onClick={testLogout}>
                  Logout
                </Button>
              )}
            </div>
            {authToken && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Token:</strong> {authToken.substring(0, 50)}...
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* API Endpoints Test */}
        <Card>
          <CardHeader>
            <CardTitle>API Endpoints Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={testApiCalls} disabled={!authToken}>
              Test All API Endpoints
            </Button>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Organizations */}
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Organizations</h3>
                {organizations ? (
                  <div className="text-sm text-gray-600">
                    <p>Count: {organizations.length}</p>
                    {organizations.slice(0, 2).map((org) => (
                      <p key={org.id} className="truncate">• {org.name}</p>
                    ))}
                    {organizations.length > 2 && <p>...and {organizations.length - 2} more</p>}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No data loaded</p>
                )}
              </div>

              {/* Branches */}
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Branches</h3>
                {branches ? (
                  <div className="text-sm text-gray-600">
                    <p>Count: {branches.length}</p>
                    {branches.slice(0, 2).map((branch) => (
                      <p key={branch.id} className="truncate">• {branch.name}</p>
                    ))}
                    {branches.length > 2 && <p>...and {branches.length - 2} more</p>}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No data loaded</p>
                )}
              </div>

              {/* Employees */}
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Employees</h3>
                {employees ? (
                  <div className="text-sm text-gray-600">
                    <p>Count: {employees.length}</p>
                    {employees.slice(0, 2).map((employee) => (
                      <p key={employee.id} className="truncate">• {employee.first_name} {employee.last_name}</p>
                    ))}
                    {employees.length > 2 && <p>...and {employees.length - 2} more</p>}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No data loaded</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Connection Status */}
        <Card>
          <CardHeader>
            <CardTitle>Connection Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Frontend: Next.js running</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Backend: Rust API at https://genzura.aphezis.com</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${authToken ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span className="text-sm">Authentication: {authToken ? 'Connected' : 'Not Connected'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Testing Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-600">
            <p>1. <strong>Authenticate:</strong> Use the demo credentials to test login</p>
            <p>2. <strong>Test API:</strong> Click "Test All API Endpoints" to verify backend connectivity</p>
            <p>3. <strong>Check Console:</strong> Open browser dev tools to see detailed API responses</p>
            <p>4. <strong>Verify Data:</strong> Check that organizations, branches, and employees load correctly</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
