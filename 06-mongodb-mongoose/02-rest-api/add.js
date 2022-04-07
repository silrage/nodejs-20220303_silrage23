const connection = require('./libs/connection');
const Category = require('./models/Category');
const Product = require('./models/Product');

/** Create demo catalog */
async function load() {
  await Category.deleteMany();
  await Product.deleteMany();

  const samples = await Category.create({
    title: 'Samples',
    subcategories: [
      {title: 'Demo'},
      {title: 'Test'},
    ],
  });

  const product = await Product.create({
    title: 'Product',
    images: ['image1', 'image2'],
    category: samples,
    subcategory: samples.subcategories[0],
    price: 150,
    description: 'Description1',
  });

  console.log(product);

  await connection.close();
}

load();
