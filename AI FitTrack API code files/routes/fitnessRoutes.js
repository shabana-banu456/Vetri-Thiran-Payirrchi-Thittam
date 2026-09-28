const router = require("express").Router();
const { protect } = require("../middlewares/authMiddleware");
const controller = require("../controllers/fitnessController");

router.use(protect);
router.post("/", controller.create);
router.get("/", controller.list);
router.get("/:id", controller.getOne);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
