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

  async createCategory(category) {
    const res = await axios.post(`${this.playtimeUrl}/api/categories`, category, this.authHeader);
    return res.data;
  },

  async deleteAllCategories() {
    const res = await axios.delete(`${this.playtimeUrl}/api/categories`, this.authHeader);
    return res.data;
  },

  async deleteCategory(id) {
    const res = await axios.delete(`${this.playtimeUrl}/api/categories/${id}`, this.authHeader);
    return res.data;
  },

  async getAllCategories() {
    const res = await axios.get(`${this.playtimeUrl}/api/categories`, this.authHeader);
    return res.data;
  },

  async getCategory(id) {
    const res = await axios.get(`${this.playtimeUrl}/api/categories/${id}`, this.authHeader);
    return res.data;
  },

  async getAllPlacemarks() {
    const res = await axios.get(`${this.playtimeUrl}/api/placemarks`, this.authHeader);
    return res.data;
  },

  async createPlacemark(id, placemark) {
    const res = await axios.post(`${this.playtimeUrl}/api/categories/${id}/placemarks`, placemark, this.authHeader);
    return res.data;
  },

  async getPlacemark(id) {
    const res = await axios.get(`${this.playtimeUrl}/api/placemarks/${id}`, this.authHeader);
    return res.data;
  },

  async updatePlacemark(id, placemark) {
    const res = await axios.put(`${this.playtimeUrl}/api/placemarks/${id}`, placemark, this.authHeader);
    return res.data;
  },

  async deletePlacemark(id) {
    const res = await axios.delete(`${this.playtimeUrl}/api/placemarks/${id}`, this.authHeader);
    return res.data;
  },

  async deleteAllPlacemarks() {
    const res = await axios.delete(`${this.playtimeUrl}/api/placemarks`, this.authHeader);
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