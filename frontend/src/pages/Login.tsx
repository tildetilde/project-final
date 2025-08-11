"use client"

import type React from "react"
import { LoginForm } from "../components/LoginForm"
import { DotPattern } from "../ui/DotPattern"

export const Login: React.FC = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <DotPattern className="fixed inset-0" />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-base-200/50" />

      {/* Main Content */}
      <div className="relative z-10">
        <LoginForm />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-accent-200/20 rounded-full blur-xl" />
      <div className="absolute bottom-20 right-16 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
      <div className="absolute top-1/3 right-10 w-16 h-16 bg-accent-300/15 rounded-full blur-lg" />
    </div>
  )
}

export default Login
