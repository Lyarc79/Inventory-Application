const genresDb = require("../db/genresQueries");
const { validationResult } = require("express-validator");

async function getAddGenre(req, res) {
  const genres = await genresDb.getAllGenres();
  res.render("addGenre", {
    genresList: genres,
  });
}

async function postAddGenre(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const genres = await genresDb.getAllGenres();
    res.render("addGenre.ejs", {
      genresList: genres,
      errors: errors.array(),
    });
  } else {
    const newGenre = await genresDb.insertGenre(req.body.genre);
    res.redirect("/games");
  }
}

async function postDeleteGenre(req, res) {
  const genreId = req.params.id;
  const deleteSelectedGenre = await genresDb.deleteGenre(genreId);
  res.redirect("/games");
}

module.exports = {
  getAddGenre,
  postAddGenre,
  postDeleteGenre,
};
