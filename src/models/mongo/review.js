import Mongoose from "mongoose";

const { Schema } = Mongoose;

const reviewSchema = new Schema({
  placemarkid: {
    type: Schema.Types.ObjectId,
    ref: "Placemark",
  },
  userid: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviewerName: String,
  comment: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Review = Mongoose.model("Review", reviewSchema);