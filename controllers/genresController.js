const getPageData = require("../helpers/getPageData");
const { validationResult } = require("express-validator");

async function getAddGenre(req, res) {
  const pageData = await getPageData();
  res.render("genres", {
    ...pageData,
  });
}

async function postAddGenre(req, res) {
  const pageData = await getPageData();
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render("genres", {
      ...pageData,
      errors: errors.array(),
    });
  } else {
    const newGenre = await genresDb.insertGenre(req.body.genre);
    res.redirect("/games");
  }
}

async function postDeleteGenre(req, res) {
  const pageData = await getPageData();
  const genreId = req.params.id;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render("genres", {
      ...pageData,
      errors: errors.array(),
    });
  } else {
    const deleteSelectedGenre = await genresDb.deleteGenre(genreId);
    res.redirect("/games");
  }
}

module.exports = {
  getAddGenre,
  postAddGenre,
  postDeleteGenre,
};
