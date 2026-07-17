const getPageData = require("../helpers/getPageData");
const { validationResult } = require("express-validator");

async function getAddPlatform(req, res) {
  const pageData = await getPageData();
  res.render("platforms", {
    ...pageData,
  });
}

async function postAddPlatform(req, res) {
  const pageData = await getPageData();
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render("platforms", {
      ...pageData,
      errors: errors.array(),
    });
  } else {
    const newPlatform = await platformsDb.insertPlatform(req.body.platform);
    res.redirect("/games");
  }
}

async function postDeletePlatform(req, res) {
  const pageData = await getPageData();
  const platformId = req.params.id;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render("platforms", {
      ...pageData,
      errors: errors.array(),
    });
  } else {
    const deleteSelectedPlatform = await platformsDb.deletePlatform(platformId);
    res.redirect("/games");
  }
}

module.exports = { getAddPlatform, postAddPlatform, postDeletePlatform };
