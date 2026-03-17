import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import { IdSpec, TrackSpec, TrackSpecPlus, TrackArraySpec } from "../models/joi-schemas.js";

export const trackApi = {
  find: {
    auth: {
      strategy: "jwt",
    },
    tags: ["api"],
    description: "Get all placemarks",
    notes: "Returns all placemarks",
    response: { schema: TrackArraySpec, failAction: "log" },
    handler: async function (request, h) {
      const tracks = await db.trackStore.getAllTracks();
      return tracks;
    },
  },

  findOne: {
    auth: {
      strategy: "jwt",
    },
    tags: ["api"],
    description: "Get a placemark",
    notes: "Returns a placemark by id",
    validate: { params: { id: IdSpec } },
    response: { schema: TrackSpecPlus, failAction: "log" },
    handler: async function (request, h) {
      try {
        const track = await db.trackStore.getTrackById(request.params.id);
        if (track === null) {
          return Boom.notFound("No Placemark with this id");
        }
        return track;
      } catch (err) {
        return Boom.serverUnavailable("No Placemark with this id");
      }
    },
  },

  create: {
    auth: {
      strategy: "jwt",
    },
    tags: ["api"],
    description: "Create a placemark",
    notes: "Returns the newly created placemark",
    validate: {
      params: { id: IdSpec },
      payload: TrackSpec,
    },
    response: { schema: TrackSpecPlus, failAction: "log" },
    handler: async function (request, h) {
      const playlist = await db.playlistStore.getPlaylistById(request.params.id);
      if (!playlist) {
        return Boom.notFound("No Category with this id");
      }

      const track = {
        title: request.payload.title,
        description: request.payload.description,
        latitude: Number(request.payload.latitude),
        longitude: Number(request.payload.longitude),
        img: request.payload.img || "",
      };

      const newTrack = await db.trackStore.addTrack(request.params.id, track);
      if (newTrack) {
        return h.response(newTrack).code(201);
      }
      return Boom.badImplementation("error creating placemark");
    },
  },

  update: {
    auth: {
      strategy: "jwt",
    },
    tags: ["api"],
    description: "Update a placemark",
    notes: "Updates a placemark by id",
    validate: {
      params: { id: IdSpec },
      payload: TrackSpec,
    },
    response: { schema: TrackSpecPlus, failAction: "log" },
    handler: async function (request, h) {
      const track = await db.trackStore.getTrackById(request.params.id);
      if (!track) {
        return Boom.notFound("No Placemark with this id");
      }

      const updatedTrack = {
        title: request.payload.title,
        description: request.payload.description,
        latitude: Number(request.payload.latitude),
        longitude: Number(request.payload.longitude),
        img: request.payload.img || "",
      };

      await db.trackStore.updateTrack(track, updatedTrack);
      const trackResponse = await db.trackStore.getTrackById(request.params.id);
      return h.response(trackResponse).code(200);
    },
  },

  deleteAll: {
    auth: {
      strategy: "jwt",
    },
    tags: ["api"],
    description: "Delete all placemarks",
    notes: "Removes all placemarks from the store",
    handler: async function (request, h) {
      await db.trackStore.deleteAllTracks();
      return h.response().code(204);
    },
  },

  deleteOne: {
    auth: {
      strategy: "jwt",
    },
    tags: ["api"],
    description: "Delete a placemark",
    notes: "Deletes a placemark by id",
    validate: { params: { id: IdSpec } },
    handler: async function (request, h) {
      const track = await db.trackStore.getTrackById(request.params.id);
      if (!track) {
        return Boom.notFound("No Placemark with this id");
      }

      await db.trackStore.deleteTrack(request.params.id);
      return h.response().code(204);
    },
  },
};