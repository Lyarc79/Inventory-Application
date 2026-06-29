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

async function updateGameDetails(
  gameId,
  title,
  price,
  date,
  devName,
  pubName,
  coverImg,
  genreIds,
  platformIds,
) {
  await pool.query("BEGIN");
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
    `UPDATE games SET title = $1, price = $2, release_date = $3, developer_id = $4, publisher_id = $5, cover_image_url = $6 WHERE id = $7 RETURNING id`,
    [title, price, date, devId, pubId, coverImg, gameId],
  );
  const wipeGenres = await pool.query(
    `DELETE FROM game_genres WHERE game_id = $1`,
    [gameId],
  );
  const wipePlatforms = await pool.query(
    `DELETE FROM game_platforms WHERE game_id = $1`,
    [gameId],
  );
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
  await pool.query("COMMIT");
}

async function deleteGame(gameId) {
  await pool.query("BEGIN");
  const deleteGenres = await pool.query(
    `DELETE FROM game_genres WHERE game_id = $1`,
    [gameId],
  );
  const deletePlatforms = await pool.query(
    `DELETE FROM game_platforms WHERE game_id = $1`,
    [gameId],
  );
  const deleteGame = await pool.query(`DELETE FROM games WHERE id = $1`, [
    gameId,
  ]);
  await pool.query("COMMIT");
}

async function insertGenre(genre) {
  await pool.query(
    `INSERT INTO genres (name) VALUES ($1) ON CONFLICT do (name) DO NOTHING`,
    [genre],
  );
}

async function insertPlatform(platform) {
  await pool.query(
    `INSERT INTO platforms (name) VALUES ($1) ON CONFLICT do (name) DO NOTHING`,
    [platform],
  );
}

module.exports = {
  getAllGames,
  getGamesByGenre,
  getGamesByPlatform,
  getAllGenres,
  getAllPlatforms,
  insertGame,
  showGameDetails,
  updateGameDetails,
  deleteGame,
  insertGenre,
  insertPlatform,
};
