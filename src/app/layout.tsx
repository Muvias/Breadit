import '@/styles/globals.css'
import { Inter } from 'next/font/google'

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/Toaster"

import Navbar from '@/components/Navbar'
import Providers from '@/components/Providers'

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
    <html lang='PT-BR' className={inter.className}>
      <body className='min-h-screen pt-12 bg-zinc-50 dark:bg-background antialiased'>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <Navbar />

            {authModal}

            <div className='container max-w-7xl mx-auto h-full pt-12'>
              {children}
            </div>
            <Toaster />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
