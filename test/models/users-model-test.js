import { assert } from "chai";
import Boom from "@hapi/boom";
import { db } from "../../src/models/db.js";
import { testUsers, maggie, adminUser } from "../fixtures.js";
import { User } from "../../src/models/mongo/user.js";


suite("User Model tests", () => {

  setup(async () => {
    db.init("mongo");
    await db.userStore.deleteAll();

    for (let i = 0; i < testUsers.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await db.userStore.addUser(testUsers[i]);
    }
  });

  test("create a user", async () => {
    const user = await db.userStore.addUser(maggie);
    assert.equal(user.firstName, maggie.firstName);
    assert.equal(user.lastName, maggie.lastName);
    assert.equal(user.email, maggie.email);
    assert.isDefined(user._id);
    assert.notEqual(user.password, maggie.password);
    assert.include(user.password, ":");
  });

  test("create an admin user", async () => {
    const user = await db.userStore.addUser(adminUser);
    assert.equal(user.firstName, adminUser.firstName);
    assert.equal(user.lastName, adminUser.lastName);
    assert.equal(user.email, adminUser.email);
    assert.isDefined(user._id);
    assert.equal(user.isAdmin, true);
  });

  test("delete all users", async () => {
    let returnedUsers = await db.userStore.getAllUsers();
    assert.equal(returnedUsers.length, testUsers.length);
    await db.userStore.deleteAll();
    returnedUsers = await db.userStore.getAllUsers();
    assert.equal(returnedUsers.length, 0);
  });

  test("get a user - success", async () => {
    const user = await db.userStore.addUser(maggie);
    const returnedUser = await db.userStore.getUserById(user._id);
    assert.equal(returnedUser.firstName, maggie.firstName);
    assert.equal(returnedUser.lastName, maggie.lastName);
    assert.equal(returnedUser.email, maggie.email);
    assert.notEqual(returnedUser.password, maggie.password);
  });

  test("delete one user - success", async () => {
    const users = await db.userStore.getAllUsers();
    const id = users[0]._id;
    await db.userStore.deleteUserById(id);
    const returnedUsers = await db.userStore.getAllUsers();
    assert.equal(returnedUsers.length, testUsers.length - 1);
    const deletedUser = await db.userStore.getUserById(id);
    assert.isNull(deletedUser);
  });

  test("get a user - bad params", async () => {
    assert.isNull(await db.userStore.getUserById(""));
    assert.isNull(await db.userStore.getUserById());
  });

  test("delete one user - fail", async () => {
    await db.userStore.deleteUserById("bad-id");
    const allUsers = await db.userStore.getAllUsers();
    assert.equal(testUsers.length, allUsers.length);
  });

  test("get all users", async () => {
    const users = await db.userStore.getAllUsers();
    assert.equal(users.length, testUsers.length);
  });

  test("get a user by email", async () => {
    const user = await db.userStore.getUserByEmail(testUsers[0].email);
    assert.deepEqual(user.email, testUsers[0].email);
  });

  test("findByEmail returns a user", async () => {
    const user = await db.userStore.addUser(maggie);

    const foundUser = await User.findByEmail(maggie.email);

    assert.isNotNull(foundUser);
    assert.equal(foundUser.email, maggie.email);
    assert.equal(`${foundUser._id}`, `${user._id}`);
  });

  test("comparePassword accepts correct password", async () => {
    await db.userStore.addUser(maggie);

    const foundUser = await User.findByEmail(maggie.email);
    const result = foundUser.comparePassword(maggie.password);

    assert.equal(`${result._id}`, `${foundUser._id}`);
  });

  test("comparePassword rejects incorrect password", async () => {
    await db.userStore.addUser(maggie);

    const foundUser = await User.findByEmail(maggie.email);

    try {
      foundUser.comparePassword("wrongpassword");
      assert.fail("Password should not match");
    } catch (error) {
      assert.equal(error.output.statusCode, Boom.unauthorized().output.statusCode);
      assert.equal(error.message, "Password mismatch");
    }
  });
  
});