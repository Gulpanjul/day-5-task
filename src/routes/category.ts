import { Router } from "express";
import { createCategory, deleteCategory, getAllCategory, getAllGroupCategory, getDetailCategory, updateCategory } from "../controllers/category";

export const router = Router();

// Create
router.post("/categories", createCategory);

// Read
router.get("/categories", getAllCategory);
router.get("/categories/:id", getDetailCategory);
router.get("/categories-group", getAllGroupCategory);

// Update
router.patch("/categories", updateCategory);

// Delete
router.delete("/categories/:id", deleteCategory);