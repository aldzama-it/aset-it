import { redirect } from 'next/navigation'

export default function Home() {
  // Redirect the root path to the dashboard. 
  // If the user is not authenticated, the middleware will intercept this and redirect to /login instead.
  redirect('/dashboard')
}
