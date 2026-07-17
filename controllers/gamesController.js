const gamesDb = require("../db/gamesQueries");
const getPageData = require("../helpers/getPageData");
const { validationResult } = require("express-validator");

async function getGames(req, res, next) {
  const pageData = await getPageData();
  const selectedGenreId = req.query.genre;
  const selectedPlatformId = req.query.platform;
  let games;

  if (selectedGenreId) {
    games = await gamesDb.getGamesByGenre(selectedGenreId);
  } else if (selectedPlatformId) {
    games = await gamesDb.getGamesByPlatform(selectedPlatformId);
  } else {
    games = await gamesDb.getAllGames();
  }

  res.render("index", {
    gamesList: games,
    ...pageData,
    selectedGenreId: selectedGenreId || null,
    selectedPlatformId: selectedPlatformId || null,
  });
}

async function getCreateGameForm(req, res) {
  const pageData = await getPageData();
  res.render("addGame", {
    ...pageData,
    game: { genres: [], platforms: [] },
  });
}

async function postCreateGameForm(req, res) {
  const pageData = await getPageData();
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render("addGame", {
      ...pageData,
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
    await gamesDb.insertGame(
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
  const game = await gamesDb.showGameDetails(gameId);
  res.render("gameDetails", {
    game: game,
  });
}

async function getEditGameForm(req, res) {
  const gameId = req.params.id;
  const [game, pageData] = await Promise.all([
    gamesDb.showGameDetails(gameId),
    getPageData(),
  ]);
  res.render("editGame", {
    game: game,
    ...pageData,
  });
}

async function postEditGameForm(req, res) {
  const gameId = req.params.id;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const [game, pageData] = await Promise.all([
      gamesDb.showGameDetails(gameId),
      getPageData(),
    ]);
    const blendedGameData = { ...game, ...req.body };
    res.render("editGame", {
      game: blendedGameData,
      ...pageData,
      errors: errors.array(),
    });
  } else {
    const {
      title,
      price,
      release_date,
      developer_name,
      publisher_name,
      cover_image_url,
      genres,
      platforms,
    } = req.body;
    await gamesDb.updateGameDetails(
      gameId,
      title,
      price,
      release_date,
      developer_name,
      publisher_name,
      cover_image_url,
      genres,
      platforms,
    );
    res.redirect(`/games/${gameId}`);
  }
}

async function postDeleteGame(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const game = await gamesDb.showGameDetails(req.params.id);
    return res.render("gameDetails", {
      game: game,
      validationErrors: errors.mapped(),
      errors: errors.array(),
    });
  }
  await gamesDb.deleteGame(req.params.id);
  res.redirect("/games");
}

module.exports = {
  getGames,
  getCreateGameForm,
  postCreateGameForm,
  getGameDetails,
  getEditGameForm,
  postEditGameForm,
  postDeleteGame,
};
