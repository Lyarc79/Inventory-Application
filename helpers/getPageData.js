const genresDb = require("../db/genresQueries");
const platformsDb = require("../db/platformsQueries");

async function getPageData() {
  const [genres, platforms] = await Promise.all([
    genresDb.getAllGenres(),
    platformsDb.getAllPlatforms(),
  ]);
  return { genresList: genres, platformsList: platforms };
}

module.exports = getPageData;
