"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { LatLngBounds, Map as LeafletMap } from "leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import { formatNumber } from "@/utils/formatters";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src ?? markerIcon2x,
  iconUrl: markerIcon.src ?? markerIcon,
  shadowUrl: markerShadow.src ?? markerShadow,
});

const DEFAULT_CENTER = { lat: 4.5709, lng: -74.2973 };

interface MapMarker {
  id: number;
  lat: number;
  lng: number;
  price?: number | null;
}

type HighlightCoords =
  | { latitude: number; longitude: number }
  | { lat: number; lng: number };

interface LeafletProjectsMapProps {
  markers: MapMarker[];
  setBounds: (bounds: LatLngBounds) => void;
  showMap: boolean;
  onMarkerClick?: (marker: MapMarker) => void;
  onMapReady?: (map: LeafletMap) => void;
  onUserLocationChange?: (location: { lat: number; lng: number }) => void;
  highlightCoords?: HighlightCoords | null;
  markerContent?: (marker: MapMarker) => string;
  defaultCenter?: { lat: number; lng: number };
  centerOnUser?: boolean;
}

const createPriceMarkerIcon = (html: string) =>
  L.divIcon({
    className: "bg-transparent border-0 overflow-visible",
    html,
  });

function MapEventHandler({
  onBoundsChange,
  onMapReady,
}: {
  onBoundsChange: (bounds: LatLngBounds) => void;
  onMapReady?: (map: LeafletMap) => void;
}) {
  const map = useMapEvents({
    moveend: () => onBoundsChange(map.getBounds()),
    zoomend: () => onBoundsChange(map.getBounds()),
  });

  useEffect(() => {
    onMapReady?.(map);
    onBoundsChange(map.getBounds());
  }, [map, onBoundsChange, onMapReady]);

  return null;
}

export function LeafletProjectsMap({
  markers,
  setBounds,
  showMap,
  onMarkerClick,
  onMapReady,
  onUserLocationChange,
  highlightCoords,
  markerContent,
  defaultCenter = DEFAULT_CENTER,
  centerOnUser = true,
}: LeafletProjectsMapProps) {
  const [currentCenter, setCurrentCenter] = useState(defaultCenter);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const lastBoundsRef = useRef<string>("");

  const resolvedHighlight = useMemo(() => {
    if (!highlightCoords) return null;
    if ("lat" in highlightCoords) {
      return { lat: highlightCoords.lat, lng: highlightCoords.lng };
    }
    return { lat: highlightCoords.latitude, lng: highlightCoords.longitude };
  }, [highlightCoords]);

  useEffect(() => {
    if (!navigator?.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        if (centerOnUser) {
          setCurrentCenter(location);
        }
        setUserLocation(location);
        onUserLocationChange?.(location);
      },
      (error) => {
        console.error(
          "Error obteniendo la ubicacion del usuario:",
          error.message
        );
        setCurrentCenter(defaultCenter);
      }
    );
  }, [centerOnUser, defaultCenter, onUserLocationChange]);

  useEffect(() => {
    if (!resolvedHighlight || !mapRef.current) return;
    mapRef.current.setView(resolvedHighlight, 14);
  }, [resolvedHighlight]);

  const handleBoundsChanged = useCallback(
    (bounds: LatLngBounds) => {
      if (!showMap) return;
      const boundsSignature = bounds.toBBoxString();
      if (boundsSignature === lastBoundsRef.current) {
        return;
      }
      lastBoundsRef.current = boundsSignature;
      setBounds(bounds);
    },
    [setBounds, showMap]
  );

  const handleMapReady = useCallback(
    (map: LeafletMap) => {
      mapRef.current = map;
      onMapReady?.(map);
    },
    [onMapReady]
  );

  return (
    <MapContainer
      center={currentCenter}
      zoom={12}
      zoomControl={false}
      className="relative z-0"
      style={{ width: "100%", height: "100%", zIndex: 0 }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapEventHandler
        onBoundsChange={handleBoundsChanged}
        onMapReady={handleMapReady}
      />

      {markers.map((marker) => {
        const html =
          markerContent?.(marker) ??
          `<div class="inline-flex w-max items-center justify-center whitespace-nowrap rounded-full bg-premium-primary px-3 py-1 text-sm font-semibold text-white transition-all duration-300 ease-in-out hover:bg-premium-primaryDark">$${marker.price === null || marker.price === undefined ? "" : formatNumber(marker.price)}</div>`;

        return (
          <Marker
            key={marker.id}
            position={{ lat: marker.lat, lng: marker.lng }}
            icon={createPriceMarkerIcon(html)}
            eventHandlers={{
              click: () => onMarkerClick?.(marker),
            }}
          />
        );
      })}

      {userLocation && <Marker position={userLocation} />}
      {resolvedHighlight && <Marker position={resolvedHighlight} />}
    </MapContainer>
  );
}
