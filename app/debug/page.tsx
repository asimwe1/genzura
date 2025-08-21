"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function DebugPage() {
  const [testResults, setTestResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testDirectFetch = async () => {
    setIsLoading(true);
    try {
      console.log('Testing direct fetch to backend...');
      
      // Test 1: Direct fetch to health endpoint
      const healthResponse = await fetch('https://genzura.aphezis.com/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Health response status:', healthResponse.status);
      console.log('Health response headers:', Object.fromEntries(healthResponse.headers.entries()));
      
      let healthData;
      try {
        healthData = await healthResponse.json();
      } catch (e) {
        healthData = { error: 'No JSON response', text: await healthResponse.text() };
      }
      
      // Test 2: Test login endpoint
      const loginResponse = await fetch('https://genzura.aphezis.com/auth/platform/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@genzura.com',
          password: 'admin123'
        }),
      });
      
      console.log('Login response status:', loginResponse.status);
      console.log('Login response headers:', Object.fromEntries(loginResponse.headers.entries()));
      
      let loginData;
      try {
        loginData = await loginResponse.json();
      } catch (e) {
        loginData = { error: 'No JSON response', text: await loginResponse.text() };
      }
      
      setTestResults({
        timestamp: new Date().toISOString(),
        health: {
          status: healthResponse.status,
          ok: healthResponse.ok,
          data: healthData,
          headers: Object.fromEntries(healthResponse.headers.entries())
        },
        login: {
          status: loginResponse.status,
          ok: loginResponse.ok,
          data: loginData,
          headers: Object.fromEntries(loginResponse.headers.entries())
        }
      });
      
      if (healthResponse.ok) {
        toast.success('Backend is accessible!');
      } else {
        toast.error(`Backend health check failed: ${healthResponse.status}`);
      }
      
    } catch (error) {
      console.error('Test failed:', error);
      setTestResults({
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      toast.error('Backend test failed');
    } finally {
      setIsLoading(false);
    }
  };

  const testCors = async () => {
    setIsLoading(true);
    try {
      console.log('Testing CORS...');
      
      // Test with different methods
      const methods = ['GET', 'POST', 'OPTIONS'];
      const corsResults = {};
      
      for (const method of methods) {
        try {
          const response = await fetch('https://genzura.aphezis.com/health', {
            method,
            headers: {
              'Content-Type': 'application/json',
              'Origin': 'https://genzura-tau.vercel.app'
            },
          });
          
          corsResults[method] = {
            status: response.status,
            ok: response.ok,
            cors: response.headers.get('access-control-allow-origin'),
            allowMethods: response.headers.get('access-control-allow-methods'),
            allowHeaders: response.headers.get('access-control-allow-headers')
          };
        } catch (e) {
          corsResults[method] = { error: e instanceof Error ? e.message : 'Unknown error' };
        }
      }
      
      setTestResults({
        timestamp: new Date().toISOString(),
        cors: corsResults
      });
      
      toast.success('CORS test completed');
      
    } catch (error) {
      console.error('CORS test failed:', error);
      toast.error('CORS test failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">API Debug Page</h1>
          <p className="text-gray-600">Debug the backend connection issues</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button 
            onClick={testDirectFetch} 
            disabled={isLoading}
            className="h-20 text-lg"
          >
            {isLoading ? 'Testing...' : 'Test Direct Backend Connection'}
          </Button>
          
          <Button 
            onClick={testCors} 
            disabled={isLoading}
            variant="outline"
            className="h-20 text-lg"
          >
            {isLoading ? 'Testing...' : 'Test CORS Configuration'}
          </Button>
        </div>

        {testResults && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="secondary">Debug Results</Badge>
                Test Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  <strong>Timestamp:</strong> {testResults.timestamp}
                </div>
                
                {testResults.error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-medium text-red-800 mb-2">Error:</h4>
                    <p className="text-sm text-red-700">{testResults.error}</p>
                    {testResults.stack && (
                      <pre className="text-xs text-red-600 mt-2 overflow-auto">
                        {testResults.stack}
                      </pre>
                    )}
                  </div>
                )}
                
                {testResults.health && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Health Check:</h4>
                    <pre className="text-xs text-blue-700 overflow-auto">
                      {JSON.stringify(testResults.health, null, 2)}
                    </pre>
                  </div>
                )}
                
                {testResults.login && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">Login Test:</h4>
                    <pre className="text-xs text-green-700 overflow-auto">
                      {JSON.stringify(testResults.login, null, 2)}
                    </pre>
                  </div>
                )}
                
                {testResults.cors && (
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <h4 className="font-medium text-purple-800 mb-2">CORS Test:</h4>
                    <pre className="text-xs text-purple-700 overflow-auto">
                      {JSON.stringify(testResults.cors, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Common Issues & Solutions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-600">
            <p><strong>"Failed to Fetch" Error:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Backend server is down or unreachable</li>
              <li>CORS configuration is blocking the request</li>
              <li>Network connectivity issues</li>
              <li>Backend URL is incorrect</li>
            </ul>
            
            <p className="mt-4"><strong>Check Console:</strong> Open browser dev tools to see detailed error messages</p>
            <p><strong>Backend URL:</strong> https://genzura.aphezis.com</p>
            <p><strong>Frontend URL:</strong> https://genzura-tau.vercel.app</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
