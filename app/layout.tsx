import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Pehchaan Kaun? 🇮🇳 - Daily Indian GK Challenge',
  description: 'Test your Indian general knowledge with daily puzzles. Guess the personality before using all clues!',
  keywords: ['Indian GK', 'daily puzzle', 'guessing game', 'Wordle', 'India', 'quiz'],
  authors: [{ name: 'Pehchaan Kaun Team' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Pehchaan Kaun?',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: 'Pehchaan Kaun? 🇮🇳',
    description: 'Daily Indian GK Challenge',
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
  // Security headers
  other: {
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; font-src 'self' data: fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self'",
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
