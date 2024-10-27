import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Compass } from "lucide-react";
import "leaflet-bounce-marker";

export default function Map({ onPinDrop, selectedPin, pins }) {
  const mapRef = useRef(null);
  const markerRef = useRef([]);

  useEffect(() => {
    if (!mapRef.current) {
      // Initialize the map
      mapRef.current = L.map("map", { center: [51.505, -0.09], zoom: 13 });

      // Set map tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "Map data © OpenStreetMap contributors",
      }).addTo(mapRef.current);
    }
  }, []);

  useEffect(() => {
    // Clear existing markers
    markerRef.current.forEach((marker) => mapRef.current.removeLayer(marker));
    markerRef.current = [];

    // Add all pins from the pins prop
    pins.forEach((pin) => {
      const marker = L.marker([pin.lat, pin.lng], {
        icon: L.icon({
          iconUrl: "/custom-pin.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        }),
      })
        .addTo(mapRef.current)
        .bindPopup(pin.remark)
        .openPopup();

      markerRef.current.push(marker); // Store marker reference
    });
  }, [pins]); // Update markers whenever pins change

  // Handle pin drop with address fetch
  useEffect(() => {
    const handleMapClick = async (e) => {
      const { lat, lng } = e.latlng;
      const remark = prompt("Enter a remark for this pin:");
      let address = "";

      if (remark) {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
          const data = await response.json();
          address = data.display_name;
        } catch (error) {
          console.error("Address fetch failed", error);
        }
        onPinDrop({ lat, lng, remark, address });
      }
    };

    mapRef.current.on("click", handleMapClick);

    return () => {
      mapRef.current.off("click", handleMapClick);
    };
  }, [onPinDrop]);

  useEffect(() => {
    if (selectedPin && mapRef.current) {
      mapRef.current.setView([selectedPin.lat, selectedPin.lng], 13);
    }
  }, [selectedPin]);

  const navigateToLocation = () => {
    if (selectedPin && mapRef.current) {
      mapRef.current.setView([selectedPin.lat, selectedPin.lng], 13);
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        mapRef.current.setView([latitude, longitude], 13);
      });
    }
  };

  return (
    <div className="relative w-full h-full">
      <div id="map" className="w-full h-full" />
      <button
        onClick={navigateToLocation}
        className="absolute bottom-5 right-5 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition"
        title="Navigate to location"
      >
        <Compass className="w-6 h-6 text-red-700" />
      </button>
    </div>
  );
}
