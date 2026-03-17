import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { testCategories, mozart, maggie } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

suite("Category Model tests", () => {
  let user = null;

  setup(async () => {
    db.init("mongo");
    await db.categoryStore.deleteAllCategories();
    await db.userStore.deleteAll();
    user = await db.userStore.addUser(maggie);
    mozart.userid = user._id;
    for (let i = 0; i < testCategories.length; i += 1) {
      testCategories[i].userid = user._id;
      // eslint-disable-next-line no-await-in-loop
      await db.categoryStore.addCategory(testCategories[i]);
    }
  });

  test("create a category", async () => {
    const category = await db.categoryStore.addCategory(mozart);
    assertSubset(mozart, category);
    assert.isDefined(category._id);
  });

  test("delete all categories", async () => {
    let returnedCategories = await db.categoryStore.getAllCategories();
    assert.equal(returnedCategories.length, 3);
    await db.categoryStore.deleteAllCategories();
    returnedCategories = await db.categoryStore.getAllCategories();
    assert.equal(returnedCategories.length, 0);
  });

  test("get a category - success", async () => {
    const category = await db.categoryStore.addCategory(mozart);
    const returnedCategory = await db.categoryStore.getCategoryById(category._id);
    assertSubset(mozart, returnedCategory);
  });

  test("delete One category - success", async () => {
    const id = testCategories[0]._id;
    await db.categoryStore.deleteCategoryById(id);
    const returnedCategories = await db.categoryStore.getAllCategories();
    assert.equal(returnedCategories.length, testCategories.length - 1);
    const deletedCategory = await db.categoryStore.getCategoryById(id);
    assert.isNull(deletedCategory);
  });

  test("get a category - bad params", async () => {
    assert.isNull(await db.categoryStore.getCategoryById(""));
    assert.isNull(await db.categoryStore.getCategoryById());
  });

  test("delete one category - fail", async () => {
    await db.categoryStore.deleteCategoryById("bad-id");
    const allCategories = await db.categoryStore.getAllCategories();
    assert.equal(testCategories.length, allCategories.length);
  });

  test("get all categories", async () => {
    const categories = await db.categoryStore.getAllCategories();
    assert.equal(categories.length, testCategories.length);
  });

  test("get user categories", async () => {
    const categories = await db.categoryStore.getUserCategories(user._id);
    assert.equal(categories.length, testCategories.length);
  });
});