import { SigninForm } from "@/components/signin-form"

export default function LoginPage() {
  return (
    <div className="bg-muted min-h-screen flex items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <SigninForm />
      </div>
    </div>
  )
}
