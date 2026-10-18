import Image from "next/image";
import { formatNumber } from "@/utils/formatters";

interface Project {
  id: number;
  images: string[];
  name: string;
  location: string;
  price: number;
  area: number;
  deliveryTime: string;
  rooms: string;
}

interface RecommendedProjectsProps {
  projects: Project[];
}

export function RecommendedProjects({
  projects,
}: RecommendedProjectsProps) {
  return (
    <div className="my-12 px-8">
      <h2 className="mb-6 text-3xl font-semibold" style={{ color: "#5D4037" }}>
        Otras propiedades que podrían interesarte
      </h2>
      <div className="flex space-x-6 overflow-x-auto">
        {projects.map((project) => (
          <div
            key={project.id}
            className="relative min-w-[250px] max-w-[300px] flex-shrink-0 overflow-hidden rounded-lg bg-white shadow-md"
            style={{
              border: "2px solid #DAA520",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
            }}
          >
            <div className="absolute left-2 top-2 flex flex-col space-y-1">
              <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                {project.deliveryTime}
              </span>
              <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                {project.rooms}
              </span>
            </div>

            <div className="relative h-40 w-full">
              <Image
                src={project.images[0]}
                alt={project.name}
                fill
                className="rounded-t-lg object-cover"
              />
            </div>

            <div className="p-4">
              <h3
                className="line-clamp-1 text-lg font-semibold text-gray-800"
                style={{ color: "#5D4037" }}
              >
                {project.name}
              </h3>
              <p className="line-clamp-1 text-sm text-gray-600">
                {project.location}
              </p>
              <p className="mt-2 text-sm font-semibold text-gray-800">
                Precio desde
              </p>
              <p className="text-base font-bold" style={{ color: "#8B4513" }}>
                ${formatNumber(project.price)} COP
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
