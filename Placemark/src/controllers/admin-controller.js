import { db } from "../models/db.js";

export const adminController = {
  index: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;

      if (!loggedInUser.isAdmin) {
        return h.redirect("/dashboard");
      }

      const users = await db.userStore.getAllUsers();
      const playlists = await db.playlistStore.getAllPlaylists();
      const tracks = await db.trackStore.getAllTracks();

      const viewData = {
        title: "Admin Dashboard",
        user: loggedInUser,
        users: users,
        userCount: users.length,
        categoryCount: playlists.length,
        placemarkCount: tracks.length,
        imageCount: tracks.filter((track) => track.img && track.img !== "").length,
      };

      return h.view("admin-view", viewData);
    },
  },

  deleteUser: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;

      if (!loggedInUser.isAdmin) {
        return h.redirect("/dashboard");
      }

      const user = await db.userStore.getUserById(request.params.id);

      if (!user) {
        return h.redirect("/admin");
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
      return h.redirect("/admin");
    },
  },
};