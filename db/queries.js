const pool = require("./pool");

async function getAllGames() {
  const { rows } = await pool.query(`SELECT * FROM game_detailed_view;`);
  return rows;
}

async function getGamesByGenre(genreId) {
  const { rows } = await pool.query(
    `SELECT * FROM game_detailed_view WHERE id IN (SELECT game_id FROM game_genres WHERE genre_id = $1)`,
    [genreId],
  );
  return rows;
}

async function getGamesByPlatform(platformId) {
  const { rows } = await pool.query(
    `SELECT * FROM game_detailed_view WHERE id IN (SELECT game_id FROM game_platforms WHERE platform_id = $1);`,
    [platformId],
  );
  return rows;
}

async function getAllGenres() {
  const { rows } = await pool.query(`SELECT * FROM genres ORDER BY name`);
  return rows;
}

async function getAllPlatforms() {
  const { rows } = await pool.query(`SELECT * FROM platforms ORDER BY name`);
  return rows;
}

async function insertGame(
  title,
  price,
  date,
  devName,
  pubName,
  coverImg,
  genreIds,
  platformIds,
) {
  const devResult = await pool.query(
    `INSERT INTO developers (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id`,
    [devName],
  );
  const devId = devResult.rows[0].id;
  const pubResult = await pool.query(
    `INSERT INTO publishers (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id`,
    [pubName],
  );
  const pubId = pubResult.rows[0].id;
  const gameResult = await pool.query(
    `INSERT INTO games (title, price, release_date, developer_id, publisher_id, cover_image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
    [title, price, date, devId, pubId, coverImg],
  );
  const gameId = gameResult.rows[0].id;
  for (const genreId of genreIds) {
    await pool.query(
      `INSERT INTO game_genres (game_id, genre_id) VALUES($1, $2)`,
      [gameId, genreId],
    );
  }
  for (const platformId of platformIds) {
    await pool.query(
      `INSERT INTO game_platforms (game_id, platform_id) VALUES($1, $2)`,
      [gameId, platformId],
    );
  }
}

async function showGameDetails(gameId) {
  const { rows } = await pool.query(
    `SELECT * FROM game_detailed_view WHERE id = $1;`,
    [gameId],
  );
  return rows[0];
}

module.exports = {
  getAllGames,
  getGamesByGenre,
  getGamesByPlatform,
  getAllGenres,
  getAllPlatforms,
  insertGame,
  showGameDetails,
};
