"use client"
import { GalleryVerticalEnd, Key, Loader2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { signIn } from "@/lib/auth/client"
import { useState, useRef } from "react"
import { toast } from "sonner"

// Types
interface AuthError {
  message: string
  code?: string
}

interface SignInResponse {
  success: boolean
  error?: AuthError
}

interface LoadingStates {
  magicLink: boolean
  passkey: boolean
  github: boolean
  google: boolean
}

// Icon components
const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={cn("w-4 h-4", className)} viewBox="0 0 256 250" xmlns="http://www.w3.org/2000/svg">
    <path d="M128.00106,0 C57.3172926,0 0,57.3066942 0,128.00106 C0,184.555281 36.6761997,232.535542 87.534937,249.460899 C93.9320223,250.645779 96.280588,246.684165 96.280588,243.303333 C96.280588,240.251045 96.1618878,230.167899 96.106777,219.472176 C60.4967585,227.215235 52.9826207,204.369712 52.9826207,204.369712 C47.1599584,189.574598 38.770408,185.640538 38.770408,185.640538 C27.1568785,177.696113 39.6458206,177.859325 39.6458206,177.859325 C52.4993419,178.762293 59.267365,191.04987 59.267365,191.04987 C70.6837675,210.618423 89.2115753,204.961093 96.5158685,201.690482 C97.6647155,193.417512 100.981959,187.77078 104.642583,184.574357 C76.211799,181.33766 46.324819,170.362144 46.324819,121.315702 C46.324819,107.340889 51.3250588,95.9223682 59.5132437,86.9583937 C58.1842268,83.7344152 53.8029229,70.715562 60.7532354,53.0843636 C60.7532354,53.0843636 71.5019501,49.6441813 95.9626412,66.2049595 C106.172967,63.368876 117.123047,61.9465949 128.00106,61.8978432 C138.879073,61.9465949 149.837632,63.368876 160.067033,66.2049595 C184.49805,49.6441813 195.231926,53.0843636 195.231926,53.0843636 C202.199197,70.715562 197.815773,83.7344152 196.486756,86.9583937 C204.694018,95.9223682 209.660343,107.340889 209.660343,121.315702 C209.660343,170.478725 179.716133,181.303747 151.213281,184.472614 C155.80443,188.444828 159.895342,196.234518 159.895342,208.176593 C159.895342,225.303317 159.746968,239.087361 159.746968,243.303333 C159.746968,246.709601 162.05102,250.70089 168.53925,249.443941 C219.370432,232.499507 256,184.536204 256,128.00106 C256,57.3066942 198.691187,0 128.00106,0 Z M47.9405593,182.340212 C47.6586465,182.976105 46.6581745,183.166873 45.7467277,182.730227 C44.8183235,182.312656 44.2968914,181.445722 44.5978808,180.80771 C44.8734344,180.152739 45.876026,179.97045 46.8023103,180.409216 C47.7328342,180.826786 48.2627451,181.702199 47.9405593,182.340212 Z M54.2367892,187.958254 C53.6263318,188.524199 52.4329723,188.261363 51.6232682,187.366874 C50.7860088,186.474504 50.6291553,185.281144 51.2480912,184.70672 C51.8776254,184.140775 53.0349512,184.405731 53.8743302,185.298101 C54.7115892,186.201069 54.8748019,187.38595 54.2367892,187.958254 Z M58.5562413,195.146347 C57.7719732,195.691096 56.4895886,195.180261 55.6968417,194.042013 C54.9125733,192.903764 54.9125733,191.538713 55.713799,190.991845 C56.5086651,190.444977 57.7719732,190.936735 58.5753181,192.066505 C59.3574669,193.22383 59.3574669,194.58888 58.5562413,195.146347 Z M65.8613592,203.471174 C65.1597571,204.244846 63.6654083,204.03712 62.5716717,202.981538 C61.4524999,201.94927 61.1409122,200.484596 61.8446341,199.710926 C62.5547146,198.935137 64.0575422,199.15346 65.1597571,200.200564 C66.2704506,201.230712 66.6095936,202.705984 65.8613592,203.471174 Z M75.3025151,206.281542 C74.9930474,207.284134 73.553809,207.739857 72.1039724,207.313809 C70.6562556,206.875043 69.7087748,205.700761 70.0012857,204.687571 C70.302275,203.678621 71.7478721,203.20382 73.2083069,203.659543 C74.6539041,204.09619 75.6035048,205.261994 75.3025151,206.281542 Z M86.046947,207.473627 C86.0829806,208.529209 84.8535871,209.404622 83.3316829,209.4237 C81.8013,209.457614 80.563428,208.603398 80.5464708,207.564772 C80.5464708,206.498591 81.7483088,205.631657 83.2786917,205.606221 C84.8005962,205.576546 86.046947,206.424403 86.046947,207.473627 Z M96.6021471,207.069023 C96.7844366,208.099171 95.7267341,209.156872 94.215428,209.438785 C92.7295577,209.710099 91.3539086,209.074206 91.1652603,208.052538 C90.9808515,206.996955 92.0576306,205.939253 93.5413813,205.66582 C95.054807,205.402984 96.4092596,206.021919 96.6021471,207.069023 Z" fill="currentColor" />
  </svg>
)

const GoogleIcon = ({ className }: { className?: string }) => (
  <svg className={cn("w-4 h-4", className)} viewBox="0 0 256 262" xmlns="http://www.w3.org/2000/svg">
    <path d="M255.878,133.451 C255.878,122.717 255.007,114.884 253.122,106.761 L130.55,106.761 L130.55,155.209 L202.497,155.209 C201.047,167.249 193.214,185.381 175.807,197.565 L175.563,199.187 L214.318,229.21 L217.003,229.478 C241.662,206.704 255.878,173.196 255.878,133.451" fill="#4285F4" />
    <path d="M130.55,261.1 C165.798,261.1 195.389,249.495 217.003,229.478 L175.807,197.565 C164.783,205.253 149.987,210.62 130.55,210.62 C96.027,210.62 66.726,187.847 56.281,156.37 L54.75,156.5 L14.452,187.687 L13.925,189.152 C35.393,231.798 79.49,261.1 130.55,261.1" fill="#34A853" />
    <path d="M56.281,156.37 C53.525,148.247 51.93,139.543 51.93,130.55 C51.93,121.556 53.525,112.853 56.136,104.73 L56.063,103 L15.26,71.312 L13.925,71.947 C5.077,89.644 0,109.517 0,130.55 C0,151.583 5.077,171.455 13.925,189.152 L56.281,156.37" fill="#FBBC05" />
    <path d="M130.55,50.479 C155.064,50.479 171.6,61.068 181.029,69.917 L217.873,33.943 C195.245,12.91 165.798,0 130.55,0 C79.49,0 35.393,29.301 13.925,71.947 L56.136,104.73 C66.726,73.253 96.027,50.479 130.55,50.479" fill="#EB4335" />
  </svg>
)

export function LoginForm({
  className,
  callbackURL = "/dashboard",
  ...props
}: React.ComponentProps<"div"> & {
  callbackURL?: string
}) {
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [authError, setAuthError] = useState<AuthError | null>(null)
  const [loading, setLoading] = useState<LoadingStates>({
    magicLink: false,
    passkey: false,
    github: false,
    google: false
  })

  const formRef = useRef<HTMLFormElement>(null)
  const emailInputRef = useRef<HTMLInputElement>(null)

  // Email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      setEmailError("Email is required")
      return false
    }
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address")
      return false
    }
    setEmailError("")
    return true
  }

  // Clear errors when user starts typing
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    if (emailError) setEmailError("")
    if (authError) setAuthError(null)
  }

  // Generic error handler
  const handleAuthError = (error:any) => {
    console.log("Authentication error:", error)
    setAuthError({
      message: error.message || "An error occurred during sign in. Please try again.",
      code: error.code
    })
  }

  // Magic link sign in
  const handleMagicLinkSignIn = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateEmail(email)) {
      emailInputRef.current?.focus()
      return
    }
    try {
      const result = await signIn.magicLink(
        { email, callbackURL: "/dashboard" },
        {
          onRequest: () => setLoading(prev => ({ ...prev, magicLink: true })),
          onSuccess: () => {
            setLoading(prev => ({ ...prev, magicLink: false }))
          },
          onError: handleAuthError
        }
      )

      // Handle success - could show a success message
      if (result?.data?.status) {
        setAuthError(null)
        toast.success("Magic link sent! Please check your email.")
      }
    } catch (error) {
      handleAuthError(error)
    } finally {
      setLoading(prev => ({ ...prev, magicLink: false }))
    }
  }

  // Passkey sign in
  const handlePasskeySignIn = async () => {
    setLoading(prev => ({ ...prev, passkey: true }))
    setAuthError(null)

    try {
      await signIn.passkey()
    } catch (error) {
      handleAuthError(error)
    } finally {
      setLoading(prev => ({ ...prev, passkey: false }))
    }
  }

  // Social sign in
  const handleSocialSignIn = async (provider: "github" | "google") => {
    setLoading(prev => ({ ...prev, [provider]: true }))
    setAuthError(null)

    try {
      await signIn.social({
        provider,
        callbackURL
      })
    } catch (error) {
      handleAuthError(error)
    } finally {
      setLoading(prev => ({ ...prev, [provider]: false }))
    }
  }

  const appName = process.env.NEXT_PUBLIC_APP_NAME || "App"
  const isAnyLoading = Object.values(loading).some(Boolean)

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form ref={formRef} onSubmit={handleMagicLinkSignIn} noValidate>
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex flex-col items-center gap-2 font-medium">
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6 text-green-500" />
              </div>
              <span className="sr-only">{appName}</span>
            </div>
            <h1 className="text-xl font-bold">Welcome to {appName}</h1>
          </div>

          {/* Error Display */}
          {authError && (
            <Alert variant="destructive" role="alert">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{authError.message}</AlertDescription>
            </Alert>
          )}

          {/* Email Form */}
          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                ref={emailInputRef}
                id="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="m@example.com"
                required
                autoComplete="email"
                disabled={isAnyLoading}
                className={emailError ? "border-red-500 focus:border-red-500" : ""}
                aria-invalid={!!emailError}
                aria-describedby={emailError ? "email-error" : undefined}
              />
              {emailError && (
                <p id="email-error" className="text-sm text-red-500" role="alert">
                  {emailError}
                </p>
              )}
            </div>

            {/* Magic Link Button */}
            <Button
              type="submit"
              disabled={isAnyLoading}
              className="w-full bg-green-700 hover:bg-green-800"
            >
              {loading.magicLink ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Sending magic link...
                </>
              ) : (
                "Sign in with Magic Link"
              )}
            </Button>

            {/* Passkey Button */}
            <Button
              variant="outline"
              type="button"
              className="w-full"
              onClick={handlePasskeySignIn}
              disabled={isAnyLoading}
            >
              {loading.passkey ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Key className="mr-2 size-4" />
                  Sign in with Passkey
                </>
              )}
            </Button>
          </div>

          {/* Divider */}
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>

          {/* Social Buttons */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Button
              variant="outline"
              type="button"
              className="w-full"
              onClick={() => handleSocialSignIn("github")}
              disabled={isAnyLoading}
            >
              {loading.github ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <GithubIcon className="mr-2" />
                  GitHub
                </>
              )}
            </Button>

            <Button
              variant="outline"
              type="button"
              className="w-full"
              onClick={() => handleSocialSignIn("google")}
              disabled={isAnyLoading}
            >
              {loading.google ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <GoogleIcon className="mr-2" />
                  Google
                </>
              )}
            </Button>
          </div>
        </div>
      </form>

      {/* Terms */}
      <div className="text-center text-xs text-balance text-muted-foreground">
        By continuing, you agree to our{" "}
        <a href="/terms" className="underline underline-offset-4 hover:text-primary">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="/privacy" className="underline underline-offset-4 hover:text-primary">
          Privacy Policy
        </a>
        .
      </div>
    </div>
  )
}