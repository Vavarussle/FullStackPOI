import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { historicBuildings, coastalWalks, publicPlacemark, testCategories, maggie, privatePlacemark  } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

suite("Category Model tests", () => {
  let user = null;
  let insertedCategories = [];

  setup(async () => {
    db.init("mongo");
    await db.placemarkStore.deleteAllPlacemarks();
    await db.categoryStore.deleteAllCategories();
    await db.userStore.deleteAll();

    user = await db.userStore.addUser(maggie);

    historicBuildings.userid = user._id;
    insertedCategories = [];

    for (let i = 0; i < testCategories.length; i += 1) {
      const category = { ...testCategories[i], userid: user._id };
      // eslint-disable-next-line no-await-in-loop
      const insertedCategory = await db.categoryStore.addCategory(category);
      insertedCategories.push(insertedCategory);
    }
  });

  test("create a category", async () => {
    const categoryData = {
      userid: user._id,
      title: historicBuildings.title,
    };
    const category = await db.categoryStore.addCategory(categoryData);
    assertSubset(categoryData, category);
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
    const category = await db.categoryStore.addCategory(historicBuildings);
    const returnedCategory = await db.categoryStore.getCategoryById(category._id);
    assertSubset(historicBuildings, returnedCategory);
  });

  test("delete one category - success", async () => {
    const id = insertedCategories[0]._id;
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

  test("update a category", async () => {

    const category = await db.categoryStore.addCategory({
      userid: user._id,
      title: historicBuildings.title,
    });

    category.title = coastalWalks.title;
    await db.categoryStore.updateCategory(category);

    const updatedCategory = await db.categoryStore.getCategoryById(category._id);
    assert.equal(updatedCategory.title, coastalWalks.title);
  });

  test("get categories with public placemarks only", async () => {

    const publicCategory = await db.categoryStore.addCategory({
      userid: user._id,
      title: historicBuildings.title,
    });

    const privateCategory = await db.categoryStore.addCategory({
      userid: user._id,
      title: coastalWalks.title,
    });

    await db.placemarkStore.addPlacemark(publicCategory._id, publicPlacemark);
    await db.placemarkStore.addPlacemark(privateCategory._id, privatePlacemark);

    const returnedCategories = await db.categoryStore.getCategoriesWithPublicPlacemarks();

    assert.equal(returnedCategories.length, 1);
    assert.equal(returnedCategories[0].title, historicBuildings.title);
    assert.equal(returnedCategories[0].placemarks.length, 1);
    assert.equal(returnedCategories[0].placemarks[0].isPublic, true);
  });

  test("get public category by id", async () => {

    const category = await db.categoryStore.addCategory({
      userid: user._id,
      title: historicBuildings.title,
    });

    await db.placemarkStore.addPlacemark(category._id, publicPlacemark);
    await db.placemarkStore.addPlacemark(category._id, privatePlacemark);

    const returnedCategory = await db.categoryStore.getPublicCategoryById(category._id);

    assert.equal(returnedCategory.title, historicBuildings.title);
    assert.equal(returnedCategory.placemarks.length, 1);
    assert.equal(returnedCategory.placemarks[0].title, publicPlacemark.title);
    assert.equal(returnedCategory.placemarks[0].isPublic, true);
  });

  test("get public category by id returns null for missing id", async () => {
    const returnedCategory = await db.categoryStore.getPublicCategoryById();
    assert.isNull(returnedCategory);
  });

  test("get public category by id returns null for bad id", async () => {
    const returnedCategory = await db.categoryStore.getPublicCategoryById("507f1f77bcf86cd799439011");
    assert.isNull(returnedCategory);
  });

});