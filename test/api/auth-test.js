import { assert } from "chai";
import { placemarkService } from "./placemark-service.js";
import { decodeToken } from "../../src/api/jwt-utils.js";
import { maggie, maggieCredentials } from "../fixtures.js";

suite("Authentication API tests", () => {
  setup(async () => {
    placemarkService.clearAuth();
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
    assert.isDefined(userInfo.useriId);
  });

  test("check Unauthorized", async () => {
    placemarkService.clearAuth();
    try {
      await placemarkService.deleteAllUsers();
      assert.fail("Route not protected");
    } catch (error) {
      assert.equal(error.response.data.statusCode, 401);
    }
  });
});
