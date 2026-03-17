import { assert } from "chai";
import { playtimeService } from "./playtime-service.js";
import { maggie, maggieCredentials, mozart, testCategories } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

suite("Category API tests", () => {
  let user = null;

  setup(async () => {
    playtimeService.clearAuth();
    await playtimeService.deleteAllCategories();
    await playtimeService.deleteAllUsers();
    user = await playtimeService.createUser(maggie);
    await playtimeService.authenticate(maggieCredentials);
    mozart.userid = user._id;
  });

  teardown(async () => {});

  test("create category", async () => {
    const returnedCategory = await playtimeService.createCategory(mozart);
    assertSubset(mozart, returnedCategory);
    assert.isDefined(returnedCategory._id);
  });

  test("delete a category", async () => {
    const category = await playtimeService.createCategory(mozart);
    const response = await playtimeService.deleteCategory(category._id);
    assert.equal(response, "");
    const returnedCategories = await playtimeService.getAllCategories();
    assert.equal(returnedCategories.length, 0);
  });

  test("create multiple categories", async () => {
    for (let i = 0; i < testCategories.length; i += 1) {
      testCategories[i].userid = user._id;
      // eslint-disable-next-line no-await-in-loop
      await playtimeService.createCategory(testCategories[i]);
    }
    const returnedLists = await playtimeService.getAllCategories();
    assert.equal(returnedLists.length, testCategories.length);
    for (let i = 0; i < returnedLists.length; i += 1) {
      assertSubset(testCategories[i], returnedLists[i]);
    }
  });

  test("delete all categories", async () => {
    for (let i = 0; i < testCategories.length; i += 1) {
      testCategories[i].userid = user._id;
      // eslint-disable-next-line no-await-in-loop
      await playtimeService.createCategory(testCategories[i]);
    }
    let returnedLists = await playtimeService.getAllCategories();
    assert.equal(returnedLists.length, testCategories.length);
    await playtimeService.deleteAllCategories();
    returnedLists = await playtimeService.getAllCategories();
    assert.equal(returnedLists.length, 0);
  });

  test("get a category", async () => {
    const category = await playtimeService.createCategory(mozart);
    const returnedCategory = await playtimeService.getCategory(category._id);
    assert.deepEqual(category, returnedCategory);
  });

  test("get a category - bad id", async () => {
    try {
      await playtimeService.getCategory("1234");
      assert.fail("Should not return a category");
    } catch (error) {
      assert(error.response.data.message === "No Category with this id");
      assert.equal(error.response.data.statusCode, 503);
    }
  });

  test("get a category - deleted category", async () => {
    const category = await playtimeService.createCategory(mozart);
    await playtimeService.deleteCategory(category._id);
    try {
      await playtimeService.getCategory(category._id);
      assert.fail("Should not return a category");
    } catch (error) {
      assert(error.response.data.message === "No Category with this id");
      assert.equal(error.response.data.statusCode, 404);
    }
  });
});