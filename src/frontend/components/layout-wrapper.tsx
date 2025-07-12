'use client'

import { usePathname } from 'next/navigation'
import { BottomNavigation } from '@/components/bottom-navigation'

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith('/auth')
  const isNotFoundPage = pathname === '/not-found' || pathname === '/404'

  return (
    <>
      <div className={isAuthPage || isNotFoundPage ? '' : 'pb-28'}>
        {children}
      </div>
      {!isAuthPage && !isNotFoundPage && <BottomNavigation />}
    </>
  )
}