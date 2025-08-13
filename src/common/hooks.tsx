import { useQuery } from "@tanstack/react-query"
import { API_URL } from "./constants"

export function useGetActivities() {
	return useQuery({
		queryKey: ["get_linkedin"],
		staleTime: Infinity,
		queryFn: async () => {
			const data = await makeAPICall(`${API_URL}/social/get-recent-activities`)
			return data as {
				success: boolean
				activity_list: IActivity[]
				media_list: IActivityMedia[]
			}
		}
	})
}
export interface IActivityMedia {
	id: number
	activity_id: number
	created_at: string
	url: string
	type: "image" | "video"
}
export interface IActivity {
	id: number
	content: string
	created_at: string
	url: null | string
	platform: "linkedin" | "youtube" | "twitter" | "post"
}
export function useGetAllProjects() {
	return useQuery({
		queryKey: ["get_all_projects"],
		staleTime: Infinity,
		queryFn: async () => {
			const data = await makeAPICall(`${API_URL}/projects/all`)
			return data as {
				success: boolean
				projects: IProject[]
				stacks: IStack[]
				relations: {
					project_id: number
					stack_id: number
				}[]
			}
		}
	})
}
interface IProject {
	id: number
	created_at: string
	title: string
	description: string
	project_start_date: string
	project_end_date: string
	thumbnail_url: string | null
}
interface IStack {
	id: number
	key: string
	description: string
	created_at: string
	url: string
	type: "library" | "framework" | "runtime" | "language" | "other" | "tool"
	image_url: string | null
}

export async function makeAPICall(
	input: string | URL | globalThis.Request,
	init?: RequestInit
) {
	console.log(`[api-request]: making api request to `, input)
	const request = await fetch(input, init)
	const json = await request.json()
	if (!json)
		throw new Error("There was an error while fetching data from the server.")
	return json
}
