"use client"

import { useEffect, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

interface MapLocationProps {
  onLocationSelect: (location: string) => void
}

// Declare google as a global variable
declare global {
  interface Window {
    google?: any
  }
}

export function MapLocation({ onLocationSelect }: MapLocationProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)

  // Initialize Google Maps
  useEffect(() => {
    // Check if Google Maps script is already loaded
    if (window.google?.maps) {
      setMapLoaded(true)
      initializeMap()
      return
    }

    // Create script element to load Google Maps API
    const googleMapsScript = document.createElement("script")
    googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCTySZXxOv5tGnpOFGGZQcmaHcxsYI1nx8&libraries=places`
    googleMapsScript.async = true
    googleMapsScript.defer = true

    // Handle script load success
    googleMapsScript.onload = () => {
      setMapLoaded(true)
      initializeMap()
    }

    // Handle script load error
    googleMapsScript.onerror = () => {
      setMapError("Failed to load Google Maps. Please try again later.")
    }

    document.head.appendChild(googleMapsScript)

    // Cleanup function
    return () => {
      // Only remove the script if we added it
      if (document.head.contains(googleMapsScript)) {
        document.head.removeChild(googleMapsScript)
      }
    }
  }, [])

  // Initialize map once Google Maps is loaded
  const initializeMap = () => {
    if (!mapRef.current || !window.google?.maps) return

    try {
      // Create a new Google Map
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 12.9716, lng: 77.5946 }, // Default to Bangalore
        zoom: 12,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: false,
      })

      // Create a marker for selected location
      const marker = new window.google.maps.Marker({
        map: map,
        draggable: true,
        visible: false,
      })

      // Add click event to place marker
      map.addListener("click", (event: google.maps.MapMouseEvent) => {
        const latLng = event.latLng
        if (!latLng) return

        marker.setPosition(latLng)
        marker.setVisible(true)

        // Get location information
        const lat = latLng.lat()
        const lng = latLng.lng()
        const locationString = `${lat.toFixed(6)}, ${lng.toFixed(6)}`

        // Use reverse geocoding to get address
        const geocoder = new window.google.maps.Geocoder()
        geocoder.geocode({ location: latLng }, (results, status) => {
          if (status === "OK" && results && results[0]) {
            const address = results[0].formatted_address
            onLocationSelect(address)
          } else {
            // If geocoding fails, use coordinates
            onLocationSelect(locationString)
          }
        })
      })

      // Update location when marker is dragged
      marker.addListener("dragend", () => {
        const position = marker.getPosition()
        if (!position) return

        const lat = position.lat()
        const lng = position.lng()
        const locationString = `${lat.toFixed(6)}, ${lng.toFixed(6)}`

        // Use reverse geocoding to get address
        const geocoder = new window.google.maps.Geocoder()
        geocoder.geocode({ location: position }, (results, status) => {
          if (status === "OK" && results && results[0]) {
            const address = results[0].formatted_address
            onLocationSelect(address)
          } else {
            // If geocoding fails, use coordinates
            onLocationSelect(locationString)
          }
        })
      })

      // Create search box for location search
      const searchBox = new window.google.maps.places.SearchBox(
        document.getElementById("location-search") as HTMLInputElement,
      )

      // Bias the SearchBox results towards current map's viewport
      map.addListener("bounds_changed", () => {
        searchBox.setBounds(map.getBounds() as google.maps.LatLngBounds)
      })

      // Listen for the event fired when the user selects a prediction
      searchBox.addListener("places_changed", () => {
        const places = searchBox.getPlaces()
        if (!places || places.length === 0) return

        // For each place, get the location
        const bounds = new window.google.maps.LatLngBounds()

        places.forEach((place) => {
          if (!place.geometry || !place.geometry.location) return

          // Set marker at the selected place
          marker.setPosition(place.geometry.location)
          marker.setVisible(true)

          // Update the location in the form
          if (place.formatted_address) {
            onLocationSelect(place.formatted_address)
          } else {
            const lat = place.geometry?.location.lat()
            const lng = place.geometry?.location.lng()
            onLocationSelect(`${lat}, ${lng}`)
          }

          if (place.geometry.viewport) {
            // Only geocodes have viewport
            bounds.union(place.geometry.viewport)
          } else {
            bounds.extend(place.geometry.location)
          }
        })

        map.fitBounds(bounds)
      })
    } catch (error) {
      console.error("Error initializing Google Maps:", error)
      setMapError("Failed to initialize Google Maps. Please try again later.")
    }
  }

  const handleSearch = () => {
    if (!searchQuery || !window.google?.maps) return

    // Trigger the search box places_changed event programmatically
    const searchInput = document.getElementById("location-search") as HTMLInputElement
    if (searchInput) {
      // This will trigger the places_changed event on the search box
      searchInput.dispatchEvent(new Event("focus"))
      searchInput.value = searchQuery
      // We can't directly trigger the places_changed event, but we can simulate a search
      // by focusing and then pressing enter
      searchInput.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }))
    }
  }

  return (
    <div className="flex flex-col h-full w-full">
      <div className="p-2 bg-white dark:bg-gray-800 border-b">
        <div className="flex gap-2">
          <Input
            id="location-search"
            type="text"
            placeholder="Search for a location"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="button" size="icon" onClick={handleSearch}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative flex-1">
        {mapError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            <p className="text-sm text-red-500 bg-white/90 dark:bg-gray-800/90 p-2 rounded">{mapError}</p>
          </div>
        ) : !mapLoaded ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            <p className="text-sm text-gray-500">Loading map...</p>
          </div>
        ) : (
          <div ref={mapRef} className="h-full w-full" />
        )}
      </div>
    </div>
  )
}
