import { Category } from "./category.js";
import { placemarkMongoStore } from "./placemark-mongo-store.js";
import { Placemark } from "./placemark.js";

export const categoryMongoStore = {
  async getAllCategories() {
    const categories = await Category.find().lean();
    return categories;
  },

  async getCategoryById(id) {
    if (id) {
      const category = await Category.findOne({ _id: id }).lean();
      if (category) {
        category.placemarks = await placemarkMongoStore.getPlacemarksByCategoryId(category._id);
      }
      return category;
    }
    return null;
  },

  async addCategory(category) {
    const categoryToSave = { ...category };
    const newCategory = new Category(categoryToSave);
    const categoryObj = await newCategory.save();
    return this.getCategoryById(categoryObj._id);
  },

  async getUserCategories(id) {
    const categories = await Category.find({ userid: id }).lean();
    return categories;
  },

  async deleteCategoryById(id) {
    try {
      await Category.deleteOne({ _id: id });
    } catch (error) {
      console.log("bad id");
    }
  },

  async deleteAllCategories() {
    await Category.deleteMany({});
  },

  async updateCategory(updatedCategory) {
    const category = await Category.findOne({ _id: updatedCategory._id });
    category.title = updatedCategory.title;
    await category.save();
  },


  async getCategoriesWithPublicPlacemarks() {
    const categories = await Category.find().lean();
    const publicCategories = [];

    for (let i = 0; i < categories.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const publicPlacemarks = await Placemark.find({
        categoryid: categories[i]._id,
        isPublic: true,
      }).lean();

      if (publicPlacemarks.length > 0) {
        categories[i].placemarks = publicPlacemarks;
        publicCategories.push(categories[i]);
      }
    }

    return publicCategories;
  },

  async getPublicCategoryById(id) {
    if (id) {
      const category = await Category.findOne({ _id: id }).lean();
      if (category) {
        category.placemarks = await Placemark.find({
          categoryid: category._id,
          isPublic: true,
        }).lean();
        return category;
      }
    }
    return null;
  },
};