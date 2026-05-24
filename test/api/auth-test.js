import { assert } from "chai";
import { placemarkService } from "./placemark-service.js";
import { maggie, maggieCredentials } from "../fixtures.js";
import { createToken, decodeToken, validate } from "../../src/api/jwt-utils.js";
import { db } from "../../src/models/db.js";

suite("Authentication API tests", () => {
  setup(async () => {
    placemarkService.clearAuth();
    await placemarkService.deleteAllUsers();
  });

  teardown(async () => {
    placemarkService.clearAuth();
  });

  test("authenticate", async () => {
    await placemarkService.createUser(maggie);
    const response = await placemarkService.authenticate(maggieCredentials);
    assert.isTrue(response.success);
    assert.isDefined(response.token);
  });

  test("verify Token", async () => {
    await placemarkService.createUser(maggie);
    const response = await placemarkService.authenticate(maggieCredentials);
    const userInfo = decodeToken(response.token);
    assert.equal(userInfo.email, maggie.email);
    assert.isDefined(userInfo.userId);
  });

  test("check Unauthorized", async () => {
    await placemarkService.deleteAllUsers();
    const createdUser = await placemarkService.createUser(maggie);
    placemarkService.clearAuth();
    try {
      await placemarkService.deleteUser(createdUser._id);
      assert.fail("Route not protected");
    } catch (error) {
      assert.isDefined(error.response);
      assert.equal(error.response.data.statusCode, 401);
    }
  });

  test("decodeToken handles invalid token", async () => {
    const userInfo = decodeToken("bad-token");
    assert.deepEqual(userInfo, {});
  });

  test("validate returns false for missing user", async () => {
    db.init("mongo");
    const result = await validate({ id: "507f1f77bcf86cd799439011" }, {});
    assert.equal(result.isValid, false);
  });

  test("validate returns true for existing user", async () => {
    db.init("mongo");
    const createdUser = await db.userStore.addUser(maggie);

    const result = await validate({ id: createdUser._id }, {});

    assert.equal(result.isValid, true);
    assert.equal(result.credentials.email, maggie.email);
  });

  test("createToken creates a token for a user", async () => {
    db.init("mongo");
    const createdUser = await db.userStore.addUser(maggie);

    const token = createToken(createdUser);

    assert.isString(token);
    assert.isAbove(token.length, 10);
  });
});
