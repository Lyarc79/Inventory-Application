const db = require("../db/queries");

async function getGames(req, res) {
  const games = await db.getAllGames();
  const genres = await db.getAllGenres();
  const platforms = await db.getAllPlatforms();
  res.render("index", {
    title: "Video Game Inventory",
    gamesList: games,
    genresList: genres,
    platformsList: platforms,
  });
}

async function getGamesByGenreList(req, res) {
  const genreId = req.params.genreId;
  const games = await db.getGamesByGenre(genreId);
  const genres = await db.getAllGenres();
  const platforms = await db.getAllPlatforms();
  res.render("index", {
    title: "Filtered Games",
    gamesList: games,
    genresList: genres,
    platformsList: platforms,
  });
}

async function getGamesByPlatformList(req, res) {
  const platformId = req.params.platformId;
  const games = await db.getGamesByPlatform(platformId);
  const genres = await db.getAllGenres();
  const platforms = await db.getAllPlatforms();
  res.render("index", {
    title: "Filtered Games",
    gamesList: games,
    genresList: genres,
    platformsList: platforms,
  });
}

module.exports = {
  getGames,
  getGamesByGenreList,
  getGamesByPlatformList,
};
