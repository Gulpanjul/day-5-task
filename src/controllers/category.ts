import { Request, Response } from "express";
import { prisma } from "../prisma/client";

// Create
export const createCategory = async (req: Request, res: Response) => {
	try {
		const { name, description } = req.body;

		if (!name) {
			res.status(400).json({ error: "Nama di butuhkan" });
			return;
		}

		if (!description) {
			res.status(400).json({ error: "Deskripsi di butuhkan" });
			return;
		}
      
		const category = await prisma.category.create({
			data: {
				name,
				description,
			},
		});
		res.json(category);
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
};

// Read
export const getAllCategory = async (req: Request, res: Response) => {
	try {
		const categories = await prisma.category.findMany();
		res.json(categories);
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getDetailCategory = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const category = await prisma.category.findUnique({
			where: {
				id: Number(id),
			},
		});
		res.json(category);
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getAllGroupCategory = async (req: Request, res: Response) => {
	try {
		const grouped = await prisma.product.groupBy({
			by: ["categoryId"],
			_count: {
				id: true,
			},
			orderBy: {
				_count: {
					id: "desc",
				},
			},
		});

		const totalStockAggregation = await prisma.product.aggregate({
			_sum: {
				stock: true,
			},
		});

		const totalStock = totalStockAggregation._sum.stock || 0;

		// Gabungkan dengan informasi kategori
		const result = await Promise.all(
			grouped.map(async (group) => {
				const category = await prisma.category.findUnique({
					where: { id: group.categoryId },
				});
				return {
					categoryId: group.categoryId,
					categoryName: category?.name,
					totalProducts: group._count.id,
				};
			})
		);

		res.json({ result, totalStock });
	} catch {
		res.status(500).json({ error: "Internal server error" });
	}
};

// Update
export const updateCategory = async (req: Request, res: Response) => {
	try {
		const { updates } = req.body;

		// Validation
		if (!Array.isArray(updates)) {
			res.status(400).json({ error: "Harus Array" });
			return;
		}

		const transaction = await prisma.$transaction(
			updates.map((updateProduct) =>
				prisma.category.update({
					where: {
						id: Number(updateProduct.id),
					},
					data: {
						name: updateProduct.name ?? undefined,
						description: updateProduct.description ?? undefined,
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
export const deleteCategory = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const category = await prisma.category.delete({
			where: {
				id: Number(id),
			},
		});
		res.json(category);
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
};
