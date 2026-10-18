"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Map as LeafletMap } from "leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { Loader } from "@/src/components/shared/Loader";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src ?? markerIcon2x,
  iconUrl: markerIcon.src ?? markerIcon,
  shadowUrl: markerShadow.src ?? markerShadow,
});

interface ContactMapLeafletProps {
  coordinates: { lat: number; lng: number };
}

export function ContactMapLeaflet({ coordinates }: ContactMapLeafletProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const mapRef = useRef<LeafletMap | null>(null);

  const mapCenter = useMemo(() => coordinates, [coordinates]);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(mapCenter, mapRef.current.getZoom() ?? 15);
    }
  }, [mapCenter]);

  return (
    <div className="relative w-full h-full z-0 isolate">
      {!isLoaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <Loader size={48} />
        </div>
      )}
      <MapContainer
        center={mapCenter}
        zoom={15}
        zoomControl
        className="relative z-0"
        style={{ width: "100%", height: "100%", zIndex: 0 }}
        ref={mapRef}
        whenReady={() => setIsLoaded(true)}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={mapCenter} />
      </MapContainer>
    </div>
  );
}
