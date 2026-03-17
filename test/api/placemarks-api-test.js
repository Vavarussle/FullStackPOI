import { assert } from "chai";
import { playtimeService } from "./playtime-service.js";
import { assertSubset } from "../test-utils.js";
import { maggie, maggieCredentials, mozart, concerto, testPlacemarks } from "../fixtures.js";

suite("Placemark API tests", () => {
  let user = null;
  let category = null;

  setup(async () => {
    playtimeService.clearAuth();
    await playtimeService.deleteAllPlacemarks();
    await playtimeService.deleteAllCategories();
    await playtimeService.deleteAllUsers();

    user = await playtimeService.createUser(maggie);
    await playtimeService.authenticate(maggieCredentials);

    mozart.userid = user._id;
    category = await playtimeService.createCategory(mozart);
  });

  teardown(async () => {});

  test("create placemark", async () => {
    const returnedPlacemark = await playtimeService.createPlacemark(category._id, concerto);
    assertSubset(concerto, returnedPlacemark);
    assert.isDefined(returnedPlacemark._id);
  });

  test("create multiple placemarks", async () => {
    for (let i = 0; i < testPlacemarks.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await playtimeService.createPlacemark(category._id, testPlacemarks[i]);
    }

    const returnedPlacemarks = await playtimeService.getAllPlacemarks();
    assert.equal(returnedPlacemarks.length, testPlacemarks.length);

    for (let i = 0; i < returnedPlacemarks.length; i += 1) {
      assertSubset(testPlacemarks[i], returnedPlacemarks[i]);
    }
  });

  test("delete placemark", async () => {
    const placemark = await playtimeService.createPlacemark(category._id, concerto);
    const response = await playtimeService.deletePlacemark(placemark._id);
    assert.equal(response, "");
    const returnedPlacemarks = await playtimeService.getAllPlacemarks();
    assert.equal(returnedPlacemarks.length, 0);
  });

  test("get a placemark", async () => {
    const placemark = await playtimeService.createPlacemark(category._id, concerto);
    const returnedPlacemark = await playtimeService.getPlacemark(placemark._id);
    assertSubset(concerto, returnedPlacemark);
  });

  test("update a placemark", async () => {
    const placemark = await playtimeService.createPlacemark(category._id, concerto);
    const updatedPlacemark = {
      title: "Hook Lighthouse",
      description: "Historic lighthouse in Wexford",
      latitude: 52.1248,
      longitude: -6.9302,
      img: "",
    };

    const returnedPlacemark = await playtimeService.updatePlacemark(placemark._id, updatedPlacemark);
    assertSubset(updatedPlacemark, returnedPlacemark);
  });

  test("get all placemarks", async () => {
    for (let i = 0; i < testPlacemarks.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await playtimeService.createPlacemark(category._id, testPlacemarks[i]);
    }

    const returnedPlacemarks = await playtimeService.getAllPlacemarks();
    assert.equal(returnedPlacemarks.length, testPlacemarks.length);
  });

  test("get placemark detail", async () => {
    const placemark = await playtimeService.createPlacemark(category._id, concerto);
    const returnedPlacemark = await playtimeService.getPlacemark(placemark._id);
    assert.deepEqual(returnedPlacemark.title, placemark.title);
    assert.deepEqual(returnedPlacemark.description, placemark.description);
    assert.deepEqual(returnedPlacemark.latitude, placemark.latitude);
    assert.deepEqual(returnedPlacemark.longitude, placemark.longitude);
  });

  test("get a placemark - bad id", async () => {
    try {
      await playtimeService.getPlacemark("1234");
      assert.fail("Should not return a placemark");
    } catch (error) {
      assert.equal(error.response.data.message, "No Placemark with this id");
      assert.equal(error.response.data.statusCode, 503);
    }
  });

  test("get a placemark - deleted placemark", async () => {
    const placemark = await playtimeService.createPlacemark(category._id, concerto);
    await playtimeService.deletePlacemark(placemark._id);
    try {
      await playtimeService.getPlacemark(placemark._id);
      assert.fail("Should not return a placemark");
    } catch (error) {
      assert.equal(error.response.data.message, "No Placemark with this id");
      assert.equal(error.response.data.statusCode, 404);
    }
  });

  test("denormalised category", async () => {
    for (let i = 0; i < testPlacemarks.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await playtimeService.createPlacemark(category._id, testPlacemarks[i]);
    }
    const returnedCategory = await playtimeService.getCategory(category._id);
    assert.equal(returnedCategory.placemarks.length, testPlacemarks.length);
  });
});