const router = require("express").Router()
const sales = require("./sales.js")
const systems = require("./systems.js")
router.use(sales)
router.use(systems)
router.get("/", (req, res) => {
	return res.json({"ok":true})
})
module.exports = router