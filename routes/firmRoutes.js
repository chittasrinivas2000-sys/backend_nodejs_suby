const express = require("express");
const firmController = require("../controllers/firmController");
const verifyToken = require("../middlewares/verifyToken");
const Path = require("path");

const router = express.Router();

// ADD FIRM (with multer inside controller)
router.post("/add-firm", verifyToken, firmController.addFirm);

// DELETE FIRM
router.delete("/:firmId", firmController.deleteFirmById);

// Optional: Serve image manually (if you don't use express.static)
router.get("/image/:imageName", (req, res) => {
    const imageName = req.params.imageName;

    res.setHeader("Content-Type", "image/jpeg");

    res.sendFile(Path.join(__dirname, "..", "uploads", imageName));
});

module.exports = router;
