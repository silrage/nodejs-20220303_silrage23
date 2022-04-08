const modelProduct = require('../models/Product.js');
const mapperProduct = require('../mappers/product.js');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const {query} = ctx.query;
  const products = await modelProduct.find(
    {$text: {$search: query}},
    {score: {$meta: 'textScore'}},
  ).sort({score: {$meta: 'textScore'}});
  
  ctx.body = {products: products.map(mapperProduct)};
};
