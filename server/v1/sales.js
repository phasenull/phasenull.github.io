const router = require("express").Router()
router.get("/sales", (req, res) => {
	return res.json({ value: 185 })
})
module.exports = router
