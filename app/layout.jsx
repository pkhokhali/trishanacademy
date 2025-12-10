import './globals.css'
import ConditionalLayout from './ConditionalLayout'

export const metadata = {
  title: 'Trishan Academy - Empowering Future Leaders',
  description: 'Trishan Academy - A premier educational institution dedicated to nurturing young minds and shaping future leaders.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  )
}
