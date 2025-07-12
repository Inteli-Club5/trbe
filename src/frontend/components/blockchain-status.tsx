"use client";

import { useBlockchain } from "@/hooks/use-blockchain";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Loader2, Wifi, WifiOff } from "lucide-react";

export function BlockchainStatus() {
  const blockchain = useBlockchain();

  if (blockchain.isLoading) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin text-yellow-600" />
            <p className="text-sm">Connecting to blockchain...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!blockchain.isConnected) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-800">
            <WifiOff className="h-5 w-5" />
            <span>Wallet Not Connected</span>
          </CardTitle>
          <CardDescription className="text-red-600">
            Connect your wallet to interact with the blockchain
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={blockchain.connectWallet} variant="outline">
            Connect Wallet
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!blockchain.isCorrectNetwork) {
    return (
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-orange-800">
            <AlertCircle className="h-5 w-5" />
            <span>Wrong Network</span>
          </CardTitle>
          <CardDescription className="text-orange-600">
            Please switch to Chiliz Spicy Testnet to use this app
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Badge variant="destructive">Current: Unknown Network</Badge>
            <Badge variant="default">Required: Chiliz Spicy Testnet</Badge>
          </div>
          <Button onClick={blockchain.switchNetwork} variant="outline">
            Switch to Chiliz Spicy Testnet
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (blockchain.error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-800">
            <AlertCircle className="h-5 w-5" />
            <span>Connection Error</span>
          </CardTitle>
          <CardDescription className="text-red-600">
            {blockchain.error}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry Connection
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-green-800">
          <CheckCircle className="h-5 w-5" />
          <span>Connected to Blockchain</span>
        </CardTitle>
        <CardDescription className="text-green-600">
          Ready to interact with smart contracts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center space-x-2">
          <Wifi className="h-4 w-4 text-green-600" />
          <span className="text-sm">
            <strong>Address:</strong> {blockchain.formatUserAddress(blockchain.address!)}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="default">Chiliz Spicy Testnet</Badge>
          <Badge variant="secondary">Connected</Badge>
        </div>
      </CardContent>
    </Card>
  );
} 