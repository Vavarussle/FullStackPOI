import { db } from "../models/db.js";
import { ReviewSpec } from "../models/joi-schemas.js";

function calculateAverageRating(reviews) {
  if (!reviews || reviews.length === 0) {
    return 0;
  }
  let total = 0;
  for (let i = 0; i < reviews.length; i += 1) {
    total += reviews[i].rating;
  }
  return (total / reviews.length).toFixed(1);
}

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

      for (let i = 0; i < category.placemarks.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        const reviews = await db.reviewStore.getReviewsByPlacemarkId(category.placemarks[i]._id);
        category.placemarks[i].averageRating = calculateAverageRating(reviews);
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

  showPlacemark: {
    auth: { mode: "try" },
    handler: async function (request, h) {
      const placemark = await db.placemarkStore.getPlacemarkById(request.params.id);
      const loggedInUser = request.auth.credentials;

      if (!placemark || !placemark.isPublic) {
        return h.redirect("/public");
      }

      const category = await db.categoryStore.getCategoryById(placemark.categoryid);
      const reviews = await db.reviewStore.getReviewsByPlacemarkId(placemark._id);

      for (let i = 0; i < reviews.length; i += 1) {
        reviews[i].canDelete = false;
        if (loggedInUser) {
          if (loggedInUser.isAdmin || `${reviews[i].userid}` === `${loggedInUser._id}`) {
            reviews[i].canDelete = true;
          }
        }
      }

      const viewData = {
        title: "Public Placemark",
        placemark: placemark,
        category: category,
        reviews: reviews,
        averageRating: calculateAverageRating(reviews),
        isLoggedIn: loggedInUser !== null && loggedInUser !== undefined,
        user: loggedInUser,
      };
      return h.view("public-placemark-view", viewData);
    },
  },

  addReview: {
    validate: {
      payload: ReviewSpec,
      options: { abortEarly: false, allowUnknown: true },
      failAction: async function (request, h, error) {
        const placemark = await db.placemarkStore.getPlacemarkById(request.params.id);
        const category = await db.categoryStore.getCategoryById(placemark.categoryid);
        const reviews = await db.reviewStore.getReviewsByPlacemarkId(request.params.id);

        return h.view("public-placemark-view", {
          title: "Public Placemark",
          placemark: placemark,
          category: category,
          reviews: reviews,
          averageRating: calculateAverageRating(reviews),
          isLoggedIn: true,
          user: request.auth.credentials,
          errors: error.details,
        }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const placemark = await db.placemarkStore.getPlacemarkById(request.params.id);

      if (!placemark || !placemark.isPublic) {
        return h.redirect("/public");
      }

      const newReview = {
        placemarkid: request.params.id,
        userid: loggedInUser._id,
        reviewerName: `${loggedInUser.firstName} ${loggedInUser.lastName}`,
        comment: request.payload.comment,
        rating: Number(request.payload.rating),
      };

      await db.reviewStore.addReview(newReview);
      return h.redirect(`/public/placemark/${request.params.id}`);
    },
  },

  deleteReview: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const review = await db.reviewStore.getReviewById(request.params.reviewid);
      const placemark = await db.placemarkStore.getPlacemarkById(request.params.id);

      if (review && placemark && placemark.isPublic) {
        const isOwner = `${review.userid}` === `${loggedInUser._id}`;
        if (isOwner || loggedInUser.isAdmin) {
          await db.reviewStore.deleteReviewById(request.params.reviewid);
        }
      }

      return h.redirect(`/public/placemark/${request.params.id}`);
    },
  },

};