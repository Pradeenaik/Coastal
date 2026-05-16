import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import './globals.css'
import type { Metadata } from 'next'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-cormorant',
})
const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
})

export const metadata: Metadata = {
  title: 'Murdeshwar Lodge | Coastal Hospitality',
  description: 'Stay near Murdeshwar Temple. Comfortable rooms, sea breeze, and peaceful coastal hospitality.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${dmSans.variable}`}>
        {children}
      </body>
    </html>
  )
}