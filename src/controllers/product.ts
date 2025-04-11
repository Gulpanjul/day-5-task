import { Request, Response } from "express";
import { prisma } from "../prisma/client";

// Create
export const createProducts = async (req: Request, res: Response) => {
	try {
		const { name, description, price, stock, categoryId } = req.body;

		// validation
		if (!name) {
			res.status(400).json({ error: "Nama di butuhkan" });
			return;
		}

		if (!description) {
			res.status(400).json({ error: "Deskripsi di butuhkan" });
			return;
		}

		if (!price) {
			res.status(400).json({ error: "Harga di butuhkan" });
			return;
		}

		if (!stock) {
			res.status(400).json({ error: "Stok di butuhkan" });
			return;
		}

		if (!categoryId) {
			res.status(400).json({ error: "Kategori di butuhkan" });
			return;
		}

		const product = await prisma.product.create({
			data: {
				name,
				description,
				price: parseFloat(price),
				stock: parseInt(stock),
				categoryId: parseInt(categoryId),
			},
			include: {
				category: true,
			},
		});
		res.json(product);
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
};

// READ - Get all products with filtering, sorting, and pagination
export const getProducts = async (req: Request, res: Response) => {
	const {
		name,
		sortBy = "price",
		order = "asc",
		minPrice,
		maxPrice,
		minStock,
		maxStock,
		limit = 10,
		offset = 0,
	} = req.query;

	const filters: any = {};

	if (name !== undefined)
		filters.name = { contains: name as string, mode: "insensitive" };

	if (minPrice) filters.price = { gte: parseFloat(minPrice as string) };

	if (maxPrice)
		filters.price = {
			...(filters.price || {}),
			lte: parseFloat(maxPrice as string),
		};

	if (minStock !== undefined)
		filters.stock = { gte: parseFloat(minStock as string) };

	if (maxStock)
		filters.stock = {
			...(filters.stock || {}),
			lte: parseFloat(maxStock as string),
		};

	try {
		const products = await prisma.product.findMany({
			where: filters,
			orderBy: {
				[sortBy as "price" | "stock"]: order as "asc" | "desc",
			},
			take: Number(limit),
			skip: Number(offset),
			include: { restocks: true },
		});

		res.json(products);
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
};

// Update
export const updateProducts = async (req: Request, res: Response) => {
	try {
		const { updates } = req.body;

		// Validation
		if (!Array.isArray(updates)) {
			res.status(400).json({ error: "Harus Array" });
			return;
		}

		const transaction = await prisma.$transaction(
			updates.map((updateProduct) =>
				prisma.product.update({
					where: {
						id: Number(updateProduct.id),
					},
					data: {
						name: updateProduct.name ?? undefined,
						description: updateProduct.description ?? undefined,
						price: updateProduct.price ?? undefined,
						stock: updateProduct.stock ?? undefined,
						categoryId: updateProduct.categoryId ?? undefined,
					},
				})
			)
		);

		res.json(transaction);
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
};

// Delete
export const deleteProduct = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const product = await prisma.product.delete({
			where: {
				id: Number(id),
			},
		});
		res.json(product);
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
};
