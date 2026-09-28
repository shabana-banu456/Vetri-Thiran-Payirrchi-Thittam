const router = require("express").Router();
const { protect, authorize } = require("../middlewares/authMiddleware");
const { analytics } = require("../controllers/adminController");

router.use(protect, authorize("admin"));
router.get("/analytics", analytics);

module.exports = router;
