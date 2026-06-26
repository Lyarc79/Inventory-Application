const { Router } = require("express");
const gamesController = require("../controllers/gamesController");
const gamesRouter = Router();

gamesRouter.get("/", gamesController.getGames);
gamesRouter.get("/new", gamesController.getCreateGameForm);
gamesRouter.post("/new", gamesController.postCreateGameForm);
gamesRouter.get("/genres/:genreId", gamesController.getGamesByGenreList);
gamesRouter.get(
  "/platforms/:platformId",
  gamesController.getGamesByPlatformList,
);
gamesRouter.get("/games/:id", gamesController.getGameDetails);

module.exports = gamesRouter;
