"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, MapPin, Camera, Share2, Trophy, CheckCircle, Home, Smartphone } from "lucide-react"
import Link from "next/link"

export default function CheckInPage() {
  const [checkInType, setCheckInType] = useState<"stadium" | "home" | null>(null)
  const [prediction, setPrediction] = useState({ home: "", away: "" })
  const [photo, setPhoto] = useState<string | null>(null)
  const [comment, setComment] = useState("")
  const [isCheckedIn, setIsCheckedIn] = useState(false)

  const gameInfo = {
    homeTeam: "Chelsea FC",
    awayTeam: "Arsenal",
    date: "Today",
    time: "4:00 PM",
    stadium: "Stamford Bridge",
    championship: "Premier League",
  }

  const handleCheckIn = () => {
    setIsCheckedIn(true)
  }

  if (isCheckedIn) {
    return (
      <div className="bg-black text-white">
        <header className="bg-black border-b border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="icon" className="text-white">
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">Check-in Completed</h1>
            <div></div>
          </div>
        </header>

        <div className="p-4 space-y-6">
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-[#28CA00] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-black" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Check-in Confirmed!</h2>
            <p className="text-gray-400">You earned tokens for your attendance</p>
          </div>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-[#28CA00] mb-2">+200</div>
              <div className="text-white font-semibold mb-1">Tokens Earned</div>
              <div className="text-sm text-gray-400">Check-in at {gameInfo.stadium}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Additional Bonuses</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">First time at stadium</span>
                <span className="text-[#28CA00] font-semibold">+50</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Photo shared</span>
                <span className="text-[#28CA00] font-semibold">+25</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Score prediction</span>
                <span className="text-[#28CA00] font-semibold">+25</span>
              </div>
              <hr className="border-gray-700" />
              <div className="flex justify-between items-center font-semibold">
                <span className="text-white">Total</span>
                <span className="text-[#28CA00]">+300 tokens</span>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <Link href="/">
              <Button className="w-full bg-[#28CA00] hover:bg-[#20A000] text-black">Back to Home</Button>
            </Link>
            <Button variant="outline" className="w-full border-gray-700 text-white bg-transparent">
              <Share2 className="h-4 w-4 mr-2" />
              Share Achievement
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-black text-white">
      {/* Header */}
      <header className="bg-black border-b border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-white">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">Check-in</h1>
          <div></div>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Game Info */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white text-center">
              {gameInfo.homeTeam} vs {gameInfo.awayTeam}
            </CardTitle>
            <CardDescription className="text-center text-gray-400">
              {gameInfo.date} • {gameInfo.time} • {gameInfo.stadium}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Badge className="w-full justify-center bg-blue-600 text-white">{gameInfo.championship}</Badge>
          </CardContent>
        </Card>

        {/* Check-in Type Selection */}
        {!checkInType && (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">How are you watching?</CardTitle>
              <CardDescription className="text-gray-400">Choose your check-in type</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full h-16 border-gray-700 hover:border-[#28CA00] hover:bg-[#28CA00]/10 bg-transparent"
                onClick={() => setCheckInType("stadium")}
              >
                <div className="flex items-center gap-3">
                  <MapPin className="h-6 w-6 text-[#28CA00]" />
                  <div className="text-left">
                    <div className="font-semibold text-white">At Stadium</div>
                    <div className="text-sm text-gray-400">Physical check-in (+200 tokens)</div>
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full h-16 border-gray-700 hover:border-[#28CA00] hover:bg-[#28CA00]/10 bg-transparent"
                onClick={() => setCheckInType("home")}
              >
                <div className="flex items-center gap-3">
                  <Home className="h-6 w-6 text-[#28CA00]" />
                  <div className="text-left">
                    <div className="font-semibold text-white">At Home</div>
                    <div className="text-sm text-gray-400">Virtual check-in (+100 tokens)</div>
                  </div>
                </div>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Stadium Check-in */}
        {checkInType === "stadium" && (
          <>
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-[#28CA00]" />
                  Location Confirmed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-800 rounded-lg p-4 mb-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-[#28CA00] rounded-full flex items-center justify-center mx-auto mb-3">
                      <MapPin className="h-8 w-8 text-black" />
                    </div>
                    <h3 className="font-semibold text-white">Stamford Bridge</h3>
                    <p className="text-sm text-gray-400">London, UK</p>
                    <Badge className="mt-2 bg-green-600 text-white">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Location Verified
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Share the Moment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="photo" className="text-white">
                    Game Photo (Optional)
                  </Label>
                  <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
                    {photo ? (
                      <img
                        src={photo || "/placeholder.svg"}
                        alt="Game photo"
                        className="w-full h-32 object-cover rounded"
                      />
                    ) : (
                      <div>
                        <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-400">Tap to add a photo</p>
                        <p className="text-xs text-gray-500 mt-1">+25 extra tokens</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comment" className="text-white">
                    Comment (Optional)
                  </Label>
                  <Textarea
                    id="comment"
                    placeholder="How is the game? Share your experience..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Home Check-in */}
        {checkInType === "home" && (
          <>
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-[#28CA00]" />
                  Virtual Check-in
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Prove you're watching by sharing on social media
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">How it works:</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Make a post about the game on Twitter</li>
                    <li>• Use hashtag #TRBE and tag your club</li>
                    <li>• Paste the post link below</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="socialPost" className="text-white">
                    Post Link
                  </Label>
                  <Input
                    id="socialPost"
                    placeholder="https://twitter.com/your-post"
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="homeComment" className="text-white">
                    Game comment
                  </Label>
                  <Textarea
                    id="homeComment"
                    placeholder="How is the game? What's your opinion?"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Prediction */}
        {checkInType && (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Trophy className="h-5 w-5 text-[#28CA00]" />
                Score Prediction
              </CardTitle>
              <CardDescription className="text-gray-400">
                Predict the score and earn extra tokens (+25 tokens)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  <Label className="text-white text-sm">{gameInfo.homeTeam}</Label>
                  <Input
                    type="number"
                    min="0"
                    max="10"
                    value={prediction.home}
                    onChange={(e) => setPrediction({ ...prediction, home: e.target.value })}
                    className="w-16 h-16 text-center text-2xl font-bold bg-gray-800 border-gray-700 text-white mt-2"
                  />
                </div>

                <div className="text-2xl font-bold text-gray-400">X</div>

                <div className="text-center">
                  <Label className="text-white text-sm">{gameInfo.awayTeam}</Label>
                  <Input
                    type="number"
                    min="0"
                    max="10"
                    value={prediction.away}
                    onChange={(e) => setPrediction({ ...prediction, away: e.target.value })}
                    className="w-16 h-16 text-center text-2xl font-bold bg-gray-800 border-gray-700 text-white mt-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Check-in Button */}
        {checkInType && (
          <div className="space-y-3">
            <Button
              onClick={handleCheckIn}
              className="w-full bg-[#28CA00] hover:bg-[#20A000] text-black font-semibold h-12"
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Confirm Check-in
            </Button>

            <Button
              variant="outline"
              onClick={() => setCheckInType(null)}
              className="w-full border-gray-700 text-gray-400 hover:text-white"
            >
              Back
            </Button>
          </div>
        )}

        {/* Rewards Info */}
        <Card className="bg-[#28CA00]/10 border-[#28CA00]">
          <CardContent className="p-4">
            <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
              <Trophy className="h-4 w-4 text-[#28CA00]" />
              Available Rewards
            </h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Basic check-in:</span>
                <span className="text-[#28CA00]">+{checkInType === "stadium" ? "200" : "100"} tokens</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Photo shared:</span>
                <span className="text-[#28CA00]">+25 tokens</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Score prediction:</span>
                <span className="text-[#28CA00]">+25 tokens</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Streak bonus:</span>
                <span className="text-[#28CA00]">+50 tokens</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
