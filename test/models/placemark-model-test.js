import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { testPlacemarks, reginaldsTower, historicBuildings, maggie } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

suite("Placemark Model tests", () => {
  let user = null;
  let category = null;

  setup(async () => {
    db.init("mongo");
    await db.placemarkStore.deleteAllPlacemarks();
    await db.categoryStore.deleteAllCategories();
    await db.userStore.deleteAll();

    user = await db.userStore.addUser(maggie);
    historicBuildings.userid = user._id;
    category = await db.categoryStore.addCategory(historicBuildings);

    for (let i = 0; i < testPlacemarks.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await db.placemarkStore.addPlacemark(category._id, testPlacemarks[i]);
    }
  });

  test("create a placemark", async () => {
    const placemark = await db.placemarkStore.addPlacemark(category._id, reginaldsTower);
    assertSubset(reginaldsTower, placemark);
    assert.isDefined(placemark._id);
  });

  test("delete all placemarks", async () => {
    let returnedPlacemarks = await db.placemarkStore.getAllPlacemarks();
    assert.equal(returnedPlacemarks.length, testPlacemarks.length);
    await db.placemarkStore.deleteAllPlacemarks();
    returnedPlacemarks = await db.placemarkStore.getAllPlacemarks();
    assert.equal(returnedPlacemarks.length, 0);
  });

  test("get a placemark - success", async () => {
    const placemark = await db.placemarkStore.addPlacemark(category._id, reginaldsTower);
    const returnedPlacemark = await db.placemarkStore.getPlacemarkById(placemark._id);
    assertSubset(reginaldsTower, returnedPlacemark);
  });

  test("delete one placemark - success", async () => {
    const allPlacemarks = await db.placemarkStore.getAllPlacemarks();
    const id = allPlacemarks[0]._id;
    await db.placemarkStore.deletePlacemark(id);
    const returnedPlacemarks = await db.placemarkStore.getAllPlacemarks();
    assert.equal(returnedPlacemarks.length, testPlacemarks.length - 1);
    const deletedPlacemark = await db.placemarkStore.getPlacemarkById(id);
    assert.isNull(deletedPlacemark);
  });

  test("get a placemark - bad params", async () => {
    assert.isNull(await db.placemarkStore.getPlacemarkById(""));
    assert.isNull(await db.placemarkStore.getPlacemarkById());
  });

  test("delete one placemark - fail", async () => {
    await db.placemarkStore.deletePlacemark("bad-id");
    const allPlacemarks = await db.placemarkStore.getAllPlacemarks();
    assert.equal(testPlacemarks.length, allPlacemarks.length);
  });

  test("get placemarks by category id", async () => {
    const returnedPlacemarks = await db.placemarkStore.getPlacemarksByCategoryId(category._id);
    assert.equal(returnedPlacemarks.length, testPlacemarks.length);
  });

  test("update placemark", async () => {
    const allPlacemarks = await db.placemarkStore.getAllPlacemarks();
    const placemark = allPlacemarks[0];

    const updatedPlacemark = {
      title: "Hook Lighthouse",
      description: "Historic lighthouse in Wexford",
      latitude: 52.1248,
      longitude: -6.9302,
      img: "",
    };

    const placemarkDoc = await db.placemarkStore.getPlacemarkById(placemark._id);
    await db.placemarkStore.updatePlacemark(placemarkDoc, updatedPlacemark);
    const returnedPlacemark = await db.placemarkStore.getPlacemarkById(placemark._id);

    assert.equal(returnedPlacemark.title, updatedPlacemark.title);
    assert.equal(returnedPlacemark.description, updatedPlacemark.description);
    assert.equal(returnedPlacemark.latitude, updatedPlacemark.latitude);
    assert.equal(returnedPlacemark.longitude, updatedPlacemark.longitude);
    assert.equal(returnedPlacemark.img, updatedPlacemark.img);
  });
});