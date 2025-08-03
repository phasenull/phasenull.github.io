import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import { BrowserRouter, createBrowserRouter, Route, Routes } from "react-router"
import IndexPage from "./pages"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Layout from "@components/layout"
import RecentActivitiesPage from "@pages/recent-activities"
const client = new QueryClient()
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<QueryClientProvider client={client}>
			<BrowserRouter>
				<Layout>
					<Routes>
						<Route index element={<IndexPage />} />
						<Route path="recent-activities" element={<RecentActivitiesPage />} />
					</Routes>
				</Layout>
			</BrowserRouter>
		</QueryClientProvider>
	</StrictMode>
)
