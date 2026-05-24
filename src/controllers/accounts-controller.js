import { UserSpec, UserCredentialsSpec } from "../models/joi-schemas.js";
import { db } from "../models/db.js";
import { comparePasswords } from "../utils/password-utils.js";
import { sanitizeText } from "../utils/sanitize-utils.js";

export const accountsController = {
  index: {
    auth: false,
    handler: function (request, h) {
      return h.view("main", { title: "Welcome to Placemark" });
    },
  },
  showSignup: {
    auth: false,
    handler: function (request, h) {
      return h.view("signup-view", { title: "Sign up for Placemark" });
    },
  },
  signup: {
    auth: false,
    validate: {
      payload: UserSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("signup-view", { title: "Sign up error", errors: error.details }).takeover().code(400);
      },
    },
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
  showLogin: {
    auth: false,
    handler: function (request, h) {
      return h.view("login-view", { title: "Login to Placemark" });
    },
  },
  login: {
    auth: false,
    validate: {
      payload: UserCredentialsSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("login-view", { title: "Log in error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const { email, password } = request.payload;
      const user = await db.userStore.getUserByEmail(email);

      if (!user) {
        return h.redirect("/");
      }

      const passwordsMatch = comparePasswords(password, user.password);
      if (!passwordsMatch) {
        return h.redirect("/");
      }

      request.cookieAuth.set({ id: user._id });
      return h.redirect("/dashboard");
    },
  },

  logout: {
    handler: function (request, h) {
      request.cookieAuth.clear();
      return h.redirect("/");
    },
  },

  deleteAccount: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const categories = await db.categoryStore.getUserCategories(loggedInUser._id);

      await Promise.all(
        categories.map(async (category) => {
          const fullCategory = await db.categoryStore.getCategoryById(category._id);
          if (fullCategory && fullCategory.placemarks) {
            await Promise.all(fullCategory.placemarks.map((placemark) => db.placemarkStore.deletePlacemark(placemark._id)));
          }
          await db.categoryStore.deleteCategoryById(category._id);
        }),
      );
      await db.reviewStore.deleteReviewsByUserId(loggedInUser._id);
      await db.userStore.deleteUserById(loggedInUser._id);
      request.cookieAuth.clear();
      return h.redirect("/");
    },
  },

  async validate(request, session) {
    const user = await db.userStore.getUserById(session.id);
    if (!user) {
      return { isValid: false };
    }
    return { isValid: true, credentials: user };
  },
};