'use client'

import { useActionState, useEffect, useState } from 'react'
import { login } from '@/app/login/actions'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Asterisk } from 'lucide-react'
import { LoadingButton } from '@/components/ui/LoadingButton'
import { toast } from 'sonner'

interface LoginFormProps {
  onSuccess: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(login, null)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (state?.success) {
      toast.success('Login successful!')
      onSuccess()
    } else if (state?.message) {
      toast.error(state.message)
    }
  }, [state, onSuccess])

  return (
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
          <Label htmlFor="username" className="text-gray-700 font-semibold">Username</Label>
          <Input 
            id="username" 
            name="username" 
            type="text" 
            placeholder="admin" 
            required 
            disabled={isPending}
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
              disabled={isPending}
              className="h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white transition-colors pr-10"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isPending}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <LoadingButton 
          type="submit" 
          isLoading={isPending}
          className="w-full h-12 rounded-xl text-base font-semibold bg-primary hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
        >
          Log In
        </LoadingButton>
      </form>
    </div>
  )
}
