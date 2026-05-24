import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import { createToken } from "./jwt-utils.js";
import { UserSpec, UserSpecPlus, UserArray, UserCredentialsSpec } from "../models/joi-schemas.js";
import { comparePasswords } from "../utils/password-utils.js";
import { sanitizeText } from "../utils/sanitize-utils.js";

export const userApi = {
  find: {
    auth: false,
    tags: ["api"],
    description: "Get all users",
    notes: "Returns all users",
    response: { schema: UserArray, failAction: "log" },
    handler: async function (request, h) {
      const users = await db.userStore.getAllUsers();
      return users;
    },
  },

  findOne: {
    auth: false,
    tags: ["api"],
    description: "Get a user",
    notes: "Returns a user by id",
    validate: { params: { id: UserSpecPlus.extract("_id") } },
    response: { schema: UserSpecPlus, failAction: "log" },
    handler: async function (request, h) {
      try {
        const user = await db.userStore.getUserById(request.params.id);
        if (user === null) {
          return Boom.notFound("No User with this id");
        }
        return user;
      } catch (err) {
        return Boom.serverUnavailable("No User with this id");
      }
    },
  },

  create: {
    auth: false,
    tags: ["api"],
    description: "Create a user",
    notes: "Returns the newly created user",
    validate: { payload: UserSpec },
    response: { schema: UserSpecPlus, failAction: "log" },
    handler: async function (request, h) {
      const user = {
        firstName: sanitizeText(request.payload.firstName),
        lastName: sanitizeText(request.payload.lastName),
        email: request.payload.email.trim().toLowerCase(),
        password: request.payload.password,
        isAdmin: request.payload.isAdmin || false,
      };

      const createdUser = await db.userStore.addUser(user);
      if (createdUser) {
        return h.response(createdUser).code(201);
      }
      return Boom.badImplementation("error creating user");
    },
  },

  deleteAll: {
    auth: false,
    tags: ["api"],
    description: "Delete all users",
    notes: "Removes all users from the store",
    handler: async function (request, h) {
      await db.userStore.deleteAll();
      return h.response().code(204);
    },
  },

  deleteOne: {
    auth: {
      strategy: "jwt",
    },
    tags: ["api"],
    description: "Delete a user",
    notes: "Deletes a user by id",
    validate: { params: { id: UserSpecPlus.extract("_id") } },
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      if (!loggedInUser.isAdmin) {
        return Boom.unauthorized("Admin access required");
      }

      const user = await db.userStore.getUserById(request.params.id);
      if (!user) {
        return Boom.notFound("No User with this id");
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
      return h.response().code(204);
    },
  },

  authenticate: {
    auth: false,
    tags: ["api"],
    description: "Authenticate a User",
    notes: "Returns a token",
    validate: { payload: UserCredentialsSpec },
    handler: async function (request, h) {
      const { email, password } = request.payload;
      const user = await db.userStore.getUserByEmail(email);

      if (!user) {
        return Boom.unauthorized("Invalid email or password");
      }

      const passwordsMatch = comparePasswords(password, user.password);
      if (!passwordsMatch) {
        return Boom.unauthorized("Invalid email or password");
      }

      return h.response({ success: true, token: createToken(user) }).code(201);
    },
  },
};