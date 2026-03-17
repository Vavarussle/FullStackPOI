import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { testTracks, concerto, mozart, maggie } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

suite("Track Model tests", () => {
  let user = null;
  let playlist = null;

  setup(async () => {
    db.init("mongo");
    await db.trackStore.deleteAllTracks();
    await db.playlistStore.deleteAllPlaylists();
    await db.userStore.deleteAll();

    user = await db.userStore.addUser(maggie);
    mozart.userid = user._id;
    playlist = await db.playlistStore.addPlaylist(mozart);

    for (let i = 0; i < testTracks.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await db.trackStore.addTrack(playlist._id, testTracks[i]);
    }
  });

  test("create a track", async () => {
    const track = await db.trackStore.addTrack(playlist._id, concerto);
    assertSubset(concerto, track);
    assert.isDefined(track._id);
  });

  test("delete all tracks", async () => {
    let returnedTracks = await db.trackStore.getAllTracks();
    assert.equal(returnedTracks.length, testTracks.length);
    await db.trackStore.deleteAllTracks();
    returnedTracks = await db.trackStore.getAllTracks();
    assert.equal(returnedTracks.length, 0);
  });

  test("get a track - success", async () => {
    const track = await db.trackStore.addTrack(playlist._id, concerto);
    const returnedTrack = await db.trackStore.getTrackById(track._id);
    assertSubset(concerto, returnedTrack);
  });

  test("delete one track - success", async () => {
    const allTracks = await db.trackStore.getAllTracks();
    const id = allTracks[0]._id;
    await db.trackStore.deleteTrack(id);
    const returnedTracks = await db.trackStore.getAllTracks();
    assert.equal(returnedTracks.length, testTracks.length - 1);
    const deletedTrack = await db.trackStore.getTrackById(id);
    assert.isNull(deletedTrack);
  });

  test("get a track - bad params", async () => {
    assert.isNull(await db.trackStore.getTrackById(""));
    assert.isNull(await db.trackStore.getTrackById());
  });

  test("delete one track - fail", async () => {
    await db.trackStore.deleteTrack("bad-id");
    const allTracks = await db.trackStore.getAllTracks();
    assert.equal(testTracks.length, allTracks.length);
  });

  test("get tracks by playlist id", async () => {
    const returnedTracks = await db.trackStore.getTracksByPlaylistId(playlist._id);
    assert.equal(returnedTracks.length, testTracks.length);
  });

  test("update track", async () => {
    const allTracks = await db.trackStore.getAllTracks();
    const track = allTracks[0];

    const updatedTrack = {
      title: "Hook Lighthouse",
      description: "Historic lighthouse in Wexford",
      latitude: 52.1248,
      longitude: -6.9302,
      img: "",
    };

    const trackDoc = await db.trackStore.getTrackById(track._id);
    await db.trackStore.updateTrack(trackDoc, updatedTrack);
    const returnedTrack = await db.trackStore.getTrackById(track._id);

    assert.equal(returnedTrack.title, updatedTrack.title);
    assert.equal(returnedTrack.description, updatedTrack.description);
    assert.equal(returnedTrack.latitude, updatedTrack.latitude);
    assert.equal(returnedTrack.longitude, updatedTrack.longitude);
    assert.equal(returnedTrack.img, updatedTrack.img);
  });
});