import { db } from "../models/db.js";

export const adminController = {
  index: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;

      if (!loggedInUser.isAdmin) {
        return h.redirect("/dashboard");
      }

      const users = await db.userStore.getAllUsers();
      const categories = await db.categoryStore.getAllCategories();
      const placemarks = await db.placemarkStore.getAllPlacemarks();

      const viewData = {
        title: "Admin Dashboard",
        user: loggedInUser,
        users: users,
        userCount: users.length,
        categoryCount: categories.length,
        placemarkCount: placemarks.length,
        imageCount: placemarks.filter((placemark) => placemark.img && placemark.img !== "").length,
      };

      return h.view("admin-view", viewData);
    },
  },

  deleteUser: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;

      if (!loggedInUser.isAdmin) {
        return h.redirect("/dashboard");
      }

      const user = await db.userStore.getUserById(request.params.id);

      if (!user) {
        return h.redirect("/admin");
      }

      const categories = await db.categoryStore.getUserCategories(user._id);

      await Promise.all(
        categories.map(async (category) => {
          const fullCategory = await db.categoryStore.getCategoryById(category._id);
          if (fullCategory && fullCategory.placemarks) {
            await Promise.all(fullCategory.placemarks.map((placemark) => db.placemarkStore.deletePlacemark(placemark._id)));
          }
          await db.categoryStore.deleteCategoryById(category._id);
        }),
      );

      await db.userStore.deleteUserById(user._id);
      return h.redirect("/admin");
    },
  },
};