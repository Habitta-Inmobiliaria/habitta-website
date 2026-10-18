"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import clsx from "clsx";
import Image from "next/image";
import type { ProjectMedia } from "@/src/interfaces";
import { formatNumber } from "@/utils/formatters";

interface ProjectCardProps {
  id: number;
  images: ProjectMedia[];
  name: string;
  location: string;
  price?: number;
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpots?: number;
}

export function ProjectCard({
  id,
  images,
  name,
  location,
  price,
  area,
  bedrooms,
  bathrooms,
  parkingSpots,
}: ProjectCardProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) {
      const interval = setInterval(
        () => setCurrentImage((prev) => (prev + 1) % images.length),
        1000
      );
      return () => clearInterval(interval);
    }
  }, [isHovered, images.length]);

  return (
    <div className="transform rounded-lg bg-transparent transition-transform duration-300 hover:scale-105 dark:bg-transparent">
      <Link
        href={`/inmobiliaria/${id}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div
          className={clsx(
            "relative max-w-xs cursor-pointer overflow-hidden rounded-lg bg-premium-secondary shadow-md shadow-premium-secondary dark:bg-premium-secondaryDark dark:shadow-md dark:shadow-white",
            "z-0 h-[370px]"
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            setCurrentImage(0);
          }}
        >
          <div className="relative flex h-full flex-col rounded-lg bg-premium-background dark:bg-premium-secondaryDark">
            <div
              className={clsx(
                "relative z-0 w-full overflow-hidden",
                "h-full flex-shrink-0"
              )}
            >
              {images.map((img, index) => (
                <Image
                  key={index}
                  src={img.url}
                  alt={img.tag}
                  fill
                  priority={index === 0}
                  loading={index === 0 ? "eager" : "lazy"}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className={clsx(
                    "absolute left-0 top-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out",
                    index === currentImage ? "opacity-100" : "opacity-0"
                  )}
                />
              ))}
            </div>

            {price && (
              <div className="absolute left-2 top-2 z-50 rounded-full bg-black bg-opacity-75 px-2 py-1 text-sm text-white">
                ${formatNumber(price)}
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-premium-secondaryDark via-premium-secondaryDark to-transparent px-2 pb-2 pt-16 dark:from-black dark:via-gray-800">
              <h3 className="line-clamp-1 break-words text-lg font-semibold leading-tight text-white">
                {location}
              </h3>

              <p className="truncate break-all leading-tight w-full overflow-hidden text-sm text-gray-300">
                {name}
              </p>

              <div className="flex items-center text-xs text-gray-300 divide-x divide-gray-400 dark:divide-gray-600">
                {area > 0 && <p className="pr-2">{area}m²</p>}
                {bedrooms && <p className="pl-2 pr-2">{bedrooms} Hab.</p>}
                {bathrooms && <p className="pl-2 pr-2">{bathrooms} Baños.</p>}
                {parkingSpots && <p className="pl-2">{parkingSpots} Parq.</p>}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
