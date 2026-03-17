import { assert } from "chai";
import { playtimeService } from "./playtime-service.js";
import { assertSubset } from "../test-utils.js";
import { maggie, maggieCredentials, mozart, concerto, testTracks } from "../fixtures.js";

suite("Track API tests", () => {
  let user = null;
  let playlist = null;

  setup(async () => {
    playtimeService.clearAuth();
    await playtimeService.deleteAllTracks();
    await playtimeService.deleteAllPlaylists();
    await playtimeService.deleteAllUsers();

    user = await playtimeService.createUser(maggie);
    await playtimeService.authenticate(maggieCredentials);

    mozart.userid = user._id;
    playlist = await playtimeService.createPlaylist(mozart);
  });

  teardown(async () => {});

  test("create track", async () => {
    const returnedTrack = await playtimeService.createTrack(playlist._id, concerto);
    assertSubset(concerto, returnedTrack);
    assert.isDefined(returnedTrack._id);
  });

  test("create multiple tracks", async () => {
    for (let i = 0; i < testTracks.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await playtimeService.createTrack(playlist._id, testTracks[i]);
    }

    const returnedTracks = await playtimeService.getAllTracks();
    assert.equal(returnedTracks.length, testTracks.length);

    for (let i = 0; i < returnedTracks.length; i += 1) {
      assertSubset(testTracks[i], returnedTracks[i]);
    }
  });

  test("delete track", async () => {
    const track = await playtimeService.createTrack(playlist._id, concerto);
    const response = await playtimeService.deleteTrack(track._id);
    assert.equal(response, "");
    const returnedTracks = await playtimeService.getAllTracks();
    assert.equal(returnedTracks.length, 0);
  });

  test("get a track", async () => {
    const track = await playtimeService.createTrack(playlist._id, concerto);
    const returnedTrack = await playtimeService.getTrack(track._id);
    assertSubset(concerto, returnedTrack);
  });

  test("update a track", async () => {
    const track = await playtimeService.createTrack(playlist._id, concerto);
    const updatedTrack = {
      title: "Hook Lighthouse",
      description: "Historic lighthouse in Wexford",
      latitude: 52.1248,
      longitude: -6.9302,
      img: "",
    };

    const returnedTrack = await playtimeService.updateTrack(track._id, updatedTrack);
    assertSubset(updatedTrack, returnedTrack);
  });

  test("get all tracks", async () => {
    for (let i = 0; i < testTracks.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await playtimeService.createTrack(playlist._id, testTracks[i]);
    }

    const returnedTracks = await playtimeService.getAllTracks();
    assert.equal(returnedTracks.length, testTracks.length);
  });

  test("get track detail", async () => {
    const track = await playtimeService.createTrack(playlist._id, concerto);
    const returnedTrack = await playtimeService.getTrack(track._id);
    assert.deepEqual(returnedTrack.title, track.title);
    assert.deepEqual(returnedTrack.description, track.description);
    assert.deepEqual(returnedTrack.latitude, track.latitude);
    assert.deepEqual(returnedTrack.longitude, track.longitude);
  });

  test("get a track - bad id", async () => {
    try {
      await playtimeService.getTrack("1234");
      assert.fail("Should not return a track");
    } catch (error) {
      assert.equal(error.response.data.message, "No Placemark with this id");
      assert.equal(error.response.data.statusCode, 503);
    }
  });

  test("get a track - deleted track", async () => {
    const track = await playtimeService.createTrack(playlist._id, concerto);
    await playtimeService.deleteTrack(track._id);
    try {
      await playtimeService.getTrack(track._id);
      assert.fail("Should not return a track");
    } catch (error) {
      assert.equal(error.response.data.message, "No Placemark with this id");
      assert.equal(error.response.data.statusCode, 404);
    }
  });

  test("denormalised playlist", async () => {
    for (let i = 0; i < testTracks.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await playtimeService.createTrack(playlist._id, testTracks[i]);
    }
    const returnedPlaylist = await playtimeService.getPlaylist(playlist._id);
    assert.equal(returnedPlaylist.tracks.length, testTracks.length);
  });
});