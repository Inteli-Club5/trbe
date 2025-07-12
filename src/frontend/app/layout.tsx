import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { AppKit } from "../context/appkit"
import { LayoutWrapper } from '@/components/layout-wrapper'
import { Toaster } from '@/components/ui/toaster'

export const metadata: Metadata = {
  title: 'TRBE - Fan Engagement Platform',
  description: 'The ultimate fan engagement platform with gamification, rewards, and community features',
  generator: 'TRBE',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' }
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
        <AppKit>
          <ThemeProvider>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
            <Toaster />
          </ThemeProvider>
        </AppKit>
      </body>
    </html>
  )
}