"use client";

import { useState, useEffect } from "react";
import clsx from "clsx";
import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import { ProjectMedia } from "@/src/interfaces";
import { ProjectCardActions } from "./ProjectCardActions";
import { formatNumber } from "@/utils/formatters";

interface PropertyCardProps {
  id: number;
  name?: string;
  location?: string;
  images: ProjectMedia[];
  price?: number;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpots?: number;
  url: string;
  isFromMap?: boolean;
  onClose?: (() => void) | null;
  showActions?: boolean;
  onDelete?: (id: number, name: string) => void;
  priorityImage?: boolean;
  openInNewTab?: boolean;
}

export function PropertyCard({
  id,
  name,
  location,
  images,
  price,
  area,
  bedrooms,
  bathrooms,
  parkingSpots,
  url,
  isFromMap,
  onClose,
  showActions = false,
  onDelete,
  priorityImage = true,
  openInNewTab = true,
}: PropertyCardProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered && images.length > 1) {
      const interval = setInterval(
        () => setCurrentImage((prev) => (prev + 1) % images.length),
        1000
      );
      return () => clearInterval(interval);
    }
  }, [isHovered, images]);

  return (
    <Link
      href={`${url}/${id}`}
      target={openInNewTab ? "_blank" : undefined}
      rel={openInNewTab ? "noopener noreferrer" : undefined}
    >
      <div
        className={clsx(
          "relative w-full h-full cursor-pointer overflow-hidden rounded-lg bg-client-primary shadow-sm shadow-white",
          isFromMap && "z-20"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setCurrentImage(0);
        }}
      >
        <div className="relative flex h-full flex-col rounded-lg bg-client-primaryDark">
          {onClose && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onClose();
              }}
              className="absolute right-2 top-2 z-20 rounded-full bg-black bg-opacity-50 p-2 text-white transition-all hover:bg-opacity-75"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          {images.length > 0 ? (
            <div
              className={clsx(
                "relative w-full overflow-hidden",
                !isFromMap ? "h-full flex-shrink-0" : "h-72"
              )}
            >
              {images.map((img, index) => {
                const shouldPrioritize = priorityImage && index === 0;
                return (
                  <Image
                    key={index + img.projectId}
                    src={img.url}
                    alt={img.tag}
                    fill
                    priority={shouldPrioritize}
                    loading={shouldPrioritize ? "eager" : "lazy"}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={clsx(
                      "absolute left-0 top-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out",
                      index === currentImage ? "opacity-100" : "opacity-0"
                    )}
                  />
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-white bg-gray-700">
              Sin imagen
            </div>
          )}

          {price && (
            <div className="absolute left-2 top-2 z-10 rounded-full bg-black bg-opacity-75 px-2 py-1 text-sm text-white">
              ${formatNumber(price)}
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black via-gray-800 to-transparent px-2 pb-2 pt-16">
            <h3 className="line-clamp-1 break-words text-lg font-semibold leading-tight text-white">
              {location}
            </h3>

            <p className="truncate break-all leading-tight w-full overflow-hidden text-sm text-gray-300">
              {name}
            </p>

            <div className="mt-2 flex items-center text-xs text-gray-300 divide-x divide-gray-600">
              {typeof area === "number" && area > 0 && (
                <p className="pr-2">{area}m²</p>
              )}
              {typeof bedrooms === "number" && bedrooms > 0 && (
                <p className="pl-2 pr-2">{bedrooms} Hab.</p>
              )}
              {typeof bathrooms === "number" && bathrooms > 0 && (
                <p className="pl-2 pr-2">{bathrooms} Baños.</p>
              )}
              {typeof parkingSpots === "number" && parkingSpots > 0 && (
                <p className="pl-2">{parkingSpots} Parq.</p>
              )}
            </div>
          </div>
        </div>

        {showActions && onDelete && (
          <ProjectCardActions
            id={id}
            name={name || ""}
            urlEdit={`${id}`}
            onDelete={onDelete}
          />
        )}
      </div>
    </Link>
  );
}
