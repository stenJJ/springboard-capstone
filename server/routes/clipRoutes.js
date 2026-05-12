const express = require("express");

const {
  getAllClips,
  getClipById,
  checkDuplicateClip,
  createClip,
  updateClip,
  deleteClip
} = require("../controllers/clipController");

const router = express.Router();

router.get("/", getAllClips);
router.get("/:id", getClipById);
router.post("/check-duplicate", checkDuplicateClip);
router.post("/", createClip);
router.patch("/:id", updateClip);
router.delete("/:id", deleteClip);

module.exports = router;