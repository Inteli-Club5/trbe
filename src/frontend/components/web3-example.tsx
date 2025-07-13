"use client";

import { useState } from "react";
import { useWeb3Api } from "@/hooks/use-web3-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export function Web3Example() {
  const {
    isConnected,
    address,
    isLoading,
    connectWallet,
    getUserProfile,
    getClubs,
    getEvents,
    getReputation,
    createEvent,
  } = useWeb3Api();

  const { toast } = useToast();
  const [data, setData] = useState<any>({});
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");

  const loadUserData = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    try {
      const [profile, clubs, events, reputation] = await Promise.all([
        getUserProfile(),
        getClubs(),
        getEvents(),
        address ? getReputation(address) : null,
      ]);

      setData({ profile, clubs, events, reputation });
      
      toast({
        title: "Data Loaded",
        description: "User data loaded successfully",
      });
    } catch (error) {
      console.error("Failed to load data:", error);
      toast({
        title: "Error",
        description: "Failed to load user data",
        variant: "destructive",
      });
    }
  };

  const handleCreateEvent = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    if (!eventName || !eventDescription) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await createEvent({
        name: eventName,
        description: eventDescription,
        date: new Date().toISOString(),
      });

      if (result) {
        setEventName("");
        setEventDescription("");
        toast({
          title: "Event Created",
          description: "Event created successfully",
        });
        // Reload data to show the new event
        loadUserData();
      }
    } catch (error) {
      console.error("Failed to create event:", error);
      toast({
        title: "Error",
        description: "Failed to create event",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Web3 Integration Example</CardTitle>
          <CardDescription>
            This component demonstrates how to use the Web3 API in your application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isConnected ? (
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                Connect your wallet to start using Web3 features
              </p>
              <Button onClick={connectWallet}>Connect Wallet</Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Connected</Badge>
                <span className="text-sm text-muted-foreground">{address}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  onClick={loadUserData} 
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? "Loading..." : "Load User Data"}
                </Button>
              </div>

              {/* Create Event Form */}
              <div className="space-y-4 border rounded-lg p-4">
                <h3 className="font-semibold">Create New Event</h3>
                <div className="space-y-2">
                  <Label htmlFor="eventName">Event Name</Label>
                  <Input
                    id="eventName"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder="Enter event name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eventDescription">Description</Label>
                  <Input
                    id="eventDescription"
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                    placeholder="Enter event description"
                  />
                </div>
                <Button 
                  onClick={handleCreateEvent}
                  disabled={isLoading}
                  className="w-full"
                >
                  Create Event
                </Button>
              </div>

              {/* Display Data */}
              {Object.keys(data).length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold">User Data</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.profile && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Profile</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            {data.profile.name || "No name set"}
                          </p>
                        </CardContent>
                      </Card>
                    )}
                    
                    {data.clubs && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Clubs</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            {data.clubs.length} clubs found
                          </p>
                        </CardContent>
                      </Card>
                    )}
                    
                    {data.events && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Events</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            {data.events.length} events found
                          </p>
                        </CardContent>
                      </Card>
                    )}
                    
                    {data.reputation && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Reputation</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            Score: {data.reputation}
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 