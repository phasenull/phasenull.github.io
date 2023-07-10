import { Box, Button, ButtonGroup, MenuItem, Divider, FormControl, FormControlLabel, FormLabel, Paper, Stack, Tab, TextField } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { GET_COUNTRIES } from "../../../util";

function AuthPanel(props) {
	const [page, setPage] = useState("Login")
	const [countries, setCountries] = useState([])
	useEffect(() => {
		GET_COUNTRIES().then(data => setCountries(data))
	}, [])
	return (
		<div className="flex flex-col min-h-screen justify-center">
			<div className="bg-white h-max w-max mx-auto drop-shadow-xl rounded-md p-10">
				<div className="left-0 top-0 absolute w-[2px] h-[80%] top-[10%] left-[8%] bg-primary-dark"></div>
				<div className={page === "Login" ? "block" : "hidden"}>
					<FormControl >
						<FormLabel><p className="text-primary-dark pb-3">{page}</p></FormLabel>
						<Stack direction="column" spacing={2}>
							<TextField required id="login-username" label="Username" color="secondary" variant="outlined" />
							<TextField required id="login-password" label="Password" color="secondary" variant="outlined" type="password" />
						</Stack>
					</FormControl>
				</div>
				<div className={page === "Register" ? "block" : "hidden"}>
					<FormControl>
						<FormLabel><p className="text-primary-dark pb-3">{page}</p></FormLabel>
						<Stack direction="column" spacing={2}>
							<TextField required id="register-username" label="Username" variant="outlined" color="secondary" />
							<TextField required id="register-password" label="Password" variant="outlined" color="secondary" type="password" />
							<TextField required id="register-confirm-password" label="Confirm Password" variant="outlined" color="secondary" type="password" />
							<TextField
								id="select-country"
								select
								label="Select"
								helperText="Please select your country"
								defaultValue=""
							>
								{countries.map((option) => (
									<MenuItem key={option.name.common} value={option.name.common}>
										<img src={option.flags.png} className="absolute h-3 mr-3" alt="" />
										<p className="static pl-8 w-24">
											{option.name.common}
										</p>
									</MenuItem>
								))}
							</TextField>
						</Stack>
					</FormControl>
				</div>
				<div>
					<ButtonGroup direction="row" className="py-10 px-5 text-primary-dark">
						<Button variant="plain" onClick={() => setPage("Login")} >Login</Button>
						<Divider orientation="vertical" color="primary" flexItem />
						<Button variant="plain" onClick={() => setPage("Register")}>Register</Button>
					</ButtonGroup>
				</div>
			</div>
		</div>)
}
export default AuthPanel;