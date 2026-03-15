import axios from "axios";

import { serviceUrl } from "../fixtures.js";

export const playtimeService = {
  playtimeUrl: serviceUrl,

  async createUser(user) {
    const res = await axios.post(`${this.playtimeUrl}/api/users`, user);
    return res.data;
  },

  async getUser(id) {
    const res = await axios.get(`${this.playtimeUrl}/api/users/${id}`);
    return res.data;
  },

  async getAllUsers() {
    const res = await axios.get(`${this.playtimeUrl}/api/users`);
    return res.data;
  },

  async deleteAllUsers() {
    const res = await axios.delete(`${this.playtimeUrl}/api/users`);
    return res.data;
  },

  async deleteUser(id) {
    const res = await axios.delete(`${this.playtimeUrl}/api/users/${id}`, this.authHeader);
    return res.data;
  },

  async createPlaylist(playlist) {
    const res = await axios.post(`${this.playtimeUrl}/api/playlists`, playlist, this.authHeader);
    return res.data;
  },

  async deleteAllPlaylists() {
    const res = await axios.delete(`${this.playtimeUrl}/api/playlists`, this.authHeader);
    return res.data;
  },

  async deletePlaylist(id) {
    const res = await axios.delete(`${this.playtimeUrl}/api/playlists/${id}`, this.authHeader);
    return res.data;
  },

  async getAllPlaylists() {
    const res = await axios.get(`${this.playtimeUrl}/api/playlists`, this.authHeader);
    return res.data;
  },

  async getPlaylist(id) {
    const res = await axios.get(`${this.playtimeUrl}/api/playlists/${id}`, this.authHeader);
    return res.data;
  },

  async getAllTracks() {
    const res = await axios.get(`${this.playtimeUrl}/api/tracks`, this.authHeader);
    return res.data;
  },

  async createTrack(id, track) {
    const res = await axios.post(`${this.playtimeUrl}/api/playlists/${id}/tracks`, track, this.authHeader);
    return res.data;
  },

  async getTrack(id) {
    const res = await axios.get(`${this.playtimeUrl}/api/tracks/${id}`, this.authHeader);
    return res.data;
  },

  async updateTrack(id, track) {
    const res = await axios.put(`${this.playtimeUrl}/api/tracks/${id}`, track, this.authHeader);
    return res.data;
  },

  async deleteTrack(id) {
    const res = await axios.delete(`${this.playtimeUrl}/api/tracks/${id}`, this.authHeader);
    return res.data;
  },

  async deleteAllTracks() {
    const res = await axios.delete(`${this.playtimeUrl}/api/tracks`, this.authHeader);
    return res.data;
  },

  async authenticate(user) {
    const response = await axios.post(`${this.playtimeUrl}/api/users/authenticate`, user);
    axios.defaults.headers.common.Authorization = `Bearer ${response.data.token}`;
    this.authHeader = { headers: { Authorization: `Bearer ${response.data.token}` } };
    return response.data;
  },

  clearAuth() {
    this.authHeader = null;
    delete axios.defaults.headers.common.Authorization;
  },
};