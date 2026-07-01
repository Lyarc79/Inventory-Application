const { Router } = require("express");
const genresController = require("../controllers/genresController");
const {
  validateGenre,
  validateAdminPassword,
} = require("../middleware/validators");

const genresRouter = Router();

genresRouter.get("/new", genresController.getAddGenre);
genresRouter.post("/new", validateGenre, genresController.postAddGenre);
genresRouter.post(
  "/:id/delete",
  validateAdminPassword,
  genresController.postDeleteGenre,
);

module.exports = genresRouter;
