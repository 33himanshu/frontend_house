import Link from "next/link"
import { Home } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Link href="/" className="flex items-center gap-1 text-lg font-bold">
            <Home className="h-5 w-5" />
            <span>HomePricePro</span>
          </Link>
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} HomePricePro. All rights reserved.
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/about" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
            About
          </Link>
          <Link href="/contact" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
            Contact
          </Link>
          <Link href="/privacy" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
            Privacy
          </Link>
          <Link href="/terms" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  )
}
