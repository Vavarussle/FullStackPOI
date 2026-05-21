import Mongoose from "mongoose";
import Boom from "@hapi/boom";
import { comparePasswords } from "../../utils/password-utils.js";

const { Schema } = Mongoose;

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  isAdmin: { type: Boolean, default: false },
});

userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email });
};

userSchema.methods.comparePassword = function (candidatePassword) {
  const isMatch = comparePasswords(candidatePassword, this.password);
  if (!isMatch) {
    throw Boom.unauthorized("Password mismatch");
  }
  return this;
};

export const User = Mongoose.model("User", userSchema);
