import { Outlet } from "react-router-dom"
import { Fragment, useEffect } from "react"
import { GET_DATE, GET_VERSION } from "../util"
import { ThemeProvider, createTheme } from '@mui/material/styles';


const theme = createTheme({
	palette: {
		primary: {
			main: '#57cc99',
		},
		secondary: {
			main: '#22577a',
		},
	},
}
)
const Layout = () => {
	return (
		<Fragment>
			<ThemeProvider theme = {theme}>
			<div className="bg-gradient-to-r from-green-100 bg-green-300 no-scrollbar h-full min-h-screen">
				<Outlet />
			</div>
			<footer className="fixed bottom-0 w-full z-index-[999]">
				<div className="text-center bg-primary-dark no-scrollbar text-white text-opacity-20">
					phasenull.dev | {GET_VERSION()} | {GET_DATE()}
				</div>
			</footer>
			</ThemeProvider>
		</Fragment>
	)
}

export default Layout
