import { Placemark } from "./placemark.js";
import { Category } from "./category.js";

export const placemarkMongoStore = {
  async getAllPlacemarks() {
    const placemarks = await Placemark.find().lean();
    return placemarks;
  },

  async getAllPublicPlacemarks() {
    const placemarks = await Placemark.find({ isPublic: true }).lean();
    return placemarks;
  },

  async addPlacemark(categoryId, placemark) {
    const placemarkToSave = {
      title: placemark.title,
      description: placemark.description,
      latitude: placemark.latitude,
      longitude: placemark.longitude,
      img: placemark.img,
      isPublic: placemark.isPublic || false,
      categoryid: categoryId,
    };
    const newPlacemark = new Placemark(placemarkToSave);
    const placemarkObj = await newPlacemark.save();
    return this.getPlacemarkById(placemarkObj._id);
  },

  async getPlacemarksByCategoryId(id) {
    const placemarks = await Placemark.find({ categoryid: id }).lean();
    return placemarks;
  },

  async getPlacemarkById(id) {
    if (id) {
      const placemark = await Placemark.findOne({ _id: id }).lean();
      return placemark;
    }
    return null;
  },

  async deletePlacemark(id) {
    try {
      await Placemark.deleteOne({ _id: id });
    } catch (error) {
      console.log("bad id");
    }
  },

  async deleteAllPlacemarks() {
    await Placemark.deleteMany({});
  },

  async updatePlacemark(placemark, updatedPlacemark) {
    const placemarkDoc = await Placemark.findOne({ _id: placemark._id });
    placemarkDoc.title = updatedPlacemark.title;
    placemarkDoc.description = updatedPlacemark.description;
    placemarkDoc.latitude = updatedPlacemark.latitude;
    placemarkDoc.longitude = updatedPlacemark.longitude;
    placemarkDoc.img = updatedPlacemark.img;
    placemarkDoc.isPublic = updatedPlacemark.isPublic;
    await placemarkDoc.save();
  },
};
