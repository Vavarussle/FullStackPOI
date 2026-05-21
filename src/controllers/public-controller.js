import { db } from "../models/db.js";

export const publicController = {
  index: {
    auth: { mode: "try" },
    handler: async function (request, h) {
      const categories = await db.categoryStore.getCategoriesWithPublicPlacemarks();
      const loggedInUser = request.auth.credentials;

      const viewData = {
        title: "Public Categories",
        categories: categories,
        isLoggedIn: loggedInUser !== null && loggedInUser !== undefined,
        user: loggedInUser,
      };
      return h.view("public-view", viewData);
    },
  },

  showCategory: {
    auth: { mode: "try" },
    handler: async function (request, h) {
      const category = await db.categoryStore.getPublicCategoryById(request.params.id);
      const loggedInUser = request.auth.credentials;

      if (!category) {
        return h.redirect("/public");
      }

      const viewData = {
        title: "Public Category",
        category: category,
        isLoggedIn: loggedInUser !== null && loggedInUser !== undefined,
        user: loggedInUser,
      };
      return h.view("public-category-view", viewData);
    },
  },
};