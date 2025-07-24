import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import { BrowserRouter, createBrowserRouter, Route, Routes } from "react-router"
import IndexPage from "./pages"
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				<Route index element={<IndexPage />} />
			</Routes>
		</BrowserRouter>
	</StrictMode>
)
