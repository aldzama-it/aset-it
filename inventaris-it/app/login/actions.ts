'use server'

import { createSession, deleteSession } from '@/lib/session'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function login(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return {
      message: 'Email and password are required',
    }
  }

  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    return {
      message: 'Invalid email or password',
    }
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    return {
      message: 'Invalid email or password',
    }
  }

  await createSession(user.id.toString())

  return {
    success: true,
  }
}

import { redirect } from 'next/navigation'

export async function logout() {
  await deleteSession()
  redirect('/login')
}
