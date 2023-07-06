import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./pages/layout"
import RobloxWelcomer from "./pages/RobloxWelcomer"
import Welcomer from "./pages/Welcomer"
const group_id = 8015542

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Layout/>}>
						<Route index element={<Welcomer/>} />
					<Route path="roblox" element={<Layout/>}>
						<Route index element={<RobloxWelcomer group_id = {group_id}/>} />
					</Route>
				</Route>
			</Routes>
		</BrowserRouter>
	)
}

export default App
