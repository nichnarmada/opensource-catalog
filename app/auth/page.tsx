"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { AuthForm } from "@/components/auth/auth-form"

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { signIn, signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      if (isSignUp) {
        await signUp(email, password)
      } else {
        await signIn(email, password)
      }
      // After successful authentication, redirect to home page
      router.push("/")
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "An error occurred during authentication"
      )
    }
  }

  return (
    <div className="container max-w-screen-xl mx-auto py-8">
      <div className="flex min-h-[60vh] items-center justify-center">
        <AuthForm
          isSignUp={isSignUp}
          email={email}
          password={password}
          error={error}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onSubmit={handleSubmit}
          onToggleMode={() => setIsSignUp(!isSignUp)}
        />
      </div>
    </div>
  )
}
