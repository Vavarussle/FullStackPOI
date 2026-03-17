import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import { IdSpec, CategorySpec, CategorySpecPlus, CategoryArraySpec } from "../models/joi-schemas.js";

export const categoryApi = {
  find: {
    auth: {
      strategy: "jwt",
    },
    tags: ["api"],
    description: "Get all categories",
    notes: "Returns all categories",
    response: { schema: CategoryArraySpec, failAction: "log" },
    handler: async function (request, h) {
      const categories = await db.categoryStore.getAllCategories();
      return categories;
    },
  },

  findOne: {
    auth: {
      strategy: "jwt",
    },
    tags: ["api"],
    description: "Get a category",
    notes: "Returns a category by id",
    validate: { params: { id: IdSpec } },
    response: { schema: CategorySpecPlus, failAction: "log" },
    handler: async function (request, h) {
      try {
        const category = await db.categoryStore.getCategoryById(request.params.id);
        if (category === null) {
          return Boom.notFound("No Category with this id");
        }
        return category;
      } catch (err) {
        return Boom.serverUnavailable("No Category with this id");
      }
    },
  },

  create: {
    auth: {
      strategy: "jwt",
    },
    tags: ["api"],
    description: "Create a category",
    notes: "Returns the newly created category",
    validate: { payload: CategorySpec },
    response: { schema: CategorySpecPlus, failAction: "log" },
    handler: async function (request, h) {
      const category = request.payload;
      const newCategory = await db.categoryStore.addCategory(category);
      if (newCategory) {
        return h.response(newCategory).code(201);
      }
      return Boom.badImplementation("error creating category");
    },
  },

  deleteAll: {
    auth: {
      strategy: "jwt",
    },
    tags: ["api"],
    description: "Delete all categories",
    notes: "Removes all categories from the store",
    handler: async function (request, h) {
      await db.categoryStore.deleteAllCategories();
      return h.response().code(204);
    },
  },

  deleteOne: {
    auth: {
      strategy: "jwt",
    },
    tags: ["api"],
    description: "Delete a category",
    notes: "Deletes a category by id",
    validate: { params: { id: IdSpec } },
    handler: async function (request, h) {
      const category = await db.categoryStore.getCategoryById(request.params.id);
      if (!category) {
        return Boom.notFound("No Category with this id");
      }

      if (category.placemarks) {
        await Promise.all(category.placemarks.map((placemark) => db.placemarkStore.deletePlacemark(placemark._id)));
      }

      await db.categoryStore.deleteCategoryById(request.params.id);
      return h.response().code(204);
    },
  },
};