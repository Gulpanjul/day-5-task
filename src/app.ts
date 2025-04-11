import express from "express";
import { router as routerProduct } from "./routes/product";
import { router as routerCategory } from "./routes/category";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

// globar error handler
app.use((err: any, req: any, res: any, next: any) => {
	console.log(err);
	res
		.status(err.status || 500)
		.json({ error: err.message || "data internal server error" });
});

app.use("/api/v1", routerProduct, routerCategory);

app.listen(PORT, () => {
	console.log(`server is running at http://localhost:${PORT}`);
});
