"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBlockchain } from "@/hooks/use-blockchain";
import { useToast } from "@/hooks/use-toast";
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Coins, 
  Package, 
  Users, 
  Eye,
  Tag,
  DollarSign,
  AlertCircle,
  Star,
  Truck,
  Heart,
  MessageCircle
} from "lucide-react";

interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  price: string;
  currency: string;
  category: string;
  image?: string;
  seller: string;
  isListed: boolean;
  stock: number;
  condition: string;
  shipping: string;
  createdAt: string;
}

interface MarketplaceProps {
  fanClubId: string;
  isOwner: boolean;
  isMember: boolean;
}

// Sample product categories
const PRODUCT_CATEGORIES = [
  { value: "merchandise", label: "Merchandise", icon: "👕" },
  { value: "tickets", label: "Match Tickets", icon: "🎫" },
  { value: "collectibles", label: "Collectibles", icon: "🏆" },
  { value: "books", label: "Books & Media", icon: "📚" },
  { value: "accessories", label: "Accessories", icon: "🧢" },
  { value: "other", label: "Other", icon: "📦" },
];

// Sample product conditions
const PRODUCT_CONDITIONS = [
  { value: "new", label: "New" },
  { value: "like-new", label: "Like New" },
  { value: "excellent", label: "Excellent" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
];

// Sample shipping options
const SHIPPING_OPTIONS = [
  { value: "free", label: "Free Shipping" },
  { value: "standard", label: "Standard Shipping" },
  { value: "express", label: "Express Shipping" },
  { value: "pickup", label: "Local Pickup" },
];

export function Marketplace({ fanClubId, isOwner, isMember }: MarketplaceProps) {
  const blockchain = useBlockchain();
  const { toast } = useToast();
  
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateMarketplace, setShowCreateMarketplace] = useState(false);
  const [showListItem, setShowListItem] = useState(false);
  
  // Form states
  const [tokenAddress, setTokenAddress] = useState("");
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCategory, setProductCategory] = useState("merchandise");
  const [productStock, setProductStock] = useState("1");
  const [productCondition, setProductCondition] = useState("new");
  const [productShipping, setProductShipping] = useState("free");

  // Load marketplace items
  const loadMarketplaceItems = useCallback(async () => {
    if (!blockchain.isConnected) return;
    
    setIsLoading(true);
    try {
      // For now, we'll use sample data since we're transitioning to real products
      // In a real implementation, this would fetch from a backend API
      const sampleItems: MarketplaceItem[] = [
        {
          id: "1",
          name: "Chelsea FC Home Jersey 2023/24",
          description: "Official Chelsea FC home jersey from the 2023/24 season. Made with high-quality breathable fabric.",
          price: "89.99",
          currency: "USD",
          category: "merchandise",
          seller: blockchain.address || "0x123...",
          isListed: true,
          stock: 5,
          condition: "new",
          shipping: "free",
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Match Ticket - Chelsea vs Arsenal",
          description: "Premium seat ticket for the upcoming Chelsea vs Arsenal match at Stamford Bridge.",
          price: "150.00",
          currency: "USD",
          category: "tickets",
          seller: blockchain.address || "0x123...",
          isListed: true,
          stock: 2,
          condition: "new",
          shipping: "pickup",
          createdAt: new Date().toISOString(),
        },
        {
          id: "3",
          name: "Signed Football by Eden Hazard",
          description: "Authentic football signed by Chelsea legend Eden Hazard. Includes certificate of authenticity.",
          price: "299.99",
          currency: "USD",
          category: "collectibles",
          seller: blockchain.address || "0x123...",
          isListed: true,
          stock: 1,
          condition: "excellent",
          shipping: "express",
          createdAt: new Date().toISOString(),
        },
      ];
      
      setItems(sampleItems);
    } catch (error) {
      console.error("Failed to load marketplace items:", error);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [blockchain.isConnected, blockchain.address]);

  // Create marketplace
  const handleCreateMarketplace = async () => {
    if (!tokenAddress.trim()) {
      toast({
        title: "Error",
        description: "Please enter a token address",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await blockchain.createFanClubMarketplace(fanClubId, tokenAddress);
      if (result?.success) {
        setShowCreateMarketplace(false);
        setTokenAddress("");
        toast({
          title: "Success",
          description: "Marketplace created successfully!",
        });
      }
    } catch (error) {
      console.error("Failed to create marketplace:", error);
    }
  };

  // List item
  const handleListItem = async () => {
    if (!productName.trim() || !productDescription.trim() || !productPrice.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      // In a real implementation, this would save to a backend API
      const newItem: MarketplaceItem = {
        id: Date.now().toString(),
        name: productName,
        description: productDescription,
        price: productPrice,
        currency: "USD",
        category: productCategory,
        seller: blockchain.address || "0x123...",
        isListed: true,
        stock: parseInt(productStock),
        condition: productCondition,
        shipping: productShipping,
        createdAt: new Date().toISOString(),
      };

      setItems(prev => [newItem, ...prev]);
      setShowListItem(false);
      setProductName("");
      setProductDescription("");
      setProductPrice("");
      setProductCategory("merchandise");
      setProductStock("1");
      setProductCondition("new");
      setProductShipping("free");
      
      toast({
        title: "Success",
        description: "Product listed successfully!",
      });
    } catch (error) {
      console.error("Failed to list product:", error);
    }
  };

  // Delist item
  const handleDelistItem = async (itemId: string) => {
    try {
      setItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, isListed: false } : item
      ));
      toast({
        title: "Success",
        description: "Product delisted successfully!",
      });
    } catch (error) {
      console.error("Failed to delist product:", error);
    }
  };

  // Buy item
  const handleBuyItem = async (item: MarketplaceItem) => {
    try {
      // In a real implementation, this would process payment and update inventory
      setItems(prev => prev.map(i => 
        i.id === item.id ? { ...i, stock: Math.max(0, i.stock - 1) } : i
      ));
      toast({
        title: "Success",
        description: `Successfully purchased ${item.name}!`,
      });
    } catch (error) {
      console.error("Failed to buy product:", error);
    }
  };

  // Load items on mount and when fanClubId changes
  useEffect(() => {
    if (blockchain.isConnected) {
      loadMarketplaceItems();
    }
  }, [loadMarketplaceItems]);

  if (!blockchain.isConnected) {
    return (
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Connect Wallet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Connect your wallet to access the marketplace
          </p>
          <Button onClick={blockchain.connectWallet}>
            Connect Wallet
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Marketplace Header */}
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              {fanClubId} Marketplace
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge className={isOwner ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : isMember ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"}>
                {isOwner ? "Owner" : isMember ? "Member" : "Not Member"}
              </Badge>
              {isOwner && (
                <Button
                  size="sm"
                  onClick={() => setShowCreateMarketplace(true)}
                  className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Marketplace
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Create Marketplace Modal */}
      {showCreateMarketplace && (
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
          <CardHeader>
            <CardTitle>Create Marketplace</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Payment Token Address (ERC20)
              </label>
              <Input
                placeholder="0x..."
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
                className="mt-1 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleCreateMarketplace}
                disabled={blockchain.transactionState.isPending}
                className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
              >
                {blockchain.transactionState.isPending ? "Creating..." : "Create"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCreateMarketplace(false)}
                className="border-gray-200 dark:border-gray-700"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* List Item Modal */}
      {showListItem && (
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
          <CardHeader>
            <CardTitle>List Product</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Product Name *
              </label>
              <Input
                placeholder="e.g., Chelsea FC Home Jersey"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="mt-1 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Description *
              </label>
              <Textarea
                placeholder="Describe your product..."
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                className="mt-1 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Price (USD) *
                </label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  className="mt-1 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Stock *
                </label>
                <Input
                  type="number"
                  min="1"
                  placeholder="1"
                  value={productStock}
                  onChange={(e) => setProductStock(e.target.value)}
                  className="mt-1 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Category
                </label>
                <Select value={productCategory} onValueChange={setProductCategory}>
                  <SelectTrigger className="mt-1 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODUCT_CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        <span className="flex items-center gap-2">
                          <span>{category.icon}</span>
                          {category.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Condition
                </label>
                <Select value={productCondition} onValueChange={setProductCondition}>
                  <SelectTrigger className="mt-1 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODUCT_CONDITIONS.map((condition) => (
                      <SelectItem key={condition.value} value={condition.value}>
                        {condition.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Shipping
                </label>
                <Select value={productShipping} onValueChange={setProductShipping}>
                  <SelectTrigger className="mt-1 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SHIPPING_OPTIONS.map((shipping) => (
                      <SelectItem key={shipping.value} value={shipping.value}>
                        {shipping.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleListItem}
                disabled={blockchain.transactionState.isPending || !productName.trim() || !productDescription.trim() || !productPrice.trim()}
                className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
              >
                {blockchain.transactionState.isPending ? "Listing..." : "List Product"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowListItem(false)}
                className="border-gray-200 dark:border-gray-700"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Marketplace Items */}
      <div className="space-y-4">
        {isOwner && (
          <Button
            onClick={() => setShowListItem(true)}
            className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            List New Product
          </Button>
        )}

        {isLoading ? (
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Loading marketplace...</p>
            </CardContent>
          </Card>
        ) : items.filter(item => item.isListed && item.stock > 0).length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.filter(item => item.isListed && item.stock > 0).map((item) => (
              <Card key={item.id} className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-gray-500" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.name}
                      </span>
                    </div>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      {item.stock} in stock
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {item.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        ${item.price}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {PRODUCT_CATEGORIES.find(c => c.value === item.category)?.label}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {item.condition}
                      </span>
                      <span className="flex items-center gap-1">
                        <Truck className="h-3 w-3" />
                        {SHIPPING_OPTIONS.find(s => s.value === item.shipping)?.label}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {isMember && item.stock > 0 && (
                      <Button
                        size="sm"
                        onClick={() => handleBuyItem(item)}
                        disabled={blockchain.transactionState.isPending}
                        className="flex-1 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Buy Now
                      </Button>
                    )}
                    {isOwner && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelistItem(item.id)}
                        disabled={blockchain.transactionState.isPending}
                        className="border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
            <CardContent className="p-6 text-center">
              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {items.length === 0 && !isLoading ? "No Marketplace Created" : "No Products Available"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {items.length === 0 && !isLoading && isOwner
                  ? "Create a marketplace first to start selling products"
                  : isOwner 
                    ? "Start by listing products in your marketplace"
                    : "No products are currently available in this marketplace"
                }
              </p>
              {items.length === 0 && !isLoading && isOwner ? (
                <Button
                  onClick={() => setShowCreateMarketplace(true)}
                  className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Marketplace
                </Button>
              ) : isOwner && (
                <Button
                  onClick={() => setShowListItem(true)}
                  className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  List First Product
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 