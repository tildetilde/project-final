import React from "react"
import { useState } from "react"
import { LoginModal } from "./LoginModal" 
import { Button } from "../ui/Button"

export const LoginForm: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true)

    // Simulate login process
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log("Login attempt:", { email, password })
      setIsModalOpen(false)
    } catch (error) {
      console.error("Login failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center space-y-8">
        <div className="space-y-4">
<h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-foreground">Music Game Name</h1>
<p className="text-base sm:text-lg text-muted-foreground max-w-md mx-auto">
  Build your music timeline and guess the years in this exciting music game
</p>
        </div>

<Button onClick={() => setIsModalOpen(true)} className="px-6 py-3 sm:px-8 text-base sm:text-lg">
  Start Game
</Button>
      </div>

      <LoginModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLogin={handleLogin}
        isLoading={isLoading}
      />
    </div>
  )
}
