import type { Metadata } from 'next'
import './globals.css'
import { BottomNavigation } from '@/components/bottom-navigation'
import { ThemeProvider } from '@/components/theme-provider'

export const metadata: Metadata = {
  title: 'TRBE - Fan Engagement Platform',
  description: 'The ultimate fan engagement platform with gamification, rewards, and community features',
  generator: 'TRBE',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
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
