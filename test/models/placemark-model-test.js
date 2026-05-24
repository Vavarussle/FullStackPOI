import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { testPlacemarks, reginaldsTower, historicBuildings, maggie, publicPlacemark, placemarkReview, secondPlacemarkReview } from "../fixtures.js";
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
    await db.reviewStore.deleteReviewsByUserId(user._id);

    category = await db.categoryStore.addCategory({
      userid: user._id,
      title: historicBuildings.title,
    });

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
      isPublic: false,
    };

    const placemarkDoc = await db.placemarkStore.getPlacemarkById(placemark._id);
    await db.placemarkStore.updatePlacemark(placemarkDoc, updatedPlacemark);
    const returnedPlacemark = await db.placemarkStore.getPlacemarkById(placemark._id);

    assert.equal(returnedPlacemark.title, updatedPlacemark.title);
    assert.equal(returnedPlacemark.description, updatedPlacemark.description);
    assert.equal(returnedPlacemark.latitude, updatedPlacemark.latitude);
    assert.equal(returnedPlacemark.longitude, updatedPlacemark.longitude);
    assert.equal(returnedPlacemark.img, updatedPlacemark.img);
    assert.equal(returnedPlacemark.isPublic, updatedPlacemark.isPublic);
  });

  test("create a public placemark", async () => {
    await db.placemarkStore.deleteAllPlacemarks();

    const placemark = await db.placemarkStore.addPlacemark(category._id, publicPlacemark);

    assertSubset(publicPlacemark, placemark);
    assert.isDefined(placemark._id);
    assert.equal(placemark.isPublic, true);
  });

  test("get all public placemarks", async () => {
    await db.placemarkStore.deleteAllPlacemarks();

    await db.placemarkStore.addPlacemark(category._id, publicPlacemark);

    const returnedPlacemarks = await db.placemarkStore.getAllPublicPlacemarks();

    assert.equal(returnedPlacemarks.length, 1);
    assert.equal(returnedPlacemarks[0].title, publicPlacemark.title);
    assert.equal(returnedPlacemarks[0].isPublic, true);
  });

  test("create a review for a placemark", async () => {
    const placemark = await db.placemarkStore.addPlacemark(category._id, reginaldsTower);

    const review = await db.reviewStore.addReview({
      placemarkid: placemark._id,
      userid: user._id,
      reviewerName: `${user.firstName} ${user.lastName}`,
      comment: placemarkReview.comment,
      rating: placemarkReview.rating,
    });

    assert.isDefined(review._id);
    assert.equal(review.comment, placemarkReview.comment);
    assert.equal(review.rating, placemarkReview.rating);
    assert.equal(`${review.placemarkid}`, `${placemark._id}`);
  });

  test("delete a review for a placemark", async () => {
    const placemark = await db.placemarkStore.addPlacemark(category._id, reginaldsTower);

    const review = await db.reviewStore.addReview({
      placemarkid: placemark._id,
      userid: user._id,
      reviewerName: `${user.firstName} ${user.lastName}`,
      comment: placemarkReview.comment,
      rating: placemarkReview.rating,
    });

    await db.reviewStore.deleteReviewById(review._id);

    const returnedReviews = await db.reviewStore.getReviewsByPlacemarkId(placemark._id);
    assert.equal(returnedReviews.length, 0);
  });

  test("get review by id returns null for missing id", async () => {
    const review = await db.reviewStore.getReviewById();
    assert.isNull(review);
  });

  test("get review by id returns null for bad id", async () => {
    const review = await db.reviewStore.getReviewById("507f1f77bcf86cd799439011");
    assert.isNull(review);
  });

  test("delete review by id handles bad id", async () => {
    await db.reviewStore.deleteReviewById("bad-id");
    assert.ok(true);
  });

  test("delete reviews by placemark id", async () => {
    const placemark = await db.placemarkStore.addPlacemark(category._id, reginaldsTower);

    await db.reviewStore.addReview({
      placemarkid: placemark._id,
      userid: user._id,
      reviewerName: `${user.firstName} ${user.lastName}`,
      comment: placemarkReview.comment,
      rating: placemarkReview.rating,
    });

    await db.reviewStore.addReview({
      placemarkid: placemark._id,
      userid: user._id,
      reviewerName: `${user.firstName} ${user.lastName}`,
      comment: secondPlacemarkReview.comment,
      rating: secondPlacemarkReview.rating,
    });

    await db.reviewStore.deleteReviewsByPlacemarkId(placemark._id);

    const returnedReviews = await db.reviewStore.getReviewsByPlacemarkId(placemark._id);
    assert.equal(returnedReviews.length, 0);
  });

  test("delete reviews by user id", async () => {
    const placemark = await db.placemarkStore.addPlacemark(category._id, reginaldsTower);

    await db.reviewStore.addReview({
      placemarkid: placemark._id,
      userid: user._id,
      reviewerName: `${user.firstName} ${user.lastName}`,
      comment: placemarkReview.comment,
      rating: placemarkReview.rating,
    });

    await db.reviewStore.deleteReviewsByUserId(user._id);

    const returnedReviews = await db.reviewStore.getReviewsByPlacemarkId(placemark._id);
    assert.equal(returnedReviews.length, 0);
  });

});