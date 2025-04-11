## Setup
- npm init -y
- npm i express @prisma/client
- npm i -D typescript ts-node-dev @types/express
- npx tsc --init
- npx prisma init


## Database Product
- Create Product (name, price, stock, category)
- Get all products (dengan pagination & filter by name, price range, stock)
- Get detail product
- update product -> batch transaction
- delete product

## Database Category
- create category
- get all category
- get detail category
- update category
- delete category

- filtering produk berdasarkan nama,harga, atau stok
- sorting produk berdasarkan harga stok
- pagination produk dan histori restock
- grouping kategori dan total produk di masing-masing
- aggregation total jumlah stok keseluruhan
- batch transaction