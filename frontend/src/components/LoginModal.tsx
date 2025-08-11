import React from "react"
import { useState } from "react"
import { Card, CardHeader, CardContent } from "../ui/Card"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Label } from "../ui/Label"
import { Heading } from "../ui/Heading"
import { Checkbox } from "../ui/Checkbox"
import { ErrorMessage } from "../ui/ErrorMessage"
import { DotPattern } from "../ui/DotPattern"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (email: string, password: string) => void
  isLoading?: boolean
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin, isLoading = false }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    onLogin(email, password)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-accent-900/80 backdrop-blur-sm" onClick={onClose}>
        <DotPattern />
      </div>

      {/* Modal */}
      <Card className="relative w-full max-w-md mx-auto bg-surface border-2 border-primary/20 shadow-strong">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors duration-200 z-10 w-8 h-8 flex items-center justify-center"
          aria-label="Close modal"
        >
          {/* CSS X Icon */}
          <div className="relative w-4 h-4">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-0.5 bg-muted-foreground transform rotate-45" />
              <div className="w-4 h-0.5 bg-muted-foreground transform -rotate-45 absolute" />
            </div>
          </div>
        </button>

        {/* Header with branding */}
        <CardHeader className="space-y-6 pt-8 pb-6">
          {/* Logo/Icon area */}
          <div className="flex items-center justify-center space-x-2">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-accent-200 to-accent-400 rounded-2xl flex items-center justify-center shadow-medium">
                {/* CSS Music Note */}
                <div className="relative w-6 h-6">
                  <div className="absolute bottom-0 left-1 w-3 h-3 bg-base-100 rounded-full" />
                  <div className="absolute bottom-2 right-1 w-1 h-4 bg-base-100 rounded-full" />
                  <div className="absolute top-0 right-0 w-2 h-1 bg-base-100 rounded-full" />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                {/* CSS Play Icon */}
                <div className="w-0 h-0 border-l-[6px] border-l-base-100 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-0.5" />
              </div>
            </div>
          </div>

          <div className="text-center space-y-2">
            <Heading className="text-foreground">
              Welcome to Hitster
            </Heading>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Connect with Spotify to start your music timeline game
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 px-8 pb-8">
          {/* Error message */}
          {error && <ErrorMessage message={error} variant="error" dismissible onDismiss={() => setError("")} />}

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" required>
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                disabled={isLoading}
                error={!!error && !email}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" required>
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                error={!!error && !password}
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <Checkbox
                label="Remember me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
              />
              <Button variant="ghost" size="sm" type="button" className="text-xs">
                Forgot password?
              </Button>
            </div>

            <Button type="submit" className="w-full mt-6" disabled={isLoading || !email || !password}>
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-base-100/30 border-t-base-100 rounded-full animate-spin" />
                  <span>Signing In...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-muted" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-surface px-3 text-muted-foreground font-medium tracking-wide">Or continue with</span>
            </div>
          </div>

          {/* Spotify login button */}
          <Button
            type="button"
            className="w-full bg-[#1DB954] hover:bg-[#1ed760] border-[#1DB954] text-white hover:text-white"
            disabled={isLoading}
          >
            <div className="flex items-center justify-center space-x-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
              </svg>
              <span className="font-medium">Continue with Spotify</span>
            </div>
          </Button>

          {/* Game info */}
          <div className="mt-6 p-4 bg-muted/30 rounded-xl border border-border-muted relative overflow-hidden">
            <DotPattern/>
            <div className="flex items-start space-x-3 relative z-10">
              {/* CSS Users Icon */}
              <div className="w-5 h-5 text-primary mt-0.5 flex-shrink-0 relative">
                <div className="absolute top-0 left-0 w-2 h-2 bg-current rounded-full" />
                <div className="absolute top-0 right-0 w-2 h-2 bg-current rounded-full" />
                <div className="absolute bottom-0 left-0 w-5 h-2 bg-current rounded-full" />
              </div>
              <div className="text-sm text-muted-foreground leading-relaxed">
                <p className="font-medium text-foreground mb-1">Ready to play?</p>
                <p>Only one player needs to log in. You'll control the game for everyone (2-10 players).</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
