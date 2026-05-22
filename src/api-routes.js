import { userApi } from "./api/user-api.js";
import { categoryApi } from "./api/category-api.js";
import { placemarkApi } from "./api/placemark-api.js";
import { reviewApi } from "./api/review-api.js";

export const apiRoutes = [
  { method: "GET", path: "/api/users", config: userApi.find },
  { method: "POST", path: "/api/users", config: userApi.create },
  { method: "DELETE", path: "/api/users", config: userApi.deleteAll },
  { method: "GET", path: "/api/users/{id}", config: userApi.findOne },

  { method: "POST", path: "/api/users/authenticate", config: userApi.authenticate },
  { method: "DELETE", path: "/api/users/{id}", config: userApi.deleteOne },

  { method: "POST", path: "/api/categories", config: categoryApi.create },
  { method: "DELETE", path: "/api/categories", config: categoryApi.deleteAll },
  { method: "GET", path: "/api/categories", config: categoryApi.find },
  { method: "GET", path: "/api/categories/{id}", config: categoryApi.findOne },
  { method: "DELETE", path: "/api/categories/{id}", config: categoryApi.deleteOne },

  { method: "GET", path: "/api/placemarks", config: placemarkApi.find },
  { method: "GET", path: "/api/placemarks/public", config: placemarkApi.findPublic },
  { method: "GET", path: "/api/placemarks/{id}", config: placemarkApi.findOne },
  { method: "PUT", path: "/api/placemarks/{id}", config: placemarkApi.update },
  { method: "POST", path: "/api/categories/{id}/placemarks", config: placemarkApi.create },
  
  { method: "DELETE", path: "/api/placemarks", config: placemarkApi.deleteAll },
  { method: "DELETE", path: "/api/placemarks/{id}", config: placemarkApi.deleteOne },

  { method: "GET", path: "/api/placemarks/{id}/reviews", config: reviewApi.findByPlacemark },
  { method: "POST", path: "/api/placemarks/{id}/reviews", config: reviewApi.create },
  { method: "DELETE", path: "/api/reviews/{id}", config: reviewApi.deleteOne },
];
