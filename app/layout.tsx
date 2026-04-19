import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Vivaio Manager',
  description: 'Gestione inventario vivaio ulivi e agrumi',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  )
}
