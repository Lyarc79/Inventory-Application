const { Router } = require("express");
const genresController = require("../controllers/genresController");
const {
  validateGenre,
  validateAdminPassword,
} = require("../middleware/validators");

const genresRouter = Router();

genresRouter.get("/", genresController.getAddGenre);
genresRouter.post("/", validateGenre, genresController.postAddGenre);
genresRouter.post(
  "/:id/delete",
  validateAdminPassword,
  genresController.postDeleteGenre,
);

module.exports = genresRouter;
