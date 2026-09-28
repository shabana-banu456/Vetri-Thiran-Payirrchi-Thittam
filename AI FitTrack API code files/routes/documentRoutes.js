const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { protect } = require("../middlewares/authMiddleware");
const controller = require("../controllers/documentController");

const uploadDir = path.resolve(process.env.UPLOAD_DIR || "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const maxMb = Number(process.env.MAX_FILE_SIZE_MB || 5);
const upload = multer({
  dest: uploadDir,
  limits: { fileSize: maxMb * 1024 * 1024 }
});

router.use(protect);
router.post("/upload", upload.single("file"), controller.upload);
router.get("/", controller.list);
router.get("/:id", controller.getOne);
router.delete("/:id", controller.remove);

module.exports = router;
