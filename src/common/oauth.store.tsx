// persistant zustand store
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { devtools } from "zustand/middleware"

interface IAuthStore {
	access_token: string | undefined
	user: undefined | IUser
	clearAuth: () => void
	setAuth({ access_token, user }: { access_token: string; user: IUser }): void
}

interface IUser {
	id: string
	email: string
	name: string
}

export const useAuthStore = create<IAuthStore>()(
	// devtools(
		persist(
			(set) => ({
				setAuth({ access_token, user }) {
					set({ access_token, user })
				},
				access_token: undefined,
				user: undefined,
				clearAuth: () => {
					console.log("Clearing auth store")
					set({ access_token: undefined, user: undefined })
				}
			}),
			{ name: "auth-store" }
		// )
	)
)
