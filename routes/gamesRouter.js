const { Router } = require("express");
const { body } = require("express-validator");
const gamesController = require("../controllers/gamesController");
const {
  validateGame,
  validateAdminPassword,
} = require("../middleware/validators");

const gamesRouter = Router();

gamesRouter.get("/games", gamesController.getGames);
gamesRouter.get("/games/new", gamesController.getCreateGameForm);
gamesRouter.post("/games", validateGame, gamesController.postCreateGameForm);

gamesRouter.get("/games/:id", gamesController.getGameDetails);
gamesRouter.get("/games/:id/edit", gamesController.getEditGameForm);
gamesRouter.post(
  "/games/:id/edit",
  validateGame,
  gamesController.postEditGameForm,
);
gamesRouter.post(
  "/games/:id/delete",
  validateAdminPassword,
  gamesController.postDeleteGame,
);

gamesRouter.get("/genres/:genreId", gamesController.getGamesByGenreList);
gamesRouter.get(
  "/platforms/:platformId",
  gamesController.getGamesByPlatformList,
);

module.exports = gamesRouter;
