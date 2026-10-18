import { apiClient } from "@/src/lib";
import { ProjectSummary, ProjectDetails } from "@/src/interfaces";

export interface SearchProjectsParams {
  page: number;
  pageSize: number;
  searchTerm?: string | null;
  projectTypeId?: number | null;
  price?: number | null;
  area?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  lobbies?: number | null;
  cities?: number[] | null;
  propertyTypes?: number[] | null;
  housingTypes?: number[] | null;
  memberships?: number[] | null;
  commonAreas?: number[] | null;
  nearbyServices?: number[] | null;
  minLat?: number | null;
  maxLat?: number | null;
  minLng?: number | null;
  maxLng?: number | null;
}

export interface SearchProjectsResponse {
  projects: ProjectSummary[];
  totalEntries: number;
}

export class ProjectService {
  static async search(
    params: SearchProjectsParams,
    options?: RequestInit
  ): Promise<SearchProjectsResponse> {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === undefined) return;

      if (Array.isArray(value)) {
        query.append(key, value.join(","));
      } else {
        query.append(key, value.toString());
      }
    });

    return apiClient.get<SearchProjectsResponse>(
      `/api/projects?${query.toString()}`,
      options
    );
  }

  static async getById(
    id: number,
    isProject?: boolean,
    isAdmin?: boolean
  ): Promise<{ project: ProjectDetails }> {
    const query = new URLSearchParams({
      isProject: isProject ? "1" : "0",
      isAdmin: isAdmin ? "1" : "0",
    });

    return apiClient.get<{ project: ProjectDetails }>(
      `/api/projects/${id}?${query.toString()}`
    );
  }

  static async getByIdServer(
    id: number,
    isProject?: boolean,
    isAdmin?: boolean
  ): Promise<{ project: ProjectDetails }> {
    const query = new URLSearchParams({
      isProject: isProject ? "1" : "0",
      isAdmin: isAdmin ? "1" : "0",
    });

    const baseUrl =
      process.env.INTERNAL_API_URL ?? process.env.NEXT_PUBLIC_API_URL;
    const url = baseUrl
      ? `${baseUrl}/api/projects/${id}?${query.toString()}`
      : `/api/projects/${id}?${query.toString()}`;

    return apiClient.get<{ project: ProjectDetails }>(url, {
      cache: "no-store",
    });
  }

  static async create(data: unknown): Promise<number> {
    const result = await apiClient.post<{ projectId: number }, unknown>(
      "/api/projects",
      data
    );
    return result.projectId;
  }

  static async update(data: unknown): Promise<void> {
    await apiClient.put<void, unknown>("/api/projects", data);
  }

  static async delete(id: number): Promise<void> {
    await apiClient.delete<void>(`/api/projects?id=${id}`);
  }

  static async deletePermanently(id: number): Promise<void> {
    await apiClient.delete<void>(`/api/projects/${id}`);
  }
}
