import { assert } from "chai";
import { playtimeService } from "./playtime-service.js";
import { maggie, adminUser, adminCredentials, testUsers } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

suite("User API tests", () => {
  teardown(async () => {});

  test("create user", async () => {
    const returnedUser = await playtimeService.createUser(maggie);
    assertSubset(maggie, returnedUser);
    assert.isDefined(returnedUser._id);
  });

  test("create user with admin flag", async () => {
    const returnedUser = await playtimeService.createUser(adminUser);
    assertSubset(adminUser, returnedUser);
    assert.isDefined(returnedUser._id);
  });

  test("delete all users", async () => {
    for (let i = 0; i < testUsers.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await playtimeService.createUser(testUsers[i]);
    }
    let returnedUsers = await playtimeService.getAllUsers();
    assert.equal(returnedUsers.length, testUsers.length);
    await playtimeService.deleteAllUsers();
    returnedUsers = await playtimeService.getAllUsers();
    assert.equal(returnedUsers.length, 0);
  });

  test("get all users", async () => {
    for (let i = 0; i < testUsers.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await playtimeService.createUser(testUsers[i]);
    }
    const returnedUsers = await playtimeService.getAllUsers();
    assert.equal(returnedUsers.length, testUsers.length);
    for (let i = 0; i < returnedUsers.length; i += 1) {
      assertSubset(testUsers[i], returnedUsers[i]);
    }
  });

  test("get one user", async () => {
    const user = await playtimeService.createUser(maggie);
    const returnedUser = await playtimeService.getUser(user._id);
    assert.deepEqual(user, returnedUser);
  });

  test("get one user - bad id", async () => {
    try {
      await playtimeService.getUser("1234");
      assert.fail("Should not return a user");
    } catch (error) {
      assert.equal(error.response.data.message, "No User with this id");
      assert.equal(error.response.data.statusCode, 503);
    }
  });

  test("get one user - deleted user", async () => {
    const user = await playtimeService.createUser(maggie);
    await playtimeService.deleteAllUsers();
    try {
      await playtimeService.getUser(user._id);
      assert.fail("Should not return a user");
    } catch (error) {
      assert.equal(error.response.data.message, "No User with this id");
      assert.equal(error.response.data.statusCode, 404);
    }
  });

  test("admin can delete a user", async () => {
    await playtimeService.deleteAllUsers();
    const createdAdmin = await playtimeService.createUser(adminUser);
    const createdUser = await playtimeService.createUser(maggie);

    await playtimeService.authenticate(adminCredentials);
    await playtimeService.deleteUser(createdUser._id);

    const users = await playtimeService.getAllUsers();
    assert.equal(users.length, 1);
    assert.equal(users[0]._id, createdAdmin._id);
  });
});