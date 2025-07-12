"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Package, Plus, Loader2, AlertCircle, CheckCircle, Coins, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ethers } from "ethers"
import { 
  getMarketplaceItems,
  listMarketplaceItem,
  buyMarketplaceItem,
  delistMarketplaceItem,
  createMarketplace,
  formatEther,
  formatAddress
} from "@/lib/blockchain"
import { type FanClub } from "@/lib/contracts"

interface MarketplaceProps {
  userFanClubs: FanClub[]
  onRefresh: () => void
  isLoading: boolean
}

interface MarketplaceItem {
  nftAddress: string
  tokenId: number
  price: string
  isListed: boolean
  fanClubId: string
  fanClubName: string
}

export function Marketplace({ userFanClubs, onRefresh, isLoading }: MarketplaceProps) {
  const { toast } = useToast()
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>([])
  const [isLoadingItems, setIsLoadingItems] = useState(false)
  
  // Modal states
  const [showCreateMarketplaceModal, setShowCreateMarketplaceModal] = useState(false)
  const [showListItemModal, setShowListItemModal] = useState(false)
  const [selectedFanClub, setSelectedFanClub] = useState<FanClub | null>(null)
  
  // Form states
  const [marketplaceTokenAddress, setMarketplaceTokenAddress] = useState("")
  const [listItemData, setListItemData] = useState({
    nftAddress: "",
    tokenId: "",
    price: ""
  })

  // Load marketplace items
  useEffect(() => {
    if (userFanClubs.length > 0) {
      loadMarketplaceItems()
    }
  }, [userFanClubs])

  const loadMarketplaceItems = async () => {
    setIsLoadingItems(true)
    try {
      const allMarketplaceItems = []
      for (const club of userFanClubs) {
        const items = await getMarketplaceItems(club.id)
        allMarketplaceItems.push(...items.map(item => ({
          ...item,
          fanClubId: club.id,
          fanClubName: club.id
        })))
      }
      setMarketplaceItems(allMarketplaceItems)
    } catch (error) {
      console.error("Error loading marketplace items:", error)
      toast({
        title: "Error",
        description: "Failed to load marketplace items",
        variant: "destructive"
      })
    } finally {
      setIsLoadingItems(false)
    }
  }

  // Create marketplace
  const handleCreateMarketplace = async () => {
    if (!selectedFanClub || !marketplaceTokenAddress) {
      toast({
        title: "Missing Information",
        description: "Please select a fan club and enter token address",
        variant: "destructive"
      })
      return
    }

    try {
      const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner()
      const result = await createMarketplace(selectedFanClub.id, marketplaceTokenAddress, signer)
      
      if (result.success) {
        toast({
          title: "Success",
          description: `Marketplace created for fan club "${selectedFanClub.id}"!`
        })
        setShowCreateMarketplaceModal(false)
        setMarketplaceTokenAddress("")
        setSelectedFanClub(null)
        onRefresh()
      } else {
        throw new Error(result.error)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create marketplace",
        variant: "destructive"
      })
    }
  }

  // List marketplace item
  const handleListItem = async () => {
    if (!selectedFanClub || !listItemData.nftAddress || !listItemData.tokenId || !listItemData.price) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      })
      return
    }

    try {
      const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner()
      const result = await listMarketplaceItem(
        selectedFanClub.id,
        listItemData.nftAddress,
        parseInt(listItemData.tokenId),
        listItemData.price,
        signer
      )
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Item listed successfully!"
        })
        setShowListItemModal(false)
        setListItemData({ nftAddress: "", tokenId: "", price: "" })
        setSelectedFanClub(null)
        await loadMarketplaceItems()
      } else {
        throw new Error(result.error)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to list item",
        variant: "destructive"
      })
    }
  }

  // Buy marketplace item
  const handleBuyItem = async (item: MarketplaceItem) => {
    try {
      const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner()
      const result = await buyMarketplaceItem(item.fanClubId, item.nftAddress, item.tokenId, signer)
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Item purchased successfully!"
        })
        await loadMarketplaceItems()
      } else {
        throw new Error(result.error)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to purchase item",
        variant: "destructive"
      })
    }
  }

  // Delist marketplace item
  const handleDelistItem = async (item: MarketplaceItem) => {
    try {
      const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner()
      const result = await delistMarketplaceItem(item.fanClubId, item.nftAddress, item.tokenId, signer)
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Item delisted successfully!"
        })
        await loadMarketplaceItems()
      } else {
        throw new Error(result.error)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delist item",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Marketplace Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">NFT Marketplace</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Trade NFTs with other fan club members
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showCreateMarketplaceModal} onOpenChange={setShowCreateMarketplaceModal}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Create Marketplace
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Marketplace</DialogTitle>
                <DialogDescription>
                  Create a marketplace for your fan club using a token address
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fanClub">Fan Club</Label>
                  <select
                    id="fanClub"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                    value={selectedFanClub?.id || ""}
                    onChange={(e) => {
                      const club = userFanClubs.find(c => c.id === e.target.value)
                      setSelectedFanClub(club || null)
                    }}
                  >
                    <option value="">Select a fan club</option>
                    {userFanClubs.map((club) => (
                      <option key={club.id} value={club.id}>
                        {club.id} (Owner: {formatAddress(club.owner)})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="tokenAddress">Token Contract Address</Label>
                  <Input
                    id="tokenAddress"
                    placeholder="0x..."
                    value={marketplaceTokenAddress}
                    onChange={(e) => setMarketplaceTokenAddress(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateMarketplaceModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateMarketplace}>
                  Create Marketplace
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={showListItemModal} onOpenChange={setShowListItemModal}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                List NFT
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>List NFT Item</DialogTitle>
                <DialogDescription>
                  List an NFT for sale in your fan club marketplace
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="listFanClub">Fan Club</Label>
                  <select
                    id="listFanClub"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                    value={selectedFanClub?.id || ""}
                    onChange={(e) => {
                      const club = userFanClubs.find(c => c.id === e.target.value)
                      setSelectedFanClub(club || null)
                    }}
                  >
                    <option value="">Select a fan club</option>
                    {userFanClubs.map((club) => (
                      <option key={club.id} value={club.id}>
                        {club.id} (Owner: {formatAddress(club.owner)})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="nftAddress">NFT Contract Address</Label>
                  <Input
                    id="nftAddress"
                    placeholder="0x..."
                    value={listItemData.nftAddress}
                    onChange={(e) => setListItemData(prev => ({ ...prev, nftAddress: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="tokenId">Token ID</Label>
                  <Input
                    id="tokenId"
                    type="number"
                    placeholder="1"
                    value={listItemData.tokenId}
                    onChange={(e) => setListItemData(prev => ({ ...prev, tokenId: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price (CHZ)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.001"
                    placeholder="0.1"
                    value={listItemData.price}
                    onChange={(e) => setListItemData(prev => ({ ...prev, price: e.target.value }))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowListItemModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleListItem}>
                  List Item
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Marketplace Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
          <CardContent className="p-4 text-center">
            <ShoppingCart className="h-6 w-6 text-black dark:text-white mx-auto mb-2" />
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {marketplaceItems.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Items Listed</div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
          <CardContent className="p-4 text-center">
            <Users className="h-6 w-6 text-black dark:text-white mx-auto mb-2" />
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {userFanClubs.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Your Clubs</div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
          <CardContent className="p-4 text-center">
            <Coins className="h-6 w-6 text-black dark:text-white mx-auto mb-2" />
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {marketplaceItems.reduce((total, item) => total + parseFloat(formatEther(item.price)), 0).toFixed(2)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Value (CHZ)</div>
          </CardContent>
        </Card>
      </div>

      {/* Marketplace Items */}
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
            <Package className="h-5 w-5 text-black dark:text-white" />
            Available Items
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            {isLoadingItems ? "Loading marketplace items..." : `${marketplaceItems.length} items available`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingItems ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading marketplace...</span>
            </div>
          ) : marketplaceItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No items listed in marketplace</p>
              <p className="text-sm">Create a marketplace and list your first NFT!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {marketplaceItems.map((item, index) => (
                <Card key={index} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="w-full h-32 bg-gray-100 dark:bg-gray-700 rounded-lg mb-3 flex items-center justify-center">
                      <Package className="h-12 w-12 text-gray-400" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          NFT #{item.tokenId}
                        </h4>
                        <Badge className="bg-green-600 text-white text-xs">
                          Listed
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <p>Contract: {formatAddress(item.nftAddress)}</p>
                        <p>Club: {item.fanClubName}</p>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2">
                        <div>
                          <span className="text-lg font-bold text-black dark:text-white">
                            {formatEther(item.price)} CHZ
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            size="sm" 
                            className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                            onClick={() => handleBuyItem(item)}
                          >
                            Buy
                          </Button>
                          {/* Only show delist button if user owns the club */}
                          {userFanClubs.some(club => club.id === item.fanClubId && club.owner === window.ethereum?.selectedAddress) && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleDelistItem(item)}
                            >
                              Delist
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 