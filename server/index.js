const express = require("express")
const cors = require("cors")
const app = express()
const port = 80
const v1_routes = require("./v1")
app.use(
	cors({
		origin: ["http://localhost:3000","http://192.168.1.47:3000","http://phase.local:3000","https://phasenull.onrender.com"],
	})
)
app.use("/api/v1", v1_routes)
app.listen(port, () => {
	console.log(`Server running on port ${port}`)
})
