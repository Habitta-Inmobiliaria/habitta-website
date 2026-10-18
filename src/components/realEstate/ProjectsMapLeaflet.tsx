"use client";

import { useMemo, useRef, useState } from "react";
import type { LatLngBounds, Map as LeafletMap } from "leaflet";
import { Plus, Minus, LocateFixed } from "lucide-react";
import type { ProjectView } from "@/src/interfaces";
import { PropertyCard } from "@/src/components/realEstate";
import { LeafletProjectsMap } from "@/src/components/shared";
import { formatNumber } from "@/utils/formatters";

interface ProjectsMapLeafletProps {
  projects: ProjectView[];
  setBounds: (bounds: LatLngBounds | null) => void;
  showMap: boolean;
  highlightCoords?: { latitude: number; longitude: number } | null;
}

export function ProjectsMapLeaflet({
  projects,
  setBounds,
  showMap,
  highlightCoords,
}: ProjectsMapLeafletProps) {
  const [selectedProject, setSelectedProject] = useState<ProjectView | null>(
    null
  );
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);

  const validProjects = useMemo(() => {
    return projects
      .map((project) => ({
        ...project,
        latitude: parseFloat(project.latitude as unknown as string),
        longitude: parseFloat(project.longitude as unknown as string),
      }))
      .filter(
        (project) =>
          Number.isFinite(project.latitude) &&
          Number.isFinite(project.longitude)
      );
  }, [projects]);

  const projectById = useMemo(() => {
    return new Map(validProjects.map((project) => [project.id, project]));
  }, [validProjects]);

  const markers = useMemo(
    () =>
      validProjects.map((project) => ({
        id: project.id,
        lat: project.latitude,
        lng: project.longitude,
        price: project.price,
      })),
    [validProjects]
  );

  const handleMarkerClick = (marker: { id: number }) => {
    const selected = projectById.get(marker.id) ?? null;
    setSelectedProject(selected);
  };

  const handleCloseCard = () => {
    setSelectedProject(null);
  };

  const handleZoomIn = () => {
    const map = mapRef.current;
    if (map) {
      map.setZoom(map.getZoom() + 1);
    }
  };

  const handleZoomOut = () => {
    const map = mapRef.current;
    if (map) {
      map.setZoom(map.getZoom() - 1);
    }
  };

  const handleGoToUserLocation = () => {
    const map = mapRef.current;
    if (userLocation && map) {
      map.setView(userLocation, 14);
    } else {
      console.warn("No se pudo obtener la ubicacion del usuario.");
    }
  };

  const markerContent = (marker: { price?: number | null }) => `
    <div class="inline-flex w-max items-center justify-center whitespace-nowrap bg-client-accent hover:bg-client-accentHover border border-client-textSecondary hover:scale-105 focus:scale-105 focus:bg-client-accentLight text-client-white font-semibold py-1 px-3 rounded-full text-sm transition-all duration-300 ease-in-out">
      $${marker.price === null || marker.price === undefined ? "" : formatNumber(marker.price)}
    </div>
  `;

  return (
    <>
      <LeafletProjectsMap
        markers={markers}
        setBounds={setBounds}
        showMap={showMap}
        onMarkerClick={handleMarkerClick}
        onMapReady={(map) => {
          mapRef.current = map;
        }}
        onUserLocationChange={(location) => setUserLocation(location)}
        highlightCoords={highlightCoords}
        markerContent={markerContent}
        centerOnUser={false}
      />

      <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
        <button
          className="flex items-center justify-center w-12 h-12 bg-white text-black border-b border-gray-200 hover:bg-gray-100"
          onClick={handleZoomIn}
        >
          <Plus size={24} />
        </button>

        <button
          className="flex items-center justify-center w-12 h-12 bg-white text-black border-b border-gray-200 hover:bg-gray-100"
          onClick={handleZoomOut}
        >
          <Minus size={24} />
        </button>

        <button
          className="flex items-center justify-center w-12 h-12 bg-white text-gray-700 hover:bg-gray-100"
          onClick={handleGoToUserLocation}
        >
          <LocateFixed size={24} />
        </button>
      </div>

      {selectedProject && (
        <div className="absolute left-1/2 top-1/3 sm:top-4 z-20 w-72 -translate-x-1/2 transform rounded-lg shadow-lg sm:left-auto sm:right-4 sm:translate-x-0">
          <PropertyCard
            id={selectedProject.id}
            name={selectedProject.name}
            location={selectedProject.cityName}
            images={selectedProject.images}
            price={selectedProject.price || undefined}
            area={selectedProject.area || 0}
            bedrooms={selectedProject.bedrooms}
            bathrooms={selectedProject.bathrooms}
            parkingSpots={selectedProject.parkingSpots}
            url={`/inmobiliaria`}
            isFromMap={true}
            onClose={handleCloseCard}
          />
        </div>
      )}
    </>
  );
}
