import express from "express";
import {
  saveAddress,
  getAddresses,
  deleteAddress,
} from "../controllers/addressController.js";

const router = express.Router();

// add address
router.post("/add", saveAddress);

// get all address
router.get("/:userId", getAddresses);

// ✅ DELETE (MOST IMPORTANT)
router.delete("/:id", deleteAddress);

export default router;