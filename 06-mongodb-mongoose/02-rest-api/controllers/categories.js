const modelCategory = require('../models/Category.js');
const mapperCategory = require('../mappers/category.js');

module.exports.categoryList = async function categoryList(ctx, next) {
  const model = await modelCategory.find();
  ctx.body = {categories: model.map(mapperCategory)};
};
