import { assert } from "chai";
import { placemarkService } from "./placemark-service.js";
import { assertSubset } from "../test-utils.js";
import { maggie, maggieCredentials, historicBuildings, reginaldsTower, testPlacemarks, publicPlacemark, placemarkReview } from "../fixtures.js";

suite("Placemark API tests", () => {
  let user = null;
  let category = null;

  setup(async () => {
    placemarkService.clearAuth();
    await placemarkService.deleteAllUsers();

    user = await placemarkService.createUser(maggie);
    await placemarkService.authenticate(maggieCredentials);

    await placemarkService.deleteAllPlacemarks();
    await placemarkService.deleteAllCategories();

    historicBuildings.userid = user._id;
    category = await placemarkService.createCategory(historicBuildings);
  });

  teardown(async () => {});

  test("create placemark", async () => {
    const returnedPlacemark = await placemarkService.createPlacemark(category._id, reginaldsTower);
    assertSubset(reginaldsTower, returnedPlacemark);
    assert.isDefined(returnedPlacemark._id);
  });

  test("create multiple placemarks", async () => {
    for (let i = 0; i < testPlacemarks.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await placemarkService.createPlacemark(category._id, testPlacemarks[i]);
    }

    const returnedPlacemarks = await placemarkService.getAllPlacemarks();
    assert.equal(returnedPlacemarks.length, testPlacemarks.length);

    for (let i = 0; i < returnedPlacemarks.length; i += 1) {
      assertSubset(testPlacemarks[i], returnedPlacemarks[i]);
    }
  });

  test("delete placemark", async () => {
    const placemark = await placemarkService.createPlacemark(category._id, reginaldsTower);
    const response = await placemarkService.deletePlacemark(placemark._id);
    assert.equal(response, "");
    const returnedPlacemarks = await placemarkService.getAllPlacemarks();
    assert.equal(returnedPlacemarks.length, 0);
  });

  test("get a placemark", async () => {
    const placemark = await placemarkService.createPlacemark(category._id, reginaldsTower);
    const returnedPlacemark = await placemarkService.getPlacemark(placemark._id);
    assertSubset(reginaldsTower, returnedPlacemark);
  });

  test("update a placemark", async () => {
    const placemark = await placemarkService.createPlacemark(category._id, reginaldsTower);
    const updatedPlacemark = {
      title: "Hook Lighthouse",
      description: "Historic lighthouse in Wexford",
      latitude: 52.1248,
      longitude: -6.9302,
      img: "",
    };

    const returnedPlacemark = await placemarkService.updatePlacemark(placemark._id, updatedPlacemark);
    assertSubset(updatedPlacemark, returnedPlacemark);
  });

  test("get all placemarks", async () => {
    for (let i = 0; i < testPlacemarks.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await placemarkService.createPlacemark(category._id, testPlacemarks[i]);
    }

    const returnedPlacemarks = await placemarkService.getAllPlacemarks();
    assert.equal(returnedPlacemarks.length, testPlacemarks.length);
  });

  test("get placemark detail", async () => {
    const placemark = await placemarkService.createPlacemark(category._id, reginaldsTower);
    const returnedPlacemark = await placemarkService.getPlacemark(placemark._id);
    assert.deepEqual(returnedPlacemark.title, placemark.title);
    assert.deepEqual(returnedPlacemark.description, placemark.description);
    assert.deepEqual(returnedPlacemark.latitude, placemark.latitude);
    assert.deepEqual(returnedPlacemark.longitude, placemark.longitude);
  });

  test("get a placemark - bad id", async () => {
    try {
      await placemarkService.getPlacemark("1234");
      assert.fail("Should not return a placemark");
    } catch (error) {
      assert.equal(error.response.data.message, "No Placemark with this id");
      assert.equal(error.response.data.statusCode, 503);
    }
  });

  test("get a placemark - deleted placemark", async () => {
    const placemark = await placemarkService.createPlacemark(category._id, reginaldsTower);
    await placemarkService.deletePlacemark(placemark._id);
    try {
      await placemarkService.getPlacemark(placemark._id);
      assert.fail("Should not return a placemark");
    } catch (error) {
      assert.equal(error.response.data.message, "No Placemark with this id");
      assert.equal(error.response.data.statusCode, 404);
    }
  });

  test("create public placemark", async () => {
    const returnedPlacemark = await placemarkService.createPlacemark(category._id, publicPlacemark);
    assertSubset(publicPlacemark, returnedPlacemark);
    assert.isDefined(returnedPlacemark._id);
    assert.equal(returnedPlacemark.isPublic, true);
  });

  test("get public placemarks only", async () => {
    await placemarkService.createPlacemark(category._id, publicPlacemark);

    const returnedPlacemarks = await placemarkService.getPublicPlacemarks();

    assert.equal(returnedPlacemarks.length, 1);
    assert.equal(returnedPlacemarks[0].title, publicPlacemark.title);
    assert.equal(returnedPlacemarks[0].isPublic, true);
  });

  test("create review for placemark", async () => {
    const placemark = await placemarkService.createPlacemark(category._id, reginaldsTower);

    const returnedReview = await placemarkService.createReview(placemark._id, placemarkReview);

    assert.equal(returnedReview.comment, placemarkReview.comment);
    assert.equal(returnedReview.rating, placemarkReview.rating);
    assert.equal(returnedReview.placemarkid, placemark._id);
    assert.isDefined(returnedReview._id);
  });

  test("delete review for placemark", async () => {
    const placemark = await placemarkService.createPlacemark(category._id, reginaldsTower);
    const review = await placemarkService.createReview(placemark._id, placemarkReview);

    const response = await placemarkService.deleteReview(review._id);
    assert.equal(response, "");

    const returnedReviews = await placemarkService.getPlacemarkReviews(placemark._id);
    assert.equal(returnedReviews.length, 0);
  });

  test("denormalised category", async () => {
    for (let i = 0; i < testPlacemarks.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await placemarkService.createPlacemark(category._id, testPlacemarks[i]);
    }
    const returnedCategory = await placemarkService.getCategory(category._id);
    assert.equal(returnedCategory.placemarks.length, testPlacemarks.length);
  });

  
});