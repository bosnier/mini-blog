import type { Metadata } from "next"
import { Brygada_1918, Inter, JetBrains_Mono } from "next/font/google"
import "@/app/globals.css"
import { auth } from "@/auth"
import SignOut from "@/components/features/header/sign-out"
import SignIn from "@/components/features/header/sign-in"
import { ThemeProvider } from "@/components/features/themes/theme-provider"
import { ThemeToggle } from "@/components/features/themes/theme-toggle"
import UserProfileBadge from "@/components/features/header/user-profile-badge"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import Link from "next/link"

const inter = Inter({
  variable: "--font-inter-sans",
  subsets: ["cyrillic", "latin"],
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["cyrillic", "latin"],
})

const brygadaSerif = Brygada_1918({
  variable: "--font-brygada-serif",
  subsets: ["cyrillic", "latin"],
})

export const metadata: Metadata = {
  title: {
    template: "%s | MiniBlog",
    default: "MiniBlog",
  },
  description: "Just a mini blog site.",
  metadataBase: new URL("http://localhost:3000"),
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await auth()

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${brygadaSerif.variable} antialiased min-h-dvh`}>
        <main className="flex flex-col max-w-3xl mx-auto pb-4">
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem enableColorScheme>
            <header className="flex items-center p-2 gap-2 sticky top-0 mb-2 justify-end backdrop-blur-xs bg-background/80">
              <Link href="/" className="me-auto">
                <Button variant="secondary" size="icon">
                  <Home />
                </Button>
              </Link>
              {session && <UserProfileBadge session={session} />}
              {session?.user ? <SignOut /> : <SignIn />}
              <ThemeToggle />
            </header>
            {children}
          </ThemeProvider>
        </main>
      </body>
    </html>
  )
}
