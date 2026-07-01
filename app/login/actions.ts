'use server'

import { createSession, deleteSession } from '@/lib/session'

export async function login(prevState: any, formData: FormData) {
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  if (!username || !password) {
    return {
      message: 'Username and password are required',
    }
  }

  const validUsername = process.env.ADMIN_USERNAME || 'admin'
  const validPassword = process.env.ADMIN_PASSWORD || 'password123'

  if (username !== validUsername || password !== validPassword) {
    return {
      message: 'Invalid username or password',
    }
  }

  // Use a static ID for the env-based admin user
  await createSession('admin_env_user_id')

  return {
    success: true,
  }
}

import { redirect } from 'next/navigation'

export async function logout() {
  await deleteSession()
  redirect('/login')
}
