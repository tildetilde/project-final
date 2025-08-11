import React from "react"
import { useAuth } from "../hooks/useAuth"
import { Button } from "../ui/Button"
import { Card, CardHeader, CardContent } from "../ui/Card"
import { DotPattern } from "../ui/DotPattern"

export const Dashboard: React.FC = () => {
  const { user, logout, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Not authenticated</p>
          <Button onClick={() => window.location.href = '/'}>Go to Login</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <DotPattern className="fixed inset-0" />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-base-200/50" />

      {/* Main Content */}
      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome back, {user.display_name}!</h1>
            <p className="text-muted-foreground">Ready to play Hitster?</p>
          </div>
          <Button onClick={logout} variant="outline">
            Logout
          </Button>
        </div>

        {/* User Profile Card */}
        <Card className="mb-8 max-w-md">
          <CardHeader>
            <h2 className="text-xl font-semibold">Your Profile</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              {user.images && user.images[0] ? (
                <img 
                  src={user.images[0].url} 
                  alt="Profile" 
                  className="w-16 h-16 rounded-full"
                />
              ) : (
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎵</span>
                </div>
              )}
              <div>
                <p className="font-medium">{user.display_name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Game Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <h3 className="text-lg font-semibold">Quick Play</h3>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Start a quick game with random questions
              </p>
              <Button className="w-full">Start Game</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <h3 className="text-lg font-semibold">Custom Game</h3>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Create a custom game with specific settings
              </p>
              <Button className="w-full" variant="outline">Configure</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <h3 className="text-lg font-semibold">Leaderboard</h3>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                View your game history and scores
              </p>
              <Button className="w-full" variant="outline">View Stats</Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-8">
          <CardHeader>
            <h2 className="text-xl font-semibold">Recent Activity</h2>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No recent games yet. Start playing to see your activity!</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard 