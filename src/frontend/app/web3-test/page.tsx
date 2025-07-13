"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useWeb3Operations } from "@/hooks/use-web3-operations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

export default function Web3TestPage() {
  const { user, isAuthenticated, login, logout } = useAuth();
  const { isConnected, address, connectWallet, disconnectWallet, executeOperation } = useWeb3Operations();
  const { toast } = useToast();

  const [testResults, setTestResults] = useState<Record<string, any>>({});

  const testApiCall = async (endpoint: string) => {
    try {
      const result = await executeOperation(async () => {
        const response = await fetch(`/api/${endpoint}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        return await response.json();
      }, `API call to ${endpoint} successful`);
      
      setTestResults((prev: Record<string, any>) => ({ ...prev, [endpoint]: result }));
    } catch (error) {
      console.error(`API test error for ${endpoint}:`, error);
      setTestResults((prev: Record<string, any>) => ({ ...prev, [endpoint]: { error: 'Failed' } }));
    }
  };

  const testLogin = async () => {
    try {
      await login("test@example.com", "password");
      toast({
        title: "Login Test",
        description: "Traditional login successful",
      });
    } catch (error) {
      toast({
        title: "Login Test",
        description: "Traditional login failed",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Web3 Integration Test</h1>
        <p className="text-muted-foreground">
          Test the separation between traditional authentication and Web3 operations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Authentication Status */}
        <Card>
          <CardHeader>
            <CardTitle>Authentication Status</CardTitle>
            <CardDescription>Traditional login system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Status:</span>
              <Badge variant={isAuthenticated ? "default" : "secondary"}>
                {isAuthenticated ? "Authenticated" : "Not Authenticated"}
              </Badge>
            </div>
            
            {user && (
              <div className="space-y-2">
                <div className="text-sm">
                  <strong>User:</strong> {user.firstName} {user.lastName}
                </div>
                <div className="text-sm">
                  <strong>Email:</strong> {user.email}
                </div>
                <div className="text-sm">
                  <strong>Level:</strong> {user.level}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={testLogin} variant="outline">
                Test Login
              </Button>
              <Button onClick={logout} variant="destructive">
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Wallet Status */}
        <Card>
          <CardHeader>
            <CardTitle>Wallet Status</CardTitle>
            <CardDescription>Web3 wallet connection</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Status:</span>
              <Badge variant={isConnected ? "default" : "secondary"}>
                {isConnected ? "Connected" : "Not Connected"}
              </Badge>
            </div>
            
            {address && (
              <div className="text-sm">
                <strong>Address:</strong> {address}
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={connectWallet} variant="outline">
                Connect Wallet
              </Button>
              <Button onClick={disconnectWallet} variant="destructive">
                Disconnect
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* API Tests */}
      <Card>
        <CardHeader>
          <CardTitle>API Tests</CardTitle>
          <CardDescription>Test API calls with wallet signature</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button onClick={() => testApiCall("users/profile")} variant="outline" size="sm">
              Get Profile
            </Button>
            <Button onClick={() => testApiCall("clubs")} variant="outline" size="sm">
              Get Clubs
            </Button>
            <Button onClick={() => testApiCall("events")} variant="outline" size="sm">
              Get Events
            </Button>
            <Button onClick={() => testApiCall("tasks")} variant="outline" size="sm">
              Get Tasks
            </Button>
          </div>

          {Object.keys(testResults).length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Test Results:</h4>
              <pre className="bg-muted p-4 rounded text-xs overflow-auto">
                {JSON.stringify(testResults, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        <p>
          <strong>Note:</strong> This page demonstrates the separation between traditional authentication 
          (email/password) and Web3 operations (wallet connection for blockchain transactions).
        </p>
        <p className="mt-2">
          Users can login normally with email/password, and separately connect their wallet for 
          blockchain operations without needing to sign authentication messages.
        </p>
      </div>
    </div>
  );
} 