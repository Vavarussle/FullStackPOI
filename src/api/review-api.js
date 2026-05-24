import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import { IdSpec, ReviewSpec, ReviewSpecPlus, ReviewArraySpec } from "../models/joi-schemas.js";
import { sanitizeLongText } from "../utils/sanitize-utils.js";

export const reviewApi = {
  findByPlacemark: {
    auth: false,
    tags: ["api"],
    description: "Get reviews for a placemark",
    notes: "Returns all reviews for a placemark",
    validate: { params: { id: IdSpec } },
    response: { schema: ReviewArraySpec, failAction: "log" },
    handler: async function (request, h) {
      const reviews = await db.reviewStore.getReviewsByPlacemarkId(request.params.id);
      return reviews;
    },
  },

  create: {
    auth: {
      strategy: "jwt",
    },
    tags: ["api"],
    description: "Create a review",
    notes: "Adds a review to a placemark",
    validate: {
      params: { id: IdSpec },
      payload: ReviewSpec,
    },
    response: { schema: ReviewSpecPlus, failAction: "log" },
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const placemark = await db.placemarkStore.getPlacemarkById(request.params.id);

      if (!placemark) {
        return Boom.notFound("No Placemark with this id");
      }

      const newReview = {
        placemarkid: request.params.id,
        userid: loggedInUser._id,
        reviewerName: `${loggedInUser.firstName} ${loggedInUser.lastName}`,
        comment: sanitizeLongText(request.payload.comment),
        rating: Number(request.payload.rating),
      };

      const review = await db.reviewStore.addReview(newReview);
      if (review) {
        return h.response(review).code(201);
      }
      return Boom.badImplementation("error creating review");
    },
  },

  deleteOne: {
    auth: {
      strategy: "jwt",
    },
    tags: ["api"],
    description: "Delete a review",
    notes: "Deletes a review by id",
    validate: { params: { id: IdSpec } },
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const review = await db.reviewStore.getReviewById(request.params.id);

      if (!review) {
        return Boom.notFound("No Review with this id");
      }

      const isOwner = `${review.userid}` === `${loggedInUser._id}`;
      if (!isOwner && !loggedInUser.isAdmin) {
        return Boom.unauthorized("Not allowed to delete this review");
      }

      await db.reviewStore.deleteReviewById(request.params.id);
      return h.response().code(204);
    },
  },
};