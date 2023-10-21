import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./pages/layout"
import RobloxWelcomer from "./pages/ledo/get_started"
import Welcomer from "./pages/welcome/welcomer"
import PageNotFound from "./pages/errors/page_not_found"
import LedoIndex from "./pages/ledo"
import PortfolioIndex from "./pages/portfolio"
import LedoWelcome from "./pages/ledo/welcomer"
import LedoAuthLayout from "./pages/ledo/layout"
import DashboardLayout from "./pages/ledo/dashboard/layout"
import DashboardIndex from "./pages/ledo/dashboard"
import AuthPanel from "./pages/ledo/dashboard/auth"
import PageInProgress from "./pages/errors/wip"
const group_id = 8015542

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path ="/" element={<PageInProgress/>}/>
				<Route path="/pass/" element={<Layout />}>
					<Route index element={<Welcomer />} />
					<Route path="portfolio">
						<Route index element={<PortfolioIndex />} />
					</Route>
					<Route path="ledo/get_started" element={<RobloxWelcomer group_id={group_id} />} />
					<Route path="ledo/welcome" element={<LedoAuthLayout ><LedoWelcome group_id={group_id} /></LedoAuthLayout>} />

					<Route path="ledo" element={<DashboardLayout />}>
						<Route index element={<LedoIndex />} />
						<Route path="dashboard">
							<Route index element={<DashboardIndex />} />
							<Route path="auth" element={<AuthPanel/>}/>
						</Route>
					</Route>
					<Route path="*" element={<PageNotFound />} status={404}></Route>
				</Route>
			</Routes>
		</BrowserRouter>
	)
}

export default App
