import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import { IdSpec, PlacemarkSpec, PlacemarkSpecPlus, PlacemarkArraySpec } from "../models/joi-schemas.js";
import { sanitizeText, sanitizeLongText } from "../utils/sanitize-utils.js";

export const placemarkApi = {
  find: {
    auth: {
      strategy: "jwt",
    },
    tags: ["api"],
    description: "Get all placemarks",
    notes: "Returns all placemarks",
    response: { schema: PlacemarkArraySpec, failAction: "log" },
    handler: async function (request, h) {
      const placemarks = await db.placemarkStore.getAllPlacemarks();
      return placemarks;
    },
  },

  findOne: {
    auth: {
      strategy: "jwt",
    },
    tags: ["api"],
    description: "Get a placemark",
    notes: "Returns a placemark by id",
    validate: { params: { id: IdSpec } },
    response: { schema: PlacemarkSpecPlus, failAction: "log" },
    handler: async function (request, h) {
      try {
        const placemark = await db.placemarkStore.getPlacemarkById(request.params.id);
        if (placemark === null) {
          return Boom.notFound("No Placemark with this id");
        }
        return placemark;
      } catch (err) {
        return Boom.serverUnavailable("No Placemark with this id");
      }
    },
  },

  create: {
    auth: {
      strategy: "jwt",
    },
    tags: ["api"],
    description: "Create a placemark",
    notes: "Returns the newly created placemark",
    validate: {
      params: { id: IdSpec },
      payload: PlacemarkSpec,
    },
    response: { schema: PlacemarkSpecPlus, failAction: "log" },
    handler: async function (request, h) {
      const category = await db.categoryStore.getCategoryById(request.params.id);
      if (!category) {
        return Boom.notFound("No Category with this id");
      }

      const placemark = {
        title: sanitizeText(request.payload.title),
        description: sanitizeLongText(request.payload.description),
        latitude: Number(request.payload.latitude),
        longitude: Number(request.payload.longitude),
        img: request.payload.img || "",
        isPublic: request.payload.isPublic || false,
      };

      const newPlacemark = await db.placemarkStore.addPlacemark(request.params.id, placemark);
      if (newPlacemark) {
        return h.response(newPlacemark).code(201);
      }
      return Boom.badImplementation("error creating placemark");
    },
  },

  update: {
    auth: {
      strategy: "jwt",
    },
    tags: ["api"],
    description: "Update a placemark",
    notes: "Updates a placemark by id",
    validate: {
      params: { id: IdSpec },
      payload: PlacemarkSpec,
    },
    response: { schema: PlacemarkSpecPlus, failAction: "log" },
    handler: async function (request, h) {
      const placemark = await db.placemarkStore.getPlacemarkById(request.params.id);
      if (!placemark) {
        return Boom.notFound("No Placemark with this id");
      }

      const updatedPlacemark = {
        title: sanitizeText(request.payload.title),
        description: sanitizeLongText(request.payload.description),
        latitude: Number(request.payload.latitude),
        longitude: Number(request.payload.longitude),
        img: request.payload.img || "",
        isPublic: request.payload.isPublic || false,
      };

      await db.placemarkStore.updatePlacemark(placemark, updatedPlacemark);
      const placemarkResponse = await db.placemarkStore.getPlacemarkById(request.params.id);
      return h.response(placemarkResponse).code(200);
    },
  },

  deleteAll: {
    auth: {
      strategy: "jwt",
    },
    tags: ["api"],
    description: "Delete all placemarks",
    notes: "Removes all placemarks from the store",
    handler: async function (request, h) {
      await db.placemarkStore.deleteAllPlacemarks();
      return h.response().code(204);
    },
  },

  deleteOne: {
    auth: {
      strategy: "jwt",
    },
    tags: ["api"],
    description: "Delete a placemark",
    notes: "Deletes a placemark by id",
    validate: { params: { id: IdSpec } },
    handler: async function (request, h) {
      const placemark = await db.placemarkStore.getPlacemarkById(request.params.id);
      if (!placemark) {
        return Boom.notFound("No Placemark with this id");
      }

      await db.placemarkStore.deletePlacemark(request.params.id);
      return h.response().code(204);
    },
  },

  findPublic: {
    auth: false,
    tags: ["api"],
    description: "Get all public placemarks",
    notes: "Returns all public placemarks",
    response: { schema: PlacemarkArraySpec, failAction: "log" },
    handler: async function (request, h) {
      const placemarks = await db.placemarkStore.getAllPublicPlacemarks();
      return placemarks;
    },
  },
};