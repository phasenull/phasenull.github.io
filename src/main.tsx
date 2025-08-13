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
const client = new QueryClient()
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<QueryClientProvider client={client}>
			<BrowserRouter>
				<Layout>
					<Routes>
						<Route index element={<IndexPage />} />
						<Route path="recent-activities" element={<RecentActivitiesPage />} />
						<Route path="client-area/*" element={<ClientAreaPage />} />
						<Route path="/admin/*" >
							<Route index element={<AdminPage />} />
							<Route path="activity-manager" element={<div>Activity Manager</div>} />
						</Route>
					</Routes>
				</Layout>
			</BrowserRouter>
		</QueryClientProvider>
	</StrictMode>
)
