'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { login } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Asterisk, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, null)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (state?.success) {
      toast.success('Login successful!')
      router.push('/dashboard')
    } else if (state?.message) {
      toast.error(state.message)
    }
  }, [state, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4 sm:p-8">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* Left Side - Decorative */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-primary/80 via-primary to-blue-900">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-50 mix-blend-overlay"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent opacity-60 mix-blend-overlay"></div>
          
          <div className="relative z-10">
            <div className="text-white">
              <Asterisk className="h-12 w-12" />
            </div>
          </div>
          
          <div className="relative z-10 mt-20 md:mt-0 text-white">
            <p className="text-white/80 font-medium mb-3 text-sm md:text-base">Inventaris IT</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
              Manage your IT assets for clarity and productivity
            </h1>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            <div className="text-primary mb-6">
              <Asterisk className="h-8 w-8" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">Welcome back</h2>
            <p className="text-gray-500 mb-8 text-sm">
              Access your dashboard to manage assets, track history, and keep everything flowing in one place.
            </p>

            <form action={formAction} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-semibold">Your email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="admin@admin.com" 
                  required 
                  className="h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-semibold">Password</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    name="password" 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="••••••••" 
                    required 
                    className="h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white transition-colors pr-10"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 rounded-xl text-base font-semibold bg-primary hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
                disabled={isPending}
              >
                {isPending ? 'Logging in...' : 'Log In'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
