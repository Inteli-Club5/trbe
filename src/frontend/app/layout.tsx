import type { Metadata } from 'next'
import './globals.css'
import { BottomNavigation } from '@/components/bottom-navigation'
import { ThemeProvider } from '@/components/theme-provider'

export const metadata: Metadata = {
  title: 'TRIBE - Fan Engagement Platform',
  description: 'The ultimate fan engagement platform with gamification, rewards, and community features',
  generator: 'TRIBE',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white dark:bg-black transition-colors" suppressHydrationWarning={true}>
        <ThemeProvider>
          <div className="pb-28">
            {children}
          </div>
          <BottomNavigation />
        </ThemeProvider>
      </body>
    </html>
  )
}
