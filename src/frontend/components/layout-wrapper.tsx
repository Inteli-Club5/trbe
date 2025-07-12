'use client'

import { usePathname } from 'next/navigation'
import { BottomNavigation } from '@/components/bottom-navigation'

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith('/auth')

  return (
    <>
      <div className={isAuthPage ? '' : 'pb-28'}>
        {children}
      </div>
      {!isAuthPage && <BottomNavigation />}
    </>
  )
}