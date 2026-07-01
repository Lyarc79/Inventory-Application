const pool = require("./pool");

async function getAllPlatforms() {
  const { rows } = await pool.query(`SELECT * FROM platforms ORDER BY name`);
  return rows;
}

async function insertPlatform(platform) {
  await pool.query(
    `INSERT INTO platforms (name) VALUES ($1) ON CONFLICT (name) DO NOTHING`,
    [platform],
  );
}

async function deletePlatform(platformId) {
  await pool.query(`DELETE FROM platforms WHERE id = $1`, [platformId]);
}

module.exports = { getAllPlatforms, insertPlatform, deletePlatform };
