import { assert } from "chai";
import { placemarkService } from "./placemark-service.js";
import { maggie, adminUser, adminCredentials, testUsers } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

suite("User API tests", () => {
  setup(async () => {
    placemarkService.clearAuth();
  });

  teardown(async () => {
    placemarkService.clearAuth();
  });

  test("create user", async () => {
    const returnedUser = await placemarkService.createUser(maggie);
    assertSubset(maggie, returnedUser);
    assert.isDefined(returnedUser._id);
  });

  test("create user with admin flag", async () => {
    const returnedUser = await placemarkService.createUser(adminUser);
    assertSubset(adminUser, returnedUser);
    assert.isDefined(returnedUser._id);
  });

  test("delete all users", async () => {
    for (let i = 0; i < testUsers.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await placemarkService.createUser(testUsers[i]);
    }
    let returnedUsers = await placemarkService.getAllUsers();
    assert.equal(returnedUsers.length, testUsers.length);
    await placemarkService.deleteAllUsers();
    returnedUsers = await placemarkService.getAllUsers();
    assert.equal(returnedUsers.length, 0);
  });

  test("get all users", async () => {
    for (let i = 0; i < testUsers.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await placemarkService.createUser(testUsers[i]);
    }
    const returnedUsers = await placemarkService.getAllUsers();
    assert.isAtLeast(returnedUsers.length, testUsers.length);
  });

  test("get one user", async () => {
    const user = await placemarkService.createUser(maggie);
    const returnedUser = await placemarkService.getUser(user._id);
    assert.deepEqual(user, returnedUser);
  });

  test("get one user - bad id", async () => {
    try {
      await placemarkService.getUser("1234");
      assert.fail("Should not return a user");
    } catch (error) {
      assert.equal(error.response.data.message, "No User with this id");
      assert.equal(error.response.data.statusCode, 503);
    }
  });

  test("get one user - deleted user", async () => {
    const user = await placemarkService.createUser(maggie);
    await placemarkService.deleteAllUsers();
    try {
      await placemarkService.getUser(user._id);
      assert.fail("Should not return a user");
    } catch (error) {
      assert.equal(error.response.data.message, "No User with this id");
      assert.equal(error.response.data.statusCode, 404);
    }
  });

  test("admin can delete a user", async () => {
    await placemarkService.deleteAllUsers();
    const createdAdmin = await placemarkService.createUser(adminUser);
    const createdUser = await placemarkService.createUser(maggie);

    await placemarkService.authenticate(adminCredentials);
    await placemarkService.deleteUser(createdUser._id);

    const users = await placemarkService.getAllUsers();
    assert.equal(users.length, 1);
    assert.equal(users[0]._id, createdAdmin._id);
  });
});