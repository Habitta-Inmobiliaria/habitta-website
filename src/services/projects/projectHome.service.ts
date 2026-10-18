import { apiClient } from "@/src/lib";
import type { ProjectView } from "@/src/interfaces";

export interface GetHomeProjectsParams {
  numberProjects: number;
  isProperty: boolean;
}

export interface GetHomeProjectsResponse {
  projects: ProjectView[];
}

export class ProjectHomeService {
  static async getHomeProjects(
    params: GetHomeProjectsParams
  ): Promise<GetHomeProjectsResponse> {
    const endpoint = params.isProperty ? "realEstate" : "company";
    const query = new URLSearchParams({
      numberProjects: String(params.numberProjects),
    });

    return apiClient.get<GetHomeProjectsResponse>(
      `/api/projects/home/${endpoint}?${query.toString()}`
    );
  }

  static async getHomeProjectsServer(
    params: GetHomeProjectsParams
  ): Promise<GetHomeProjectsResponse> {
    const endpoint = params.isProperty ? "realEstate" : "company";
    const query = new URLSearchParams({
      numberProjects: String(params.numberProjects),
    });
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const url = baseUrl
      ? `${baseUrl}/api/projects/home/${endpoint}?${query.toString()}`
      : `/api/projects/home/${endpoint}?${query.toString()}`;

    return apiClient.get<GetHomeProjectsResponse>(url, {
      cache: "no-store",
    });
  }
}
