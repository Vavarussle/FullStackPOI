export const serviceUrl = "http://localhost:3000";

export const maggie = {
  firstName: "Maggie",
  lastName: "Simpson",
  email: "maggie@simpson.com",
  password: "secret",
  isAdmin: false,
};

export const maggieCredentials = {
  email: "maggie@simpson.com",
  password: "secret",
};

export const adminUser = {
  firstName: "Admin",
  lastName: "User",
  email: "admin@placemark.com",
  password: "secret",
  isAdmin: true,
};

export const adminCredentials = {
  email: "admin@placemark.com",
  password: "secret",
};

export const testUsers = [
  {
    firstName: "Homer",
    lastName: "Simpson",
    email: "homer@simpson.com",
    password: "secret",
    isAdmin: true,
  },
  {
    firstName: "Marge",
    lastName: "Simpson",
    email: "marge@simpson.com",
    password: "secret",
    isAdmin: false,
  },
  {
    firstName: "Bart",
    lastName: "Simpson",
    email: "bart@simpson.com",
    password: "secret",
    isAdmin: false,
  },
];

export const historicBuildings = {
  title: "Historic Buildings",
};

export const coastalWalks = {
  title: "Coastal Walks",
};

export const reginaldsTower = {
  title: "Reginald's Tower",
  description: "Historic tower in Waterford",
  latitude: 52.2603,
  longitude: -7.1101,
  img: "",
  isPublic: false,
};

export const testCategories = [
  {
    title: "Historic Buildings",
  },
  {
    title: "Viewpoints",
  },
  {
    title: "Museums",
  },
];

export const testPlacemarks = [
  {
    title: "Reginald's Tower",
    description: "Historic tower in Waterford",
    latitude: 52.2603,
    longitude: -7.1101,
    img: "",
    isPublic: false,
  },
  {
    title: "Hook Lighthouse",
    description: "Historic lighthouse in Wexford",
    latitude: 52.1248,
    longitude: -6.9302,
    img: "",
    isPublic: false,
  },
  {
    title: "Mount Congreve",
    description: "Historic gardens in Waterford",
    latitude: 52.2465,
    longitude: -7.1764,
    img: "",
    isPublic: false,
  },
];

export const publicPlacemark = {
  title: "Monasterboice High Crosses",
  description: "One of the most impressive Celtic Crosses in Ireland",
  latitude: 53.7776,
  longitude: -6.41759,
  img: "",
  isPublic: true,
};

export const placemarkReview = {
  comment: "Great place to visit",
  rating: 5,
};

export const secondPlacemarkReview = {
  comment: "Pretty good location",
  rating: 3,
};

export const privatePlacemark = {
  title: "Secret Tower",
  description: "Historic tower in a secret location",
  latitude: 52.3000,
  longitude: -7.2000,
  img: "",
  isPublic: false,
};