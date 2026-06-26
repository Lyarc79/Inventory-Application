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
    isFiltered: true,
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
    isFiltered: true,
  });
}

async function getCreateGameForm(req, res) {
  const genres = await db.getAllGenres();
  const platforms = await db.getAllPlatforms();
  res.render("addGame", {
    title: "Add New Game",
    genresList: genres,
    platformsList: platforms,
  });
}

async function postCreateGameForm(req, res) {
  const {
    title,
    developer,
    publisher,
    date,
    price,
    coverImg,
    genres,
    platforms,
  } = req.body;
  const genreIds = Array.isArray(genres) ? genres : genres ? [genres] : [];
  const platformIds = Array.isArray(platforms)
    ? platforms
    : platforms
      ? [platforms]
      : [];
  await db.insertGame(
    title,
    price,
    date,
    developer,
    publisher,
    coverImg,
    genreIds,
    platformIds,
  );
  res.redirect("/");
}

async function getGameDetails(req, res) {
  const gameId = req.params.id;
  const game = await db.showGameDetails(gameId);
  res.render("gameDetails", {
    game: game,
  });
}

module.exports = {
  getGames,
  getGamesByGenreList,
  getGamesByPlatformList,
  getCreateGameForm,
  postCreateGameForm,
  getGameDetails,
};
