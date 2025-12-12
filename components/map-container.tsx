"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { X, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

// Define your travel locations here
const locations = [
  {
    id: 1,
    name: "Copenhagen, Denmark",
    lat: 55.6761,
    lng: 12.5683,
    photo: "/copenhagen.jpg",
    color: "bg-blue-500",
    moment:
      "Walking along the harbor during my first week, I remember feeling how calm and considered everything seemed. New buildings sit right beside old streets without competing for attention, and the whole place feels edited in a good way.",
    question:
      "Copenhagen is known for renewing older structures instead of expanding outward. How will the city keep growing while protecting the character that makes it so timeless?",
    insight:
      "Good planning shapes how people move and feel. Copenhagen reminded me that density and comfort can work together.",
  },

  {
    id: 2,
    name: "Malmö, Sweden",
    lat: 55.605,
    lng: 13.0038,
    photo: "/malmo.jpg",
    color: "bg-emerald-500",
    moment:
      "Seeing the Turning Torso next to the quiet canals made me notice how Malmö mixes the futuristic with the familiar. The city feels calm, almost self-assured in its own rhythm.",
    question:
      "How has Malmö used modern design to shift its identity while still keeping neighborhoods livable and welcoming?",
    insight:
      "Big architectural statements can change how a city sees itself, but the smaller everyday spaces shape how people actually experience it.",
  },

  {
    id: 3,
    name: "Aalborg, Denmark",
    lat: 57.0488,
    lng: 9.9217,
    photo: "/aalborg.jpg",
    color: "bg-purple-500",
    moment:
      "Standing near Musikkens Hus, I noticed how the city feels both industrial and cultural at the same time. It’s small, but the ambitions feel bigger.",
    question:
      "Aalborg is planning for rising sea levels and more public access to the waterfront. How can it stay true to its roots while adapting for the future?",
    insight:
      "Smaller cities can transform themselves, but it takes a careful balance between growth and preserving identity.",
  },

  {
    id: 4,
    name: "Cologne, Germany",
    lat: 50.9375,
    lng: 6.9603,
    photo: "/koln.jpg",
    color: "bg-teal-500",
    moment:
      "Stepping out of the train station and immediately facing the cathedral was overwhelming in the best way. Everything around it feels practical, but the cathedral sets the emotional tone for the whole city.",
    question:
      "How do cities with major historical landmarks modernize without losing the identity that those landmarks create?",
    insight:
      "Landmarks become anchors in people’s mental map of a city. They connect old and new without needing to dominate everything.",
  },

  {
    id: 5,
    name: "Amsterdam, Netherlands",
    lat: 52.3676,
    lng: 4.9041,
    photo: "/amsterdam.jpg",
    color: "bg-orange-500",
    moment:
      "Amsterdam's houses clearly show traces of how life might have been in the past—narrow fronts, hoisting hooks, and compact layouts that reflect practical needs shaped by trade and limited space. The canal network itself feels like an organizing spine for the city, guiding movement and framing everyday life.",
    question:
      "How has Amsterdam handled heavy tourism while still keeping everyday life comfortable for residents?",
    insight:
      "Human-scale design makes it easier to pay attention. Cities you can walk through help you form real memories instead of quick impressions.",
  },

  {
    id: 6,
    name: "Tromsø, Norway",
    lat: 69.6496,
    lng: 18.956,
    photo: "/tromso.jpg",
    color: "bg-indigo-500",
    moment:
      "Tromsø’s city center is quiet but distinctly defined, especially when compared to the more residential Tromsdalen across the water. The surrounding mountains and sea make the city feel tightly framed by nature, almost as if the environment sets the boundaries for how the urban areas grow.",
    question:
      "As climate shifts in the Arctic, how will Tromsø keep its balance between nature, tourism, and local industries?",
    insight:
      "Extreme climates demand their own kind of resilience. Cities this far north adapt not only to weather, but also to darkness and isolation.",
  },

  {
    id: 7,
    name: "Vatican City",
    lat: 41.9029,
    lng: 12.4534,
    photo: "/vatican.jpg",
    color: "bg-amber-500",
    moment:
      "Walking through the Vatican felt surreal. The crowds, the scale, and the golden light made the whole place feel intentional and almost unreal.",
    question:
      "How does such a tiny territory maintain its public spaces while hosting constant waves of visitors?",
    insight:
      "Even symbolic places rely on everyday systems—maintenance, planning, governance. Sacred spaces still function as urban spaces.",
  },

  {
    id: 8,
    name: "Amalfi, Italy",
    lat: 40.634,
    lng: 14.602,
    photo: "/amalfi.jpg",
    color: "bg-pink-500",
    moment:
      "Walking up the hills felt like stepping into a vertical neighborhood. Everything is close, steep, and somehow cozy.",
    question:
      "With little flat land and narrow roads, how does Amalfi keep essential goods and daily life flowing for residents?",
    insight:
      "Landscape shapes lifestyle. In places built into mountains, slower rhythms and close communities feel natural.",
  },
]

export function MapContainer() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [selectedLocation, setSelectedLocation] = useState<(typeof locations)[0] | null>(null)

  useEffect(() => {
    // Only load Leaflet on client side
    if (typeof window !== "undefined" && mapRef.current && !map) {
      // Load Leaflet CSS
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      document.head.appendChild(link)

      // Load Leaflet JS
      const script = document.createElement("script")
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
      script.async = true

      script.onload = () => {
        const L = (window as any).L

        // Initialize map centered on Europe
        const newMap = L.map(mapRef.current).setView([51.5, 10.5], 3)

        L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
          attribution:
            '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
          maxZoom: 19,
        }).addTo(newMap)

        const markerColors = ["#3b82f6", "#f97316", "#a855f7", "#f59e0b", "#ec4899", "#14b8a6", "#6366f1", "#10b981"]

        // Add markers for each location
        locations.forEach((location, index) => {
          const color = markerColors[index % markerColors.length]
          const customIcon = L.divIcon({
            html: `<div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 3px 12px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center;"><div style="transform: rotate(45deg); color: white; font-weight: bold; font-size: 14px;">${location.id}</div></div>`,
            className: "",
            iconSize: [32, 32],
            iconAnchor: [16, 32],
          })

          const marker = L.marker([location.lat, location.lng], { icon: customIcon }).addTo(newMap)

          marker.on("click", () => {
            setSelectedLocation(location)
            newMap.flyTo([location.lat, location.lng], 8, {
              duration: 1.5,
            })
          })

          // Add tooltip on hover
          marker.bindTooltip(location.name, {
            permanent: false,
            direction: "top",
          })
        })

        setMap(newMap)
      }

      document.head.appendChild(script)
    }
  }, [map])

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="absolute top-0 left-0 right-0 z-[1000]
  bg-gradient-to-r from-primary/60 via-secondary/60 to-accent/60
  backdrop-blur-xl border-b border-white/20 shadow-lg">
        <div className="container mx-auto px-6 py-6">
          <h1 className="text-4xl font-bold tracking-tight text-balance text-white drop-shadow-md">
            Urban Journeys Through Europe
          </h1>
          <p className="text-white/90 text-base mt-2 leading-relaxed font-medium">
            Exploring the hidden stories and design principles that make cities come alive
          </p>
        </div>
      </div>

      {/* Map */}
      <div ref={mapRef} className="w-full h-full" />

      {/* Location Detail Panel */}
      {selectedLocation && (
        <div className="absolute top-32 right-6 bottom-6 w-full max-w-lg z-[1000] overflow-hidden animate-in slide-in-from-right duration-300">
          <Card className="h-full flex flex-col shadow-2xl border-2 border-primary/30 overflow-hidden">
            <div className="relative w-full h-80 flex-shrink-0 overflow-hidden">
              <img
                src={selectedLocation.photo || "/placeholder.svg"}
                alt={selectedLocation.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

              <div className="absolute top-4 right-4">
                <div
                  className={`${selectedLocation.color} text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg`}
                >
                  Stop {selectedLocation.id} of {locations.length}
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`${selectedLocation.color} w-2 h-2 rounded-full shadow-lg`}></div>
                      <MapPin className="h-5 w-5 text-white drop-shadow" />
                    </div>
                    <h2 className="text-3xl font-bold text-white text-balance drop-shadow-lg">
                      {selectedLocation.name}
                    </h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedLocation(null)}
                    className="flex-shrink-0 bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/40"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            <CardContent className="flex-1 overflow-y-auto p-0 bg-gradient-to-b from-card to-muted/30">
              <div className="p-6 space-y-6">
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="text-xs uppercase tracking-wider font-bold mb-3 text-primary flex items-center gap-2">
                    <span className={`inline-block w-2 h-2 rounded-full ${selectedLocation.color}`}></span>
                    The Moment
                  </h3>
                  <p className="text-sm leading-relaxed text-foreground">{selectedLocation.moment}</p>
                </div>

                <div className="bg-gradient-to-br from-secondary/10 via-accent/10 to-primary/10 rounded-xl p-5 border-2 border-secondary/30">
                  <h3 className="text-xs uppercase tracking-wider font-bold mb-3 text-secondary flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-secondary"></span>
                    The Question I Left With
                  </h3>
                  <p className="text-sm leading-relaxed italic font-medium text-foreground">
                    "{selectedLocation.question}"
                  </p>
                </div>

                <div className="bg-gradient-to-br from-primary via-accent to-secondary p-1 rounded-xl">
                  <div className="bg-card rounded-lg p-5">
                    <h3 className="text-xs uppercase tracking-wider font-bold mb-3 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-r from-primary to-secondary"></span>
                      Urban Insight
                    </h3>
                    <p className="text-sm leading-relaxed font-semibold text-foreground">{selectedLocation.insight}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {!selectedLocation && (
        <div className="absolute bottom-6 left-6 z-[1000] animate-in fade-in duration-500">
          <Card className="shadow-2xl border-2 border-primary/50 bg-gradient-to-br from-card via-card to-primary/5 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center flex-shrink-0 shadow-lg">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-base font-bold text-foreground mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Explore the Journey
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Click on any colorful map marker to discover urban stories and design insights from across Europe
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
