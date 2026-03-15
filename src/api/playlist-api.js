import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import { IdSpec, PlaylistSpec, PlaylistSpecPlus, PlaylistArraySpec } from "../models/joi-schemas.js";

export const playlistApi = {
  find: {
    auth: {
      strategy: "jwt",
    },
    tags: ["api"],
    description: "Get all categories",
    notes: "Returns all categories",
    response: { schema: PlaylistArraySpec, failAction: "log" },
    handler: async function (request, h) {
      const playlists = await db.playlistStore.getAllPlaylists();
      return playlists;
    },
  },

  findOne: {
    auth: {
      strategy: "jwt",
    },
    tags: ["api"],
    description: "Get a category",
    notes: "Returns a category by id",
    validate: { params: { id: IdSpec } },
    response: { schema: PlaylistSpecPlus, failAction: "log" },
    handler: async function (request, h) {
      try {
        const playlist = await db.playlistStore.getPlaylistById(request.params.id);
        if (playlist === null) {
          return Boom.notFound("No Category with this id");
        }
        return playlist;
      } catch (err) {
        return Boom.serverUnavailable("No Category with this id");
      }
    },
  },

  create: {
    auth: {
      strategy: "jwt",
    },
    tags: ["api"],
    description: "Create a category",
    notes: "Returns the newly created category",
    validate: { payload: PlaylistSpec },
    response: { schema: PlaylistSpecPlus, failAction: "log" },
    handler: async function (request, h) {
      const playlist = request.payload;
      const newPlaylist = await db.playlistStore.addPlaylist(playlist);
      if (newPlaylist) {
        return h.response(newPlaylist).code(201);
      }
      return Boom.badImplementation("error creating category");
    },
  },

  deleteAll: {
    auth: {
      strategy: "jwt",
    },
    tags: ["api"],
    description: "Delete all categories",
    notes: "Removes all categories from the store",
    handler: async function (request, h) {
      await db.playlistStore.deleteAllPlaylists();
      return h.response().code(204);
    },
  },

  deleteOne: {
    auth: {
      strategy: "jwt",
    },
    tags: ["api"],
    description: "Delete a category",
    notes: "Deletes a category by id",
    validate: { params: { id: IdSpec } },
    handler: async function (request, h) {
      const playlist = await db.playlistStore.getPlaylistById(request.params.id);
      if (!playlist) {
        return Boom.notFound("No Category with this id");
      }

      if (playlist.tracks) {
        await Promise.all(playlist.tracks.map((track) => db.trackStore.deleteTrack(track._id)));
      }

      await db.playlistStore.deletePlaylistById(request.params.id);
      return h.response().code(204);
    },
  },
};