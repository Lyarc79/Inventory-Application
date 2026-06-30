const db = require("../db/queries");
const { validationResult } = require("express-validator");

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
    genresList: genres,
    platformsList: platforms,
    game: {},
  });
}

async function postCreateGameForm(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const [genres, platforms] = await Promise.all([
      db.getAllGenres(),
      db.getAllPlatforms(),
    ]);
    res.render("addGame", {
      genresList: genres,
      platformsList: platforms,
      errors: errors.array(),
      game: req.body,
    });
  } else {
    const {
      title,
      developer_name,
      publisher_name,
      release_date,
      price,
      cover_image_url,
      genres,
      platforms,
    } = req.body;
    await db.insertGame(
      title,
      price,
      release_date,
      developer_name,
      publisher_name,
      cover_image_url,
      genres,
      platforms,
    );
    res.redirect("/games");
  }
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
    game: game,
    genresList: genres,
    platformsList: platforms,
  });
}

async function postEditGameForm(req, res) {
  const gameId = req.params.id;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const [game, genres, platforms] = await Promise.all([
      db.showGameDetails(gameId),
      db.getAllGenres(),
      db.getAllPlatforms(),
    ]);
    const blendedGameData = { ...game, ...req.body };
    res.render("editGame", {
      game: blendedGameData,
      genresList: genres,
      platformsList: platforms,
      errors: errors.array(),
    });
  } else {
    const {
      title,
      developer_name,
      publisher_name,
      release_date,
      price,
      cover_image_url,
      genres,
      platforms,
    } = req.body;
    await db.updateGameDetails(
      gameId,
      title,
      developer_name,
      publisher_name,
      release_date,
      price,
      cover_image_url,
      genres,
      platforms,
    );
    res.redirect(`/games/${gameId}`);
  }
}

async function postDeleteGame(req, res) {
  const gameId = req.params.id;
  const deleteGame = await db.deleteGame(gameId);
  res.redirect("/games");
}

async function getAddGenre(req, res) {
  const genres = await db.getAllGenres();
  res.render("addGenre", {
    genresList: genres,
  });
}

async function postAddGenre(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const genres = await db.getAllGenres();
    res.render("addGenre.ejs", {
      genresList: genres,
      errors: errors.array(),
    });
  } else {
    const newGenre = await db.insertGenre(req.body.genre);
    res.redirect("/games");
  }
}

async function getAddPlatform(req, res) {
  const platforms = await db.getAllPlatforms();
  res.render("addPlatform", {
    platformsList: platforms,
  });
}

async function postAddPlatform(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const platforms = await db.getAllPlatforms();
    res.render("addPlatform", {
      platformList: platforms,
      errors: errors.array(),
    });
  } else {
    const newPlatform = await db.insertPlatform(req.body.platform);
    res.redirect("/games");
  }
}

async function postDeleteGenre(req, res) {
  const genreId = req.params.id;
  const deleteSelectedGenre = await db.deleteGenre(genreId);
  res.redirect("/games");
}

async function postDeletePlatform(req, res) {
  const platformId = req.params.id;
  const deleteSelectedPlatform = await db.deletePlatform(platformId);
  res.redirect("/games");
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
  getAddGenre,
  postAddGenre,
  getAddPlatform,
  postAddPlatform,
  postDeleteGenre,
  postDeletePlatform,
};
