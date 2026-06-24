const { Router } = require("express");
const gamesController = require("../controllers/gamesController");
const gamesRouter = Router();

gamesRouter.get("/", gamesController.getGames);
gamesRouter.get("/genres/:genreId", gamesController.getGamesByGenreList);
gamesRouter.get(
  "/platforms/:platformId",
  gamesController.getGamesByPlatformList,
);

module.exports = gamesRouter;
