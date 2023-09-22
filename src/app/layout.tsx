import '@/styles/globals.css'
import { Inter } from 'next/font/google'

import { cn } from '@/lib/utils'

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/Toaster"

import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Breadit',
  description: 'A Reddit clone built with Next.js and TypeScript.',
}

export default function RootLayout({
  children,
  authModal
}: {
  children: React.ReactNode
  authModal: React.ReactNode
}) {
  return (
    <html lang='PT-BR' className={cn('bg-white antialiased light', inter.className)}>
      <body className='min-h-screen pt-12'>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* @ts-expect-error server component */}
          <Navbar />

          {authModal}

          <div className='container max-w-7xl mx-auto h-full pt-12'>
            {children}
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
