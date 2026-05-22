import { aboutController } from "./controllers/about-controller.js";
import { accountsController } from "./controllers/accounts-controller.js";
import { dashboardController } from "./controllers/dashboard-controller.js";
import { categoryController } from "./controllers/category-controller.js";
import { placemarkController } from "./controllers/placemark-controller.js";
import { adminController } from "./controllers/admin-controller.js";
import { publicController } from "./controllers/public-controller.js";

export const webRoutes = [
  { method: "GET", path: "/", config: accountsController.index },
  { method: "GET", path: "/signup", config: accountsController.showSignup },
  { method: "GET", path: "/login", config: accountsController.showLogin },
  { method: "GET", path: "/logout", config: accountsController.logout },
  { method: "POST", path: "/register", config: accountsController.signup },
  { method: "POST", path: "/authenticate", config: accountsController.login },
  { method: "GET", path: "/account/delete", config: accountsController.deleteAccount },

  { method: "GET", path: "/public", config: publicController.index },
  { method: "GET", path: "/public/category/{id}", config: publicController.showCategory },
  { method: "GET", path: "/public/placemark/{id}", config: publicController.showPlacemark },
  { method: "POST", path: "/public/placemark/{id}/addreview", config: publicController.addReview },
  { method: "GET", path: "/public/placemark/{id}/deletereview/{reviewid}", config: publicController.deleteReview },

  { method: "GET", path: "/about", config: aboutController.index },

  { method: "GET", path: "/dashboard", config: dashboardController.index },
  { method: "POST", path: "/dashboard/addcategory", config: dashboardController.addCategory },
  { method: "GET", path: "/dashboard/deletecategory/{id}", config: dashboardController.deleteCategory },

  { method: "GET", path: "/admin", config: adminController.index },
  { method: "GET", path: "/admin/deleteuser/{id}", config: adminController.deleteUser },

  { method: "GET", path: "/category/{id}", config: categoryController.index },
  { method: "POST", path: "/category/{id}/addplacemark", config: categoryController.addPlacemark },
  { method: "GET", path: "/category/{id}/deleteplacemark/{placemarkid}", config: categoryController.deletePlacemark },

  { method: "GET", path: "/placemark/{id}/editplacemark/{placemarkid}", config: placemarkController.index },
  { method: "POST", path: "/placemark/{id}/updateplacemark/{placemarkid}", config: placemarkController.update },

  { method: "POST", path: "/placemark/{id}/uploadimage", config: placemarkController.uploadImage },

  { method: "POST", path: "/placemark/{id}/addreview/{placemarkid}", config: placemarkController.addReview },

  { method: "GET", path: "/placemark/{id}/deletereview/{placemarkid}/{reviewid}", config: placemarkController.deleteReview },

  { method: "GET", path: "/{param*}", handler: { directory: { path: "./public" } }, options: { auth: false } },
];
