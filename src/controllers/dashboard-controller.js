import { PlaylistSpec } from "../models/joi-schemas.js";
import { db } from "../models/db.js";

export const dashboardController = {
  index: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const playlists = await db.playlistStore.getUserPlaylists(loggedInUser._id);
      const viewData = {
        title: "Placemark Dashboard",
        user: loggedInUser,
        playlists: playlists,
      };
      return h.view("dashboard-view", viewData);
    },
  },

  addPlaylist: {
    validate: {
      payload: PlaylistSpec,
      options: { abortEarly: false },
      failAction: async function (request, h, error) {
        const loggedInUser = request.auth.credentials;
        const playlists = await db.playlistStore.getUserPlaylists(loggedInUser._id);
        return h
          .view("dashboard-view", {
            title: "Add Category error",
            user: loggedInUser,
            playlists: playlists,
            errors: error.details,
          })
          .takeover()
          .code(400);
      },
    },
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const newPlaylist = {
        userid: loggedInUser._id,
        title: request.payload.title,
      };
      await db.playlistStore.addPlaylist(newPlaylist);
      return h.redirect("/dashboard");
    },
  },

  deletePlaylist: {
    handler: async function (request, h) {
      const playlist = await db.playlistStore.getPlaylistById(request.params.id);
      if (playlist && playlist.tracks) {
        await Promise.all(playlist.tracks.map((track) => db.trackStore.deleteTrack(track._id)));
      }
      await db.playlistStore.deletePlaylistById(request.params.id);
      return h.redirect("/dashboard");
    },
  },
};
