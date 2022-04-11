const modelProduct = require('../models/Product.js');
const mapperProduct = require('../mappers/product.js');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;

  if (!subcategory) return next();

  const products = await modelProduct.find({subcategory});
  ctx.body = {products: products.map(mapperProduct)};
};

module.exports.productList = async function productList(ctx, next) {
  const products = await modelProduct.find();
  ctx.body = {products: products.map(mapperProduct)};
};

module.exports.productById = async function productById(ctx, next) {
  const {id} = ctx.params;

  if (!id) return next(); // ID required

  if (!ObjectId.isValid(id)) return ctx.status = 400; // Bad ID

  const finded = await modelProduct.findById(id);
  if (!finded) return ctx.status = 404; // Not finded

  ctx.body = {product: mapperProduct(finded)};
};

