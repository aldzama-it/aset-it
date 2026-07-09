'use client'

import { TopProgressBar } from './TopProgressBar'
import { PageTransition } from './PageTransition'

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopProgressBar />
      <PageTransition>
        {children}
      </PageTransition>
    </>
  )
}
