import { HeroSection } from "@/components/hero-section"
import { PredictionForm } from "@/components/prediction-form"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <PredictionForm />
      </main>
      <Footer />
    </div>
  )
}
