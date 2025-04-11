import { Router } from "express";
import {
	createProducts,
	deleteProduct,
	getProducts,
	updateProducts,
} from "../controllers/product";

export const router = Router();

// Create
router.post("/products", createProducts);

// Read
router.get("/products", getProducts);

/// Update Product
router.patch("/products", updateProducts);

// Delete
router.delete("/products/:id", deleteProduct);
