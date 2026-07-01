const pool = require("./pool");

async function getAllGenres() {
  const { rows } = await pool.query(`SELECT * FROM genres ORDER BY name`);
  return rows;
}

async function insertGenre(genre) {
  await pool.query(
    `INSERT INTO genres (name) VALUES ($1) ON CONFLICT (name) DO NOTHING`,
    [genre],
  );
}

async function deleteGenre(genreId) {
  await pool.query(`DELETE FROM genres WHERE id = $1`, [genreId]);
}

module.exports = {
  getAllGenres,
  insertGenre,
  deleteGenre,
};
