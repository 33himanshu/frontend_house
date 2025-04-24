declare global {
  interface Window {
    google: {
      maps: {
        Map: any
        Marker: any
        LatLng: any
        LatLngBounds: any
        places: {
          SearchBox: any
        }
        Geocoder: any
      }
    }
  }
}

export {}
