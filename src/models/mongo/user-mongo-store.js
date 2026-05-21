import { User } from "./user.js";
import { hashPassword } from "../../utils/password-utils.js";

export const userMongoStore = {
  async getAllUsers() {
    const users = await User.find().lean();
    return users;
  },

  async getUserById(id) {
    if (id) {
      const user = await User.findOne({ _id: id }).lean();
      return user;
    }
    return null;
  },

  async addUser(user) {
    const newUserData = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: hashPassword(user.password),
      isAdmin: user.isAdmin,
    };
    
    const newUser = new User(newUserData);
    const userObj = await newUser.save();
    return this.getUserById(userObj._id);
  },

  async getUserByEmail(email) {
    const user = await User.findOne({ email: email }).lean();
    return user;
  },

  async deleteUserById(id) {
    try {
      await User.findByIdAndDelete({ _id: id });
    } catch (error) {
      console.log("bad id");
    }
  },

  async deleteAll() {
    await User.deleteMany({});
  },
};