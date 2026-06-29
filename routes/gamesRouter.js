const { Router } = require("express");
const gamesController = require("../controllers/gamesController");
const gamesRouter = Router();

gamesRouter.get("/games", gamesController.getGames);
gamesRouter.get("/games/new", gamesController.getCreateGameForm);
gamesRouter.post("/games", gamesController.postCreateGameForm);

gamesRouter.get("/genres/new", gamesController.getAddGenre);
gamesRouter.post("/genres", gamesController.postAddGenre);
gamesRouter.get("/platforms/new", gamesController.getAddPlatform);
gamesRouter.post("/platforms", gamesController.postAddPlatform);
gamesRouter.get("/genres/:genreId", gamesController.getGamesByGenreList);
gamesRouter.get(
  "/platforms/:platformId",
  gamesController.getGamesByPlatformList,
);
gamesRouter.get("/games/:id", gamesController.getGameDetails);
gamesRouter.get("/games/:id/edit", gamesController.getEditGameForm);
gamesRouter.post("/games/:id/edit", gamesController.postEditGameForm);
gamesRouter.post("/games/:id/delete", gamesController.postDeleteGame);

module.exports = gamesRouter;
