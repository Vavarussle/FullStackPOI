export const seedData = {
  users: {
    _model: "User",
    homer: {
      firstName: "Homer",
      lastName: "Simpson",
      email: "homer@simpson.com",
      password: "secret",
      isAdmin: true,
    },
    marge: {
      firstName: "Marge",
      lastName: "Simpson",
      email: "marge@simpson.com",
      password: "secret"
    },
    bart: {
      firstName: "Bart",
      lastName: "Simpson",
      email: "bart@simpson.com",
      password: "secret"
    }
  },
  categories: {
    _model: "Category",
    mozart: {
      title: "Mozart Favourites",
      userid: "->users.homer"
    }
  },
  placemarks: {
    _model : "Placemark",
    placemark_1 : {
      title: "Violin Concerto No. 1",
      artist: "Mozart",
      duration: 15,
      categoryid: "->categories.mozart"
    },
    placemark_2 : {
      title: "Violin Concerto No. 2",
      artist: "Mozart",
      duration: 11,
      categoryid: "->categories.mozart"
    },
    placemark_3 : {
      title: "Violin Concerto No. 3",
      artist: "Mozart",
      duration: 23,
      categoryid: "->categories.mozart"
    }
  }
};
