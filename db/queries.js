const pool = require("./pool");

async function getAllGames() {
  const { rows } = await pool.query(
    `SELECT
        games.id,
        games.title,
        games.price,
        developers.name AS developer_name,
        publishers.name AS publisher_name,
        ARRAY_AGG(DISTINCT genres.name) AS genres,
        ARRAY_AGG(DISTINCT platforms.name) AS platforms
    FROM games 
    INNER JOIN developers ON games.developer_id = developers.id
    INNER JOIN publishers ON games.publisher_id = publishers.id
    INNER JOIN game_genres ON games.id = game_genres.game_id
    INNER JOIN genres ON game_genres.genre_id = genres.id
    INNER JOIN game_platforms ON games.id = game_platforms.game_id
    INNER JOIN platforms ON game_platforms.platform_id = platforms.id
    GROUP BY games.id, developers.name, publishers.name
    `,
  );
  return rows;
}

async function getGamesByGenre(genreId) {
  const { rows } = await pool.query(
    `SELECT
        games.id,
        games.title,
        games.price,
        developers.name AS developer_name,
        publishers.name AS publisher_name,
        ARRAY_AGG(DISTINCT genres.name) AS genres,
        ARRAY_AGG(DISTINCT platforms.name) AS platforms
    FROM games 
    INNER JOIN developers ON games.developer_id = developers.id
    INNER JOIN publishers ON games.publisher_id = publishers.id
    INNER JOIN game_genres ON games.id = game_genres.game_id
    INNER JOIN genres ON game_genres.genre_id = genres.id
    INNER JOIN game_platforms ON games.id = game_platforms.game_id
    INNER JOIN platforms ON game_platforms.platform_id = platforms.id
    WHERE genres.id = $1
    GROUP BY games.id, developers.name, publishers.name
    `,
    [genreId],
  );
  return rows;
}

async function getGamesByPlatform(platformId) {
  const { rows } = await pool.query(
    `SELECT
        games.id,
        games.title,
        games.price,
        developers.name AS developer_name,
        publishers.name AS publisher_name,
        ARRAY_AGG(DISTINCT genres.name) AS genres,
        ARRAY_AGG(DISTINCT platforms.name) AS platforms
    FROM games 
    INNER JOIN developers ON games.developer_id = developers.id
    INNER JOIN publishers ON games.publisher_id = publishers.id
    INNER JOIN game_genres ON games.id = game_genres.game_id
    INNER JOIN genres ON game_genres.genre_id = genres.id
    INNER JOIN game_platforms ON games.id = game_platforms.game_id
    INNER JOIN platforms ON game_platforms.platform_id = platforms.id
    WHERE platforms.id = $1
    GROUP BY games.id, developers.name, publishers.name
    `,
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

module.exports = {
  getAllGames,
  getGamesByGenre,
  getGamesByPlatform,
  getAllGenres,
  getAllPlatforms,
  insertGame,
};
