import { userMongoStore } from "./mongo/user-mongo-store.js";
import { categoryMongoStore } from "./mongo/category-mongo-store.js";
import { placemarkMongoStore } from "./mongo/placemark-mongo-store.js";
import { reviewMongoStore } from "./mongo/review-mongo-store.js";
import { connectMongo } from "./mongo/connect.js";

export const db = {
  userStore: null,
  categoryStore: null,
  placemarkStore: null,
  reviewStore: null,

  init(storeType) {
    this.userStore = userMongoStore;
    this.categoryStore = categoryMongoStore;
    this.placemarkStore = placemarkMongoStore;
    this.reviewStore = reviewMongoStore;
    connectMongo();
  },
};
