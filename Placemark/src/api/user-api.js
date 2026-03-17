import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import { createToken } from "./jwt-utils.js";
import { UserSpec, UserSpecPlus, UserArray, UserCredentialsSpec } from "../models/joi-schemas.js";

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
      const user = await db.userStore.addUser(request.payload);
      if (user) {
        return h.response(user).code(201);
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

      const playlists = await db.playlistStore.getUserPlaylists(user._id);
      await Promise.all(
        playlists.map(async (playlist) => {
          const fullPlaylist = await db.playlistStore.getPlaylistById(playlist._id);
          if (fullPlaylist && fullPlaylist.tracks) {
            await Promise.all(fullPlaylist.tracks.map((track) => db.trackStore.deleteTrack(track._id)));
          }
          await db.playlistStore.deletePlaylistById(playlist._id);
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

      if (!user || user.password !== password) {
        return Boom.unauthorized("Invalid email or password");
      }

      return h.response({ success: true, token: createToken(user) }).code(201);
    },
  },
};