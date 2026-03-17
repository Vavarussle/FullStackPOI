import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { testUsers, maggie, adminUser } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

suite("User Model tests", () => {
  let insertedUsers = [];

  setup(async () => {
    db.init("mongo");
    await db.userStore.deleteAll();
    insertedUsers = [];

    for (let i = 0; i < testUsers.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const user = await db.userStore.addUser(testUsers[i]);
      insertedUsers.push(user);
    }
  });

  test("create a user", async () => {
    const user = await db.userStore.addUser(maggie);
    assertSubset(maggie, user);
    assert.isDefined(user._id);
  });

  test("create an admin user", async () => {
    const user = await db.userStore.addUser(adminUser);
    assertSubset(adminUser, user);
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
    assertSubset(maggie, returnedUser);
  });

  test("delete one user - success", async () => {
    const id = insertedUsers[0]._id;
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
});