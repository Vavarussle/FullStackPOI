import { PlacemarkSpec } from "../models/joi-schemas.js";
import { db } from "../models/db.js";
import { imageStore } from "../models/image-store.js";

export const categoryController = {
  index: {
    handler: async function (request, h) {
      const category = await db.categoryStore.getCategoryById(request.params.id);
      const viewData = {
        title: "Category",
        user: request.auth.credentials,
        category: category,
      };
      return h.view("category-view", viewData);
    },
  },

  addPlacemark: {
    validate: {
      payload: PlacemarkSpec,
      options: { abortEarly: false, allowUnknown: true },
      failAction: function (request, h, error) {
        const category = db.categoryStore.getCategoryById(request.params.id);
        return h.view("category-view", { 
          title: "Add placemark error",
          user: request.auth.credentials,
          category: category,
          errors: error.details
        }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const category = await db.categoryStore.getCategoryById(request.params.id);

      let imageUrl = "";
      const file = request.payload.imagefile;
      if (file && Object.keys(file).length > 0) {
        imageUrl = await imageStore.uploadImage(file);
      }

      const newPlacemark = {
        title: request.payload.title,
        description: request.payload.description,
        latitude: Number(request.payload.latitude),
        longitude: Number(request.payload.longitude),
        img: imageUrl,
        isPublic: request.payload.isPublic === "on",
      };
      await db.placemarkStore.addPlacemark(category._id, newPlacemark);
      return h.redirect(`/category/${category._id}`);
    },
    payload: {
      multipart: true,
      output: "data",
      maxBytes: 209715200,
      parse: true,
    },
  },

  deletePlacemark: {
    handler: async function (request, h) {
      const category = await db.categoryStore.getCategoryById(request.params.id);
      await db.placemarkStore.deletePlacemark(request.params.placemarkid);
      return h.redirect(`/category/${category._id}`);
    },
  },

};