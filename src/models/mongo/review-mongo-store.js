import { Review } from "./review.js";

export const reviewMongoStore = {
  async addReview(review) {
    const newReview = new Review(review);
    const reviewObj = await newReview.save();
    return this.getReviewById(reviewObj._id);
  },

  async getReviewById(id) {
    if (id) {
      const review = await Review.findOne({ _id: id }).lean();
      return review;
    }
    return null;
  },

  async getReviewsByPlacemarkId(placemarkid) {
    const reviews = await Review.find({ placemarkid: placemarkid }).sort({ createdAt: -1 }).lean();
    return reviews;
  },

  async deleteReviewById(id) {
    try {
      await Review.deleteOne({ _id: id });
    } catch (error) {
      console.log("bad id");
    }
  },

  async deleteReviewsByPlacemarkId(placemarkid) {
    await Review.deleteMany({ placemarkid: placemarkid });
  },

  async deleteReviewsByUserId(userid) {
    await Review.deleteMany({ userid: userid });
  },
};