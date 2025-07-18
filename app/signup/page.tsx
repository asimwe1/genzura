"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Eye, EyeOff, Moon, Sun, Monitor, Package, Settings } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { toast } from "sonner"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [portalType, setPortalType] = useState("product")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }
    
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }
    
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      // Store user data and portal preference
      localStorage.setItem("isAuth", "true")
      localStorage.setItem("userEmail", email)
      localStorage.setItem("userPortal", portalType)
      
      setIsLoading(false)
      
      // Show success message
      toast.success("Account created successfully!")
      
      // Redirect directly to appropriate portal (no login redirect)
      window.location.href = portalType === "service" ? "/service" : "/product"
    }, 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      {/* Theme Toggler */}
      <div className="absolute top-4 right-4">
        <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-lg p-2 shadow-lg">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme("light")}
            className={theme === "light" ? "bg-blue-100 text-blue-600" : ""}
          >
            <Sun className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme("system")}
            className={theme === "system" ? "bg-blue-100 text-blue-600" : ""}
          >
            <Monitor className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme("dark")}
            className={theme === "dark" ? "bg-blue-100 text-blue-600" : ""}
          >
            <Moon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="w-full max-w-lg p-8 shadow-2xl">
        <CardHeader className="space-y-2 pb-2">
          <div className="flex flex-col items-center justify-center mb-6 gap-2">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mb-3">
              <Package className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-3xl text-center mb-2">Create Account</CardTitle>
          </div>
          <CardDescription className="text-center text-base mb-2">
            Welcome to the portal! Sign up to access your preferred dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2 pb-6 px-2">
          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="email" className="text-base">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full py-4 text-base"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="password" className="text-base">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pr-10 py-4 text-base"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="space-y-3">
              <Label htmlFor="confirmPassword" className="text-base">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full pr-10 py-4 text-base"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="space-y-4">
              <Label className="text-base font-medium">Select Portal Type *</Label>
              <RadioGroup
                value={portalType}
                onValueChange={setPortalType}
                className="grid grid-cols-2 gap-6"
              >
                <div>
                  <RadioGroupItem
                    value="product"
                    id="product"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="product"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-6 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <Package className="mb-3 h-7 w-7" />
                    <div className="space-y-1 text-center">
                      <p className="text-base font-medium leading-none">Product Portal</p>
                      <p className="text-xs text-muted-foreground">
                        Manage inventory, suppliers, and products
                      </p>
                    </div>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="service"
                    id="service"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="service"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-6 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <Settings className="mb-3 h-7 w-7" />
                    <div className="space-y-1 text-center">
                      <p className="text-base font-medium leading-none">Service Portal</p>
                      <p className="text-xs text-muted-foreground">
                        Manage services, reports, and operations
                      </p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <Button
              type="submit"
              className="w-full mt-2 py-4 text-lg"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
          <div className="mt-10 text-center">
            <p className="text-base text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 