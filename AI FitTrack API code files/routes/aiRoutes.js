const router = require("express").Router();
const { protect } = require("../middlewares/authMiddleware");
const controller = require("../controllers/aiController");

router.use(protect);
router.post("/chat", controller.ask);
router.post("/summarize", controller.summarize);
router.post("/semantic-search", controller.semanticSearch);
router.get("/history", controller.history);

module.exports = router;
