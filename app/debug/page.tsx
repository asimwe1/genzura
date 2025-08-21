"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api';
import { useOrganizations, useBranches, useEmployees, useHealthCheck } from '@/hooks/useApi';

export default function DebugPage() {
  const [testEmail, setTestEmail] = useState('admin@genzura.com');
  const [testPassword, setTestPassword] = useState('admin123');
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [connectionTest, setConnectionTest] = useState<any>(null);
  const [apiLogs, setApiLogs] = useState<string[]>([]);

  // API hooks
  const { data: organizations, execute: fetchOrganizations } = useOrganizations();
  const { data: branches, execute: fetchBranches } = useBranches();
  const { data: employees, execute: fetchEmployees } = useEmployees();
  const { execute: healthCheck } = useHealthCheck();

  const addLog = (message: string) => {
    setApiLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // Test basic connection to backend
  const testConnection = async () => {
    addLog('Testing backend connection...');
    try {
      const response = await healthCheck();
      
      if (response?.status === 'success') {
        setConnectionTest({
          status: 200,
          ok: true,
          data: response.data,
          timestamp: new Date().toISOString()
        });
        addLog('✅ Backend connection successful!');
        toast.success('Backend connection successful!');
      } else {
        setConnectionTest({
          status: 500,
          ok: false,
          error: response?.error || 'Health check failed',
          timestamp: new Date().toISOString()
        });
        addLog('❌ Backend connection failed');
        toast.error('Backend connection failed');
      }
    } catch (error) {
      setConnectionTest({
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
      addLog(`❌ Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      toast.error('Backend connection failed');
    }
  };

  // Test authentication
  const testAuth = async () => {
    addLog('Testing platform admin authentication...');
    try {
      const response = await apiClient.platformLogin({ email: testEmail, password: testPassword });
      
      if (response.status === 'success' && response.data?.token) {
        setAuthToken(response.data.token);
        addLog('✅ Authentication successful!');
        toast.success('Authentication successful!');
        console.log('Auth response:', response);
      } else {
        addLog(`❌ Authentication failed: ${response.error}`);
        toast.error(response.error || 'Authentication failed');
        console.error('Auth error:', response);
      }
    } catch (error) {
      addLog(`❌ Authentication error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      toast.error('Authentication error occurred');
      console.error('Auth error:', error);
    }
  };

  // Test logout
  const testLogout = () => {
    apiClient.logout();
    setAuthToken(null);
    addLog('✅ Logged out successfully');
    toast.success('Logged out successfully');
  };

  // Test API calls
  const testApiCalls = async () => {
    if (!authToken) {
      addLog('❌ Please authenticate first');
      toast.error('Please authenticate first');
      return;
    }

    addLog('Testing API calls...');
    try {
      // Test organizations
      addLog('Fetching organizations...');
      await fetchOrganizations();
      addLog('✅ Organizations fetched successfully');
      
      // Test branches
      addLog('Fetching branches...');
      await fetchBranches();
      addLog('✅ Branches fetched successfully');
      
      // Test employees
      addLog('Fetching employees...');
      await fetchEmployees();
      addLog('✅ Employees fetched successfully');
      
      addLog('✅ All API calls completed successfully!');
      toast.success('API calls completed successfully!');
    } catch (error) {
      addLog(`❌ API calls failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      toast.error('API calls failed');
      console.error('API error:', error);
    }
  };

  // Clear logs
  const clearLogs = () => {
    setApiLogs([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Backend Debug & Testing</h1>
          <p className="text-lg text-gray-600">Test backend connectivity and API endpoints</p>
        </div>

        {/* Connection Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🔗 Connection Test
              {connectionTest && (
                <Badge variant={connectionTest.ok ? "default" : "destructive"}>
                  {connectionTest.ok ? "Online" : "Offline"}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={testConnection} className="w-full">
              Test Backend Connection
            </Button>
            
            {connectionTest && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Connection Result:</h4>
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                  {JSON.stringify(connectionTest, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Authentication Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🔐 Authentication Test
              {authToken && <Badge variant="default">Authenticated</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="testEmail">Email</Label>
                <Input
                  id="testEmail"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="admin@genzura.com"
                />
              </div>
              <div>
                <Label htmlFor="testPassword">Password</Label>
                <Input
                  id="testPassword"
                  type="password"
                  value={testPassword}
                  onChange={(e) => setTestPassword(e.target.value)}
                  placeholder="admin123"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={testAuth} className="flex-1">
                Test Authentication
              </Button>
              <Button onClick={testLogout} variant="outline">
                Logout
              </Button>
            </div>
            
            {authToken && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Authentication Successful!</h4>
                <p className="text-sm text-green-700">
                  Token: {authToken.substring(0, 20)}...
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* API Test */}
        <Card>
          <CardHeader>
            <CardTitle>📡 API Endpoints Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={testApiCalls} disabled={!authToken} className="w-full">
              Test All API Endpoints
            </Button>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Organizations</h4>
                <p className="text-sm text-blue-700">
                  {organizations ? `${organizations.length} found` : 'Not fetched'}
                </p>
              </div>
              
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Branches</h4>
                <p className="text-sm text-green-700">
                  {branches ? `${branches.length} found` : 'Not fetched'}
                </p>
              </div>
              
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="font-medium text-purple-800 mb-2">Employees</h4>
                <p className="text-sm text-purple-700">
                  {employees ? `${employees.length} found` : 'Not fetched'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              📋 API Logs
              <Button onClick={clearLogs} variant="outline" size="sm">
                Clear Logs
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 overflow-y-auto bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
              {apiLogs.length === 0 ? (
                <p className="text-gray-500">No logs yet. Run some tests to see activity.</p>
              ) : (
                apiLogs.map((log, index) => (
                  <div key={index} className="mb-1">
                    {log}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Troubleshooting Guide */}
        <Card>
          <CardHeader>
            <CardTitle>🔧 Troubleshooting Guide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2">Connection Issues</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Check internet connection</li>
                  <li>• Verify backend server is running</li>
                  <li>• Check CORS configuration</li>
                  <li>• Try different network</li>
                </ul>
              </div>
              
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-medium text-red-800 mb-2">Authentication Issues</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Verify credentials are correct</li>
                  <li>• Check if account exists</li>
                  <li>• Ensure backend auth is working</li>
                  <li>• Check token expiration</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
