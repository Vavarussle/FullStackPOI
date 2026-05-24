import { assert } from "chai";
import { placemarkService } from "./placemark-service.js";
import { maggie, maggieCredentials, historicBuildings, testCategories } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

suite("Category API tests", () => {
  let user = null;

  setup(async () => {
    placemarkService.clearAuth();
    await placemarkService.deleteAllUsers();
    user = await placemarkService.createUser(maggie);
    await placemarkService.authenticate(maggieCredentials);
    await placemarkService.deleteAllCategories();
    historicBuildings.userid = user._id;
  });

  teardown(async () => {
    placemarkService.clearAuth();
  });

  test("create category", async () => {
    const returnedCategory = await placemarkService.createCategory(historicBuildings);
    assertSubset(historicBuildings, returnedCategory);
    assert.isDefined(returnedCategory._id);
  });

  test("delete a category", async () => {
    const category = await placemarkService.createCategory(historicBuildings);
    const response = await placemarkService.deleteCategory(category._id);
    assert.equal(response, "");
    const returnedCategories = await placemarkService.getAllCategories();
    assert.equal(returnedCategories.length, 0);
  });

  test("create multiple categories", async () => {
    for (let i = 0; i < testCategories.length; i += 1) {
      testCategories[i].userid = user._id;
      // eslint-disable-next-line no-await-in-loop
      await placemarkService.createCategory(testCategories[i]);
    }
    const returnedLists = await placemarkService.getAllCategories();
    assert.equal(returnedLists.length, testCategories.length);
    for (let i = 0; i < returnedLists.length; i += 1) {
      assertSubset(testCategories[i], returnedLists[i]);
    }
  });

  test("delete all categories", async () => {
    for (let i = 0; i < testCategories.length; i += 1) {
      testCategories[i].userid = user._id;
      // eslint-disable-next-line no-await-in-loop
      await placemarkService.createCategory(testCategories[i]);
    }
    let returnedLists = await placemarkService.getAllCategories();
    assert.equal(returnedLists.length, testCategories.length);
    await placemarkService.deleteAllCategories();
    returnedLists = await placemarkService.getAllCategories();
    assert.equal(returnedLists.length, 0);
  });

  test("get a category", async () => {
    const category = await placemarkService.createCategory(historicBuildings);
    const returnedCategory = await placemarkService.getCategory(category._id);
    assert.deepEqual(category, returnedCategory);
  });

  test("get a category - bad id", async () => {
    try {
      await placemarkService.getCategory("1234");
      assert.fail("Should not return a category");
    } catch (error) {
      assert.equal(error.response.data.message, "No Category with this id");
      assert.equal(error.response.data.statusCode, 503);
    }
  });

  test("get a category - deleted category", async () => {
    const category = await placemarkService.createCategory(historicBuildings);
    await placemarkService.deleteCategory(category._id);
    try {
      await placemarkService.getCategory(category._id);
      assert.fail("Should not return a category");
    } catch (error) {
      assert.equal(error.response.data.message, "No Category with this id");
      assert.equal(error.response.data.statusCode, 404);
    }
  });
});