import express from "express";
import upload from "../config/upload.js";

const router = express.Router();

/**
 * POST /api/upload/image
 */
router.post("/image", upload.single("image"), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        res.json({
            url: req.file.path, // Cloudinary URL
            public_id: req.file.filename,
        });
    } catch (error) {
        res.status(500).json({ message: "Upload error", error });
    }
});

export default router;