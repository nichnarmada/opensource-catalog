import { AuthForm } from "@/components/auth/auth-form"

export default function AuthPage() {
  return (
    <div className="container max-w-screen-xl mx-auto py-8">
      <div className="flex min-h-[60vh] items-center justify-center">
        <AuthForm />
      </div>
    </div>
  )
}
