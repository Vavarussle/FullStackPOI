import { TrackSpec } from "../models/joi-schemas.js";
import { db } from "../models/db.js";

export const trackController = {
  index: {
    handler: async function (request, h) {
      const playlist = await db.playlistStore.getPlaylistById(request.params.id);
      const track = await db.trackStore.getTrackById(request.params.trackid);
      const viewData = {
        title: "Edit Placemark",
        user: request.auth.credentials,
        playlist: playlist,
        track: track,
      };
      return h.view("track-view", viewData);
    },
  },

  update: {
    validate: {
      payload: TrackSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("track-view", { title: "Edit placemark error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const track = await db.trackStore.getTrackById(request.params.trackid);
      const newTrack = {
        title: request.payload.title,
        description: request.payload.description,
        latitude: Number(request.payload.latitude),
        longitude: Number(request.payload.longitude),
        img: track.img,
      };
      await db.trackStore.updateTrack(track, newTrack);
      return h.redirect(`/playlist/${request.params.id}`);
    },
  },

  uploadImage: {
    handler: async function (request, h) {
      try {
        const track = await db.trackStore.getTrackById(request.params.trackid);
        const file = request.payload.imagefile;
        if (Object.keys(file).length > 0) {
          const url = await imageStore.uploadImage(request.payload.imagefile);
          track.img = url;
          await db.trackStore.updateTrack(track, track);
        }
        return h.redirect(`/track/${request.params.id}/edittrack/${request.params.trackid}`);
      } catch (err) {
        console.log(err);
        return h.redirect(`/track/${request.params.id}/edittrack/${request.params.trackid}`);
      }
    },
    payload: {
      multipart: true,
      output: "data",
      maxBytes: 209715200,
      parse: true,
    },
  },
};