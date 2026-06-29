const db = require("../db/queries");

async function getGames(req, res) {
  const [games, genres, platforms] = await Promise.all([
    db.getAllGames(),
    db.getAllGenres(),
    db.getAllPlatforms(),
  ]);
  res.render("index", {
    title: "Video Game Inventory",
    gamesList: games,
    genresList: genres,
    platformsList: platforms,
  });
}

async function getGamesByGenreList(req, res) {
  const genreId = req.params.genreId;
  const [games, genres, platforms] = await Promise.all([
    db.getGamesByGenre(genreId),
    db.getAllGenres(),
    db.getAllPlatforms(),
  ]);
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
  const [games, genres, platforms] = await Promise.all([
    db.getGamesByPlatform(platformId),
    db.getAllGenres(),
    db.getAllPlatforms(),
  ]);
  res.render("index", {
    title: "Filtered Games",
    gamesList: games,
    genresList: genres,
    platformsList: platforms,
    isFiltered: true,
  });
}

async function getCreateGameForm(req, res) {
  const [genres, platforms] = await Promise.all([
    db.getAllGenres(),
    db.getAllPlatforms(),
  ]);
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

async function getEditGameForm(req, res) {
  const gameId = req.params.id;
  const [game, genres, platforms] = await Promise.all([
    db.showGameDetails(gameId),
    db.getAllGenres(),
    db.getAllPlatforms(),
  ]);
  res.render("editGame", {
    title: "Edit Game",
    game: game,
    genresList: genres,
    platformsList: platforms,
  });
}

async function postEditGameForm(req, res) {
  const gameId = req.params.id;
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
  await db.updateGameDetails(
    gameId,
    title,
    price,
    date,
    developer,
    publisher,
    coverImg,
    genreIds,
    platformIds,
  );
  res.redirect(`/games/${gameId}`);
}

async function postDeleteGame(req, res) {
  const gameId = req.params.id;
  const deleteGame = await db.deleteGame(gameId);
  res.redirect("/");
}

module.exports = {
  getGames,
  getGamesByGenreList,
  getGamesByPlatformList,
  getCreateGameForm,
  postCreateGameForm,
  getGameDetails,
  getEditGameForm,
  postEditGameForm,
  postDeleteGame,
};
