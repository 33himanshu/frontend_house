"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { MapLocation } from "@/components/map-location"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  total_sqft: z.coerce.number().positive("Square footage must be positive"),
  bath: z.coerce.number().int().positive("Number of bathrooms must be positive"),
  balcony: z.coerce.number().int().min(0, "Number of balconies cannot be negative"),
  bhk: z.coerce.number().int().positive("Number of bedrooms must be positive"),
  price_per_sqft: z.coerce.number().positive("Price per square foot must be positive"),
  area_type: z.string().min(1, "Please select an area type"),
  availability: z.string().min(1, "Please select availability"),
  location: z.string().min(1, "Please select a location"),
})

type PredictionFormValues = z.infer<typeof formSchema>

export function PredictionForm() {
  const [prediction, setPrediction] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const form = useForm<PredictionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      total_sqft: 1000,
      bath: 2,
      balcony: 1,
      bhk: 2,
      price_per_sqft: 100,
      area_type: "",
      availability: "",
      location: "",
    },
  })

  async function onSubmit(values: PredictionFormValues) {
    setLoading(true)
    setError(null)
    setPrediction(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Failed to predict price. Please try again.")
      }

      const data = await response.json()
      setPrediction(data.predicted_price)
      toast({
        title: "Price Prediction Complete",
        description: `The estimated price is ₹${data.predicted_price.toFixed(2)} Lakhs`,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to predict price. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLocationSelect = (location: string) => {
    form.setValue("location", location)
  }

  return (
    <section id="prediction-form" className="w-full py-12 md:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Get Your House Price Prediction</h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Fill in the details below to get an accurate prediction of your property&apos;s value.
            </p>
          </div>
        </div>
        <div className="mx-auto mt-8 grid max-w-5xl gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
              <CardDescription>Enter the details of your property to get a price estimate.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="total_sqft"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Square Feet</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="1000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bath"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bathrooms</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="2" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="balcony"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Balconies</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bhk"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bedrooms (BHK)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="2" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="price_per_sqft"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price Per Sq.ft</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="100" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="area_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Area Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select area type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Super built-up Area">Super built-up Area</SelectItem>
                              <SelectItem value="Built-up Area">Built-up Area</SelectItem>
                              <SelectItem value="Carpet Area">Carpet Area</SelectItem>
                              <SelectItem value="Plot Area">Plot Area</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="availability"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Availability</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select availability" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Ready To Move">Ready To Move</SelectItem>
                              <SelectItem value="Under Construction">Under Construction</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter location" {...field} />
                        </FormControl>
                        <FormDescription>Or select a location on the map below</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="h-[300px] w-full rounded-md border overflow-hidden">
                    <MapLocation onLocationSelect={handleLocationSelect} />
                  </div>
                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? "Predicting..." : "Predict Price"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Price Prediction</CardTitle>
                <CardDescription>Your estimated property value based on the provided details.</CardDescription>
              </CardHeader>
              <CardContent>
                {prediction !== null && (
                  <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-900">
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <AlertTitle className="text-green-800 dark:text-green-300">Prediction Complete</AlertTitle>
                    <AlertDescription className="text-green-700 dark:text-green-400">
                      <p className="mt-2 text-2xl font-bold">₹{prediction.toFixed(2)} Lakhs</p>
                      <p className="mt-1 text-sm">Based on the property details you provided</p>
                    </AlertDescription>
                  </Alert>
                )}
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {!prediction && !error && (
                  <div className="flex flex-col items-center justify-center h-[200px] text-center text-gray-500 dark:text-gray-400">
                    <p>Fill in the property details and click &quot;Predict Price&quot; to get an estimate.</p>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Enter your property details in the form</li>
                  <li>Select your location on the map or type it in</li>
                  <li>Click the &quot;Predict Price&quot; button</li>
                  <li>Get an instant price prediction based on our advanced algorithm</li>
                </ol>
              </CardContent>
              <CardFooter className="flex justify-between border-t px-6 py-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Our predictions are based on historical data and market trends.
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
