import { hashPassword } from "../../utils/password-utils.js";

export const seedData = {
  users: {
    _model: "User",
    homer: {
      firstName: "Homer",
      lastName: "Simpson",
      email: "homer@simpson.com",
      password: await hashPassword("secret"),
      isAdmin: true,
    },
    marge: {
      firstName: "Marge",
      lastName: "Simpson",
      email: "marge@simpson.com",
      isAdmin: false,
      password: await hashPassword("secret")
    },
    bart: {
      firstName: "Bart",
      lastName: "Simpson",
      email: "bart@simpson.com",
      isAdmin: false,
      password: await hashPassword("secret")
    }
  },
  categories: {
    _model: "Category",
    dublin: {
      title: "Dublin Places",
      userid: "->users.homer"
    }
  },

  placemarks: {
    _model: "Placemark",

    placemark_1: {
      title: "Phoenix Park",
      description: "Large public park in Dublin",
      latitude: 53.355,
      longitude: -6.329,
      isPublic: true,
      categoryid: "->categories.dublin",
      img: ""
    },

    placemark_2: {
      title: "Guinness Storehouse",
      description: "Famous brewery and tourist attraction",
      latitude: 53.3419,
      longitude: -6.2863,
      isPublic: true,
      categoryid: "->categories.dublin",
      img: ""
    },

    placemark_3: {
      title: "Trinity College",
      description: "Historic university in Dublin",
      latitude: 53.3438,
      longitude: -6.2546,
      isPublic: false,
      categoryid: "->categories.dublin",
      img: ""
    }
  },

  reviews: {
    _model: "Review",

    review_1: {
      comment: "Great place to visit!",
      rating: 5,
      placemarkid: "->placemarks.placemark_2",
      userid: "->users.marge",
      reviewerName: "Marge Simpson"
    },

    review_2: {
      comment: "Interesting history and good beer.",
      rating: 4,
      placemarkid: "->placemarks.placemark_2",
      userid: "->users.bart",
      reviewerName: "Bart Simpson"
    },

    review_3: {
      comment: "Beautiful park with lots of space.",
      rating: 5,
      placemarkid: "->placemarks.placemark_2",
      userid: "->users.homer",
      reviewerName: "Homer Simpson"
    }
  }

  
};
