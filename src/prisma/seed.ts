import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
	// Hapus data yang ada dengan urutan yang benar
	await prisma.restock.deleteMany();
	await prisma.product.deleteMany();
	await prisma.category.deleteMany();

	// Buat kategori
	const electronics = await prisma.category.create({
		data: {
			name: "Electronics",
			description: "Perangkat elektronik dan aksesoris",
		},
	});

	const accessories = await prisma.category.create({
		data: {
			name: "Accessories",
			description: "Aksesoris komputer dan gadget",
		},
	});

	// Buat produk dengan relasi ke kategori
	const keyboard = await prisma.product.create({
		data: {
			name: "Mechanical Keyboard",
			description: "Keyboard mekanik RGB dengan switch biru",
			price: 350000,
			stock: 12,
			categoryId: electronics.id,
		},
	});

	const mouse = await prisma.product.create({
		data: {
			name: "Gaming Mouse",
			description: "Mouse gaming dengan 6 tombol programmable",
			price: 150000,
			stock: 30,
			categoryId: electronics.id,
		},
	});

	const usbHub = await prisma.product.create({
		data: {
			name: "USB-C Hub",
			description: "Hub 7-in-1 dengan port HDMI",
			price: 100000,
			stock: 50,
			categoryId: accessories.id,
		},
	});

	// Buat riwayat restock
	await prisma.restock.createMany({
		data: [
			{
				productId: keyboard.id,
				quantity: 10,
				date: new Date("2023-10-01"),
			},
			{
				productId: mouse.id,
				quantity: 20,
				date: new Date("2023-10-05"),
			},
			{
				productId: usbHub.id,
				quantity: 30,
				date: new Date("2023-10-10"),
			},
			{
				productId: keyboard.id,
				quantity: 5,
				date: new Date("2023-10-15"),
			},
		],
	});
}

main()
	.then(() => {
		console.log("Seeding completed✅");
	})
	.catch((e) => {
		console.error(e);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
