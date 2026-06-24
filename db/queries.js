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

module.exports = {
  getAllGames,
  getGamesByGenre,
  getGamesByPlatform,
  getAllGenres,
  getAllPlatforms,
};
