const router = require("express").Router()
router.get("/systems", (req, res) => {
	return res.json({ value: 3 })
})
module.exports = router
