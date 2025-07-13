"use client";

import { useState, useEffect } from "react";
import { useWeb3Api } from "@/hooks/use-web3-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

export default function Web3DemoPage() {
  const {
    isConnected,
    address,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    healthCheck,
    getUserProfile,
    getClubs,
    getEvents,
    getTasks,
    getBadges,
    getFanClubs,
    getReputation,
    createFanClub,
    joinFanClub,
    leaveFanClub,
    createEvent,
    createTask,
    createBadge,
    calculateReputation,
    deployNFTBadge,
    mintNFTBadge,
    createMarketplace,
    listMarketplaceItem,
    getMarketplaceItems,
  } = useWeb3Api();

  const { toast } = useToast();
  const [results, setResults] = useState<any>({});
  const [formData, setFormData] = useState({
    fanClubId: "",
    price: "",
    eventName: "",
    eventDescription: "",
    taskTitle: "",
    taskDescription: "",
    badgeName: "",
    badgeDescription: "",
    nftName: "",
    nftSymbol: "",
    nftBaseURI: "",
    marketplaceTokenAddress: "",
    nftAddress: "",
    tokenId: "",
    listPrice: "",
  });

  // Test all API functions
  const testAllFunctions = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    const testResults: any = {};

    try {
      // Health check
      testResults.health = await healthCheck();
      
      // Get user profile
      testResults.profile = await getUserProfile();
      
      // Get clubs
      testResults.clubs = await getClubs();
      
      // Get events
      testResults.events = await getEvents();
      
      // Get tasks
      testResults.tasks = await getTasks();
      
      // Get badges
      testResults.badges = await getBadges();
      
      // Get fan clubs
      testResults.fanClubs = await getFanClubs();
      
      // Get reputation
      if (address) {
        testResults.reputation = await getReputation(address);
      }

      setResults(testResults);
      
      toast({
        title: "Test Complete",
        description: "All API functions tested successfully",
      });
    } catch (error) {
      console.error("Test failed:", error);
      toast({
        title: "Test Failed",
        description: "Some API functions failed",
        variant: "destructive",
      });
    }
  };

  const handleFormSubmit = async (action: string) => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    try {
      let result;
      
      switch (action) {
        case "createFanClub":
          result = await createFanClub(formData.fanClubId, formData.price);
          break;
        case "joinFanClub":
          result = await joinFanClub(formData.fanClubId);
          break;
        case "leaveFanClub":
          result = await leaveFanClub(formData.fanClubId);
          break;
        case "createEvent":
          result = await createEvent({
            name: formData.eventName,
            description: formData.eventDescription,
            date: new Date().toISOString(),
          });
          break;
        case "createTask":
          result = await createTask({
            title: formData.taskTitle,
            description: formData.taskDescription,
            points: 100,
          });
          break;
        case "createBadge":
          result = await createBadge({
            name: formData.badgeName,
            description: formData.badgeDescription,
            imageUrl: "https://example.com/badge.png",
          });
          break;
        case "calculateReputation":
          result = await calculateReputation({
            likes: 10,
            comments: 5,
            retweets: 3,
            hashtag: 2,
            checkEvents: 1,
            gamesId: 1,
            reports: 0,
          });
          break;
        case "deployNFTBadge":
          result = await deployNFTBadge(
            formData.nftName,
            formData.nftSymbol,
            formData.nftBaseURI
          );
          break;
        case "createMarketplace":
          result = await createMarketplace(formData.fanClubId, formData.marketplaceTokenAddress);
          break;
        case "listMarketplaceItem":
          result = await listMarketplaceItem(
            formData.fanClubId,
            formData.nftAddress,
            parseInt(formData.tokenId),
            formData.listPrice
          );
          break;
        case "getMarketplaceItems":
          result = await getMarketplaceItems(formData.fanClubId);
          break;
        default:
          throw new Error("Unknown action");
      }

      if (result) {
        setResults(prev => ({ ...prev, [action]: result }));
        toast({
          title: "Success",
          description: `${action} completed successfully`,
        });
      }
    } catch (error: any) {
      console.error(`${action} failed:`, error);
      toast({
        title: "Error",
        description: error.message || `${action} failed`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Web3 API Demo</h1>
          <p className="text-muted-foreground">
            Test all Web3 functions with wallet authentication
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {isConnected ? (
            <>
              <Badge variant="secondary">{address}</Badge>
              <Button onClick={disconnectWallet} variant="outline">
                Disconnect
              </Button>
            </>
          ) : (
            <Button onClick={connectWallet}>Connect Wallet</Button>
          )}
        </div>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">Error: {error}</p>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-4">
        <Button 
          onClick={testAllFunctions} 
          disabled={!isConnected || isLoading}
          className="flex-1"
        >
          {isLoading ? "Testing..." : "Test All API Functions"}
        </Button>
      </div>

      <Tabs defaultValue="forms" className="space-y-4">
        <TabsList>
          <TabsTrigger value="forms">Forms</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="forms" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Fan Club Operations */}
            <Card>
              <CardHeader>
                <CardTitle>Fan Club Operations</CardTitle>
                <CardDescription>Create and manage fan clubs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fanClubId">Fan Club ID</Label>
                  <Input
                    id="fanClubId"
                    value={formData.fanClubId}
                    onChange={(e) => setFormData(prev => ({ ...prev, fanClubId: e.target.value }))}
                    placeholder="club-123"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (ETH)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="0.1"
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleFormSubmit("createFanClub")}
                    size="sm"
                    className="flex-1"
                  >
                    Create
                  </Button>
                  <Button 
                    onClick={() => handleFormSubmit("joinFanClub")}
                    size="sm"
                    variant="outline"
                    className="flex-1"
                  >
                    Join
                  </Button>
                  <Button 
                    onClick={() => handleFormSubmit("leaveFanClub")}
                    size="sm"
                    variant="outline"
                    className="flex-1"
                  >
                    Leave
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Event Operations */}
            <Card>
              <CardHeader>
                <CardTitle>Event Operations</CardTitle>
                <CardDescription>Create and manage events</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="eventName">Event Name</Label>
                  <Input
                    id="eventName"
                    value={formData.eventName}
                    onChange={(e) => setFormData(prev => ({ ...prev, eventName: e.target.value }))}
                    placeholder="Championship Final"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eventDescription">Description</Label>
                  <Textarea
                    id="eventDescription"
                    value={formData.eventDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, eventDescription: e.target.value }))}
                    placeholder="Event description..."
                  />
                </div>
                <Button 
                  onClick={() => handleFormSubmit("createEvent")}
                  className="w-full"
                >
                  Create Event
                </Button>
              </CardContent>
            </Card>

            {/* Task Operations */}
            <Card>
              <CardHeader>
                <CardTitle>Task Operations</CardTitle>
                <CardDescription>Create and manage tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="taskTitle">Task Title</Label>
                  <Input
                    id="taskTitle"
                    value={formData.taskTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, taskTitle: e.target.value }))}
                    placeholder="Complete Profile"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taskDescription">Description</Label>
                  <Textarea
                    id="taskDescription"
                    value={formData.taskDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, taskDescription: e.target.value }))}
                    placeholder="Task description..."
                  />
                </div>
                <Button 
                  onClick={() => handleFormSubmit("createTask")}
                  className="w-full"
                >
                  Create Task
                </Button>
              </CardContent>
            </Card>

            {/* Badge Operations */}
            <Card>
              <CardHeader>
                <CardTitle>Badge Operations</CardTitle>
                <CardDescription>Create and manage badges</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="badgeName">Badge Name</Label>
                  <Input
                    id="badgeName"
                    value={formData.badgeName}
                    onChange={(e) => setFormData(prev => ({ ...prev, badgeName: e.target.value }))}
                    placeholder="Super Fan"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="badgeDescription">Description</Label>
                  <Textarea
                    id="badgeDescription"
                    value={formData.badgeDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, badgeDescription: e.target.value }))}
                    placeholder="Badge description..."
                  />
                </div>
                <Button 
                  onClick={() => handleFormSubmit("createBadge")}
                  className="w-full"
                >
                  Create Badge
                </Button>
              </CardContent>
            </Card>

            {/* NFT Badge Operations */}
            <Card>
              <CardHeader>
                <CardTitle>NFT Badge Operations</CardTitle>
                <CardDescription>Deploy and mint NFT badges</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nftName">NFT Name</Label>
                  <Input
                    id="nftName"
                    value={formData.nftName}
                    onChange={(e) => setFormData(prev => ({ ...prev, nftName: e.target.value }))}
                    placeholder="Fan Badge"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nftSymbol">Symbol</Label>
                  <Input
                    id="nftSymbol"
                    value={formData.nftSymbol}
                    onChange={(e) => setFormData(prev => ({ ...prev, nftSymbol: e.target.value }))}
                    placeholder="FAN"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nftBaseURI">Base URI</Label>
                  <Input
                    id="nftBaseURI"
                    value={formData.nftBaseURI}
                    onChange={(e) => setFormData(prev => ({ ...prev, nftBaseURI: e.target.value }))}
                    placeholder="https://api.example.com/metadata/"
                  />
                </div>
                <Button 
                  onClick={() => handleFormSubmit("deployNFTBadge")}
                  className="w-full"
                >
                  Deploy NFT Badge
                </Button>
              </CardContent>
            </Card>

            {/* Marketplace Operations */}
            <Card>
              <CardHeader>
                <CardTitle>Marketplace Operations</CardTitle>
                <CardDescription>Create and manage marketplace</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="marketplaceTokenAddress">Token Address</Label>
                  <Input
                    id="marketplaceTokenAddress"
                    value={formData.marketplaceTokenAddress}
                    onChange={(e) => setFormData(prev => ({ ...prev, marketplaceTokenAddress: e.target.value }))}
                    placeholder="0x..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nftAddress">NFT Address</Label>
                  <Input
                    id="nftAddress"
                    value={formData.nftAddress}
                    onChange={(e) => setFormData(prev => ({ ...prev, nftAddress: e.target.value }))}
                    placeholder="0x..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tokenId">Token ID</Label>
                  <Input
                    id="tokenId"
                    value={formData.tokenId}
                    onChange={(e) => setFormData(prev => ({ ...prev, tokenId: e.target.value }))}
                    placeholder="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="listPrice">List Price</Label>
                  <Input
                    id="listPrice"
                    value={formData.listPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, listPrice: e.target.value }))}
                    placeholder="0.1"
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleFormSubmit("createMarketplace")}
                    size="sm"
                    className="flex-1"
                  >
                    Create
                  </Button>
                  <Button 
                    onClick={() => handleFormSubmit("listMarketplaceItem")}
                    size="sm"
                    variant="outline"
                    className="flex-1"
                  >
                    List
                  </Button>
                  <Button 
                    onClick={() => handleFormSubmit("getMarketplaceItems")}
                    size="sm"
                    variant="outline"
                    className="flex-1"
                  >
                    Get Items
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Reputation Operations */}
            <Card>
              <CardHeader>
                <CardTitle>Reputation Operations</CardTitle>
                <CardDescription>Calculate user reputation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={() => handleFormSubmit("calculateReputation")}
                  className="w-full"
                >
                  Calculate Reputation
                </Button>
              </CardContent>
            </Card>

          </div>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Results</CardTitle>
              <CardDescription>Results from API calls</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-96 text-sm">
                {JSON.stringify(results, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 