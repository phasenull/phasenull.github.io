import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import { BrowserRouter, createBrowserRouter, Route, Routes } from "react-router"
import IndexPage from "./pages/main"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Layout from "@pages/main/layout"
import RecentActivitiesPage from "@pages/main/recent-activities/recent-activities"
import ClientAreaPage from "@pages/main/client-area"
import AdminPage from "@pages/admin/admin-index"
import OAuthCallback from "@pages/admin/oauth/callback"
import ListSessionsPage from "@pages/admin/list-sessions"
import AuthorizePage from "@pages/admin/oauth/authorize"
import StatusPage from "@pages/admin/status"
import StacksIndex from "@pages/admin/stacks/stacks-index"
import ProjectsIndexPage from "@pages/admin/projects/projects-index"
import ProjectEditPage from "@pages/admin/projects/project-edit"
const client = new QueryClient()
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<QueryClientProvider client={client}>
			<BrowserRouter>
				<Layout>
					<Routes>
						<Route index element={<IndexPage />} />
						{/* <Route
							path="pinboard"
							element={<RecentActivitiesPage />}
						/> */}
						{/* <Route
							path="career"
							element={<RecentActivitiesPage />}
						/> */}
						<Route path="projects">
							<Route path=":id/:tag" element={<IndexPage/>} />
							<Route path=":id" element={<IndexPage/>} />
						</Route>
						{/* <Route path="client-area/*" element={<ClientAreaPage />} /> */}
						<Route path="admin/*">
							<Route index element={<AdminPage />} />
							<Route
								path="activity-manager"
								element={<div>Activity Manager</div>}
							/>
							<Route path="stacks">
								<Route index element={<StacksIndex />} />
							</Route>
							<Route path="projects">
								<Route index element={<ProjectsIndexPage />} />
								<Route path="edit/:id" element={<ProjectEditPage />} />
							</Route>
							<Route path="list-sessions" element={<ListSessionsPage />} />
							<Route path="status" element={<StatusPage />} />
							<Route path="oauth">
								<Route index element={<div>OAuth</div>} />
								<Route path="callback" element={<OAuthCallback />} />
								<Route path="authorize" element={<AuthorizePage />} />
							</Route>
						</Route>
					</Routes>
				</Layout>
			</BrowserRouter>
		</QueryClientProvider>
	</StrictMode>
)
