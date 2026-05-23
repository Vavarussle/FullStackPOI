import { PlacemarkSpec , ReviewSpec } from "../models/joi-schemas.js";
import { db } from "../models/db.js";
import { imageStore } from "../models/image-store.js";


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

export const placemarkController = {
  index: {
    handler: async function (request, h) {
      const category = await db.categoryStore.getCategoryById(request.params.id);
      const placemark = await db.placemarkStore.getPlacemarkById(request.params.placemarkid);
      const reviews = await db.reviewStore.getReviewsByPlacemarkId(request.params.placemarkid);
      const loggedInUser = request.auth.credentials;

      for (let i = 0; i < reviews.length; i += 1) {
        reviews[i].canDelete = false;
        if (loggedInUser.isAdmin || `${reviews[i].userid}` === `${loggedInUser._id}`) {
          reviews[i].canDelete = true;
        }
      }
      const viewData = {
        title: "Edit Placemark",
        user: loggedInUser,
        category: category,
        placemark: placemark,
        reviews: reviews,
        averageRating: calculateAverageRating(reviews),
      };
      return h.view("placemark-view", viewData);
    },
  },

  update: {
    validate: {
      payload: PlacemarkSpec,
      options: { abortEarly: false, allowUnknown: true },
      failAction: async function (request, h, error) {

        const category = await db.categoryStore.getCategoryById(request.params.id);
        const placemark = await db.placemarkStore.getPlacemarkById(request.params.placemarkid);
        const reviews = await db.reviewStore.getReviewsByPlacemarkId(request.params.placemarkid);

        return h.view("placemark-view", {
          title: "Edit placemark error",
          user: request.auth.credentials,
          category: category,
          placemark: placemark,
          reviews: reviews,
          averageRating: calculateAverageRating(reviews),
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

  addReview: {
    validate: {
      payload: ReviewSpec,
      options: { abortEarly: false, allowUnknown: true },
      failAction: async function (request, h, error) {
        const category = await db.categoryStore.getCategoryById(request.params.id);
        const placemark = await db.placemarkStore.getPlacemarkById(request.params.placemarkid);
        const reviews = await db.reviewStore.getReviewsByPlacemarkId(request.params.placemarkid);

        return h.view("placemark-view", {
          title: "Review error",
          user: request.auth.credentials,
          category: category,
          placemark: placemark,
          reviews: reviews,
          averageRating: calculateAverageRating(reviews),
          errors: error.details,
        }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;

      const newReview = {
        placemarkid: request.params.placemarkid,
        userid: loggedInUser._id,
        reviewerName: `${loggedInUser.firstName} ${loggedInUser.lastName}`,
        comment: request.payload.comment,
        rating: Number(request.payload.rating),
      };

      await db.reviewStore.addReview(newReview);
      return h.redirect(`/placemark/${request.params.id}/editplacemark/${request.params.placemarkid}`);
    },
  },

  deleteReview: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const review = await db.reviewStore.getReviewById(request.params.reviewid);

      if (review) {
        const isOwner = `${review.userid}` === `${loggedInUser._id}`;
        if (isOwner || loggedInUser.isAdmin) {
          await db.reviewStore.deleteReviewById(request.params.reviewid);
        }
      }

      return h.redirect(`/placemark/${request.params.id}/editplacemark/${request.params.placemarkid}`);
    },
  },

};