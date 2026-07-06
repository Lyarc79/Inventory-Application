const platformsDb = require("../db/platformsQueries");
const { validationResult } = require("express-validator");

async function getAddPlatform(req, res) {
  const platforms = await platformsDb.getAllPlatforms();
  res.render("addPlatform", {
    platformsList: platforms,
  });
}

async function postAddPlatform(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const platforms = await platformsDb.getAllPlatforms();
    res.render("addPlatform", {
      platformList: platforms,
      errors: errors.array(),
    });
  } else {
    const newPlatform = await platformsDb.insertPlatform(req.body.platform);
    res.redirect("/games");
  }
}

async function postDeletePlatform(req, res) {
  const platformId = req.params.id;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const platforms = await platformsDb.getAllPlatforms();
    res.render("addPlatform", {
      platformsList: platforms,
      errors: errors.array(),
    });
  } else {
    const deleteSelectedPlatform = await platformsDb.deletePlatform(platformId);
    res.redirect("/games");
  }
}

module.exports = { getAddPlatform, postAddPlatform, postDeletePlatform };
