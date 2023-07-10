import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./pages/layout"
import RobloxWelcomer from "./pages/ledo/get_started"
import Welcomer from "./pages/welcome/welcomer"
import PageNotFound from "./pages/errors/page_not_found"
import TooLazy from "./pages/2lazy"
import LedoIndex from "./pages/ledo"
import PortfolioIndex from "./pages/portfolio"
import LedoWelcome from "./pages/ledo/welcomer"
import LedoLayout from "./pages/ledo/layout"
import { Helmet } from "react-helmet"
const group_id = 8015542

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<Welcomer />} />
					<Route path="portfolio">
						<Route index element={<PortfolioIndex />}/>
					</Route>
					<Route path="ledo/get_started" element={<RobloxWelcomer group_id={group_id} />} />
					<Route path="ledo" element={<LedoLayout />}>
						<Route index element={<LedoIndex />} />
						<Route path="welcome" element={<LedoWelcome group_id={group_id} />} />
					</Route>
					<Route path="2lazy">
						<Route index element={<TooLazy />} />
					</Route>
					<Route path="*" element={<PageNotFound />} status={404}></Route>
				</Route>
			</Routes>
		</BrowserRouter>
	)
}

export default App
