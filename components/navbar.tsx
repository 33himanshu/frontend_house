"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, LogIn, UserPlus } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export function Navbar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Home className="h-5 w-5" />
          <span>HomePricePro</span>
        </Link>
        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground">Welcome, {user.username}</span>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="gap-1">
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="gap-1">
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
