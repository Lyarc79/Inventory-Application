const { Router } = require("express");
const { body } = require("express-validator");
const gamesController = require("../controllers/gamesController");
const gamesRouter = Router();

const validateGenre = [
  body("genre")
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage("Genre name must be between 1 and 30 characters.")
    .escape(),
];

const validatePlatform = [
  body("platform")
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage("Platform name must be between 1 and 30 characters.")
    .escape(),
];

const validateGame = [
  body("title")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Game name must be between 1 and 50 characters.")
    .escape(),

  body("developer_name")
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage("Developer name must be between 1 and 30 characters.")
    .escape(),

  body("publisher_name")
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage("Publisher name must be between 1 and 30 characters.")
    .escape(),

  body("release_date")
    .trim()
    .isDate()
    .withMessage("Please enter a valid date."),

  body("price")
    .trim()
    .isFloat({ min: 0, maxDecimalPlaces: 2 })
    .withMessage("Price has to be a valid numeric number.")
    .escape(),

  body("cover_image_url")
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage("Please enter a valid image URL."),

  body("genres").toArray(),
  body("genres.*").isInt().withMessage("Invalid genre selected."),

  body("platforms").toArray(),
  body("platforms.*").isInt().withMessage("Invalid platform selected."),
];

gamesRouter.get("/games", gamesController.getGames);
gamesRouter.get("/games/new", gamesController.getCreateGameForm);
gamesRouter.post("/games", validateGame, gamesController.postCreateGameForm);

gamesRouter.get("/genres/new", gamesController.getAddGenre);
gamesRouter.post("/genres", validateGenre, gamesController.postAddGenre);
gamesRouter.get("/platforms/new", gamesController.getAddPlatform);
gamesRouter.post(
  "/platforms",
  validatePlatform,
  gamesController.postAddPlatform,
);
gamesRouter.get("/genres/:genreId", gamesController.getGamesByGenreList);
gamesRouter.get(
  "/platforms/:platformId",
  gamesController.getGamesByPlatformList,
);

gamesRouter.get("/games/:id", gamesController.getGameDetails);
gamesRouter.get("/games/:id/edit", gamesController.getEditGameForm);
gamesRouter.post(
  "/games/:id/edit",
  validateGame,
  gamesController.postEditGameForm,
);
gamesRouter.post("/games/:id/delete", gamesController.postDeleteGame);
gamesRouter.post("/genres/:id/delete", gamesController.postDeleteGenre);
gamesRouter.post("/platforms/:id/delete", gamesController.postDeletePlatform);

module.exports = gamesRouter;
