import { assert } from "chai";
import { playtimeService } from "./playtime-service.js";
import { maggie, maggieCredentials, mozart, testPlaylists } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

suite("Playlist API tests", () => {
  let user = null;

  setup(async () => {
    playtimeService.clearAuth();
    await playtimeService.deleteAllPlaylists();
    await playtimeService.deleteAllUsers();
    user = await playtimeService.createUser(maggie);
    await playtimeService.authenticate(maggieCredentials);
    mozart.userid = user._id;
  });

  teardown(async () => {});

  test("create playlist", async () => {
    const returnedPlaylist = await playtimeService.createPlaylist(mozart);
    assertSubset(mozart, returnedPlaylist);
    assert.isDefined(returnedPlaylist._id);
  });

  test("delete a playlist", async () => {
    const playlist = await playtimeService.createPlaylist(mozart);
    const response = await playtimeService.deletePlaylist(playlist._id);
    assert.equal(response, "");
    const returnedPlaylists = await playtimeService.getAllPlaylists();
    assert.equal(returnedPlaylists.length, 0);
  });

  test("create multiple playlists", async () => {
    for (let i = 0; i < testPlaylists.length; i += 1) {
      testPlaylists[i].userid = user._id;
      // eslint-disable-next-line no-await-in-loop
      await playtimeService.createPlaylist(testPlaylists[i]);
    }
    const returnedLists = await playtimeService.getAllPlaylists();
    assert.equal(returnedLists.length, testPlaylists.length);
    for (let i = 0; i < returnedLists.length; i += 1) {
      assertSubset(testPlaylists[i], returnedLists[i]);
    }
  });

  test("delete all playlists", async () => {
    for (let i = 0; i < testPlaylists.length; i += 1) {
      testPlaylists[i].userid = user._id;
      // eslint-disable-next-line no-await-in-loop
      await playtimeService.createPlaylist(testPlaylists[i]);
    }
    let returnedLists = await playtimeService.getAllPlaylists();
    assert.equal(returnedLists.length, testPlaylists.length);
    await playtimeService.deleteAllPlaylists();
    returnedLists = await playtimeService.getAllPlaylists();
    assert.equal(returnedLists.length, 0);
  });

  test("get a playlist", async () => {
    const playlist = await playtimeService.createPlaylist(mozart);
    const returnedPlaylist = await playtimeService.getPlaylist(playlist._id);
    assert.deepEqual(playlist, returnedPlaylist);
  });

  test("get a playlist - bad id", async () => {
    try {
      await playtimeService.getPlaylist("1234");
      assert.fail("Should not return a playlist");
    } catch (error) {
      assert(error.response.data.message === "No Category with this id");
      assert.equal(error.response.data.statusCode, 503);
    }
  });

  test("get a playlist - deleted playlist", async () => {
    const playlist = await playtimeService.createPlaylist(mozart);
    await playtimeService.deletePlaylist(playlist._id);
    try {
      await playtimeService.getPlaylist(playlist._id);
      assert.fail("Should not return a playlist");
    } catch (error) {
      assert(error.response.data.message === "No Category with this id");
      assert.equal(error.response.data.statusCode, 404);
    }
  });
});