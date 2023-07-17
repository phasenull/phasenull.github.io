const express = require("express")
const cors = require("cors")
require("dotenv").config()
const app = express()
const port = 80
const v1_routes = require("./v1")
const background_worker = require("./background_worker")
background_worker()
app.use(
	cors({
		origin: ["https://phasenull.onrender.com","https://phasenull.dev"],
	})
)
app.use("/api/v1", v1_routes)
app.listen(port, () => {
	console.log(`Server running on port ${port}`)
})
