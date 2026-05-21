import { PlacemarkSpec } from "../models/joi-schemas.js";
import { db } from "../models/db.js";
import { imageStore } from "../models/image-store.js";

export const placemarkController = {
  index: {
    handler: async function (request, h) {
      const category = await db.categoryStore.getCategoryById(request.params.id);
      const placemark = await db.placemarkStore.getPlacemarkById(request.params.placemarkid);
      const viewData = {
        title: "Edit Placemark",
        user: request.auth.credentials,
        category: category,
        placemark: placemark,
      };
      return h.view("placemark-view", viewData);
    },
  },

  update: {
    validate: {
      payload: PlacemarkSpec,
      options: { abortEarly: false, allowUnknown: true },
      failAction: function (request, h, error) {

        const category = db.categoryStore.getCategoryById(request.params.id);
        const placemark = db.placemarkStore.getPlacemarkById(request.params.placemarkid);

        return h.view("placemark-view", {
          title: "Edit placemark error",
          user: request.auth.credentials,
          category: category,
          placemark: placemark,
          errors: error.details
        }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const placemark = await db.placemarkStore.getPlacemarkById(request.params.placemarkid);
      let imageUrl = placemark.img;
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
      await db.placemarkStore.updatePlacemark(placemark, newPlacemark);
      return h.redirect(`/category/${request.params.id}`);
    },
    payload: {
      multipart: true,
      output: "data",
      maxBytes: 209715200,
      parse: true,
    },
  },

  uploadImage: {
    handler: async function (request, h) {
      try {
        const placemark = await db.placemarkStore.getPlacemarkById(request.params.id);
        const file = request.payload.imagefile;

        if (file && Object.keys(file).length > 0) {
          const url = await imageStore.uploadImage(file);
          placemark.img = url;
          await db.placemarkStore.updatePlacemark(placemark, placemark);
        }

        return h.redirect(`/placemark/${placemark.categoryid}/editplacemark/${placemark._id}`);
      } catch (err) {
        console.log(err);
        return h.redirect("/dashboard");
      }
    },
    payload: {
      multipart: true,
      output: "data",
      maxBytes: 209715200,
      parse: true,
    },
  },
};