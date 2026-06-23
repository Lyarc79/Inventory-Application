const { loadEnvFile } = require("node:process");
loadEnvFile("./config/.env");
const { Client } = require("pg");

const SQL = `
    CREATE TABLE developers (
        id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        name TEXT NOT NULL UNIQUE
    );
    INSERT INTO developers (name) VALUES ('Team Cherry'), ('FromSoftware'), ('Capcom');

    CREATE TABLE publishers (
        id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        name TEXT NOT NULL UNIQUE
    );
    INSERT INTO publishers (name) VALUES ('Team Cherry'), ('Bandai Namco'), ('Capcom');

    CREATE TABLE genres (
        id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        name TEXT NOT NULL UNIQUE
    );
    INSERT INTO genres (name) VALUES ('Action'), ('Adventure'), ('RPG'), ('Horror'), ('Metroidvania');

    CREATE TABLE platforms (
        id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        name TEXT NOT NULL UNIQUE
    );
    INSERT INTO platforms (name) VALUES ('PC'), ('Nintendo Switch'), ('PS5'), ('PS4'), ('Xbox Series X/S');

    CREATE TABLE games (
        id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        title TEXT NOT NULL UNIQUE,
        price NUMERIC NOT NULL,
        release_date DATE NOT NULL,
        developer_id INT REFERENCES developers(id),
        publisher_id INT REFERENCES publishers(id),
        cover_image_url TEXT
    );
    INSERT INTO games (title, price, release_date, developer_id, publisher_id)
    VALUES ('Hollow Knight: Silksong', '19.99', '2025-09-04', (SELECT id FROM developers WHERE name = 'Team Cherry'), (SELECT id FROM publishers WHERE name = 'Team Cherry')),
            ('Dark Souls III', '59.99', '2016-04-12', (SELECT id FROM developers WHERE name = 'FromSoftware'), (SELECT id FROM publishers WHERE name = 'Bandai Namco')),
            ('Resident Evil 4 Remake', '39.99', '2023-03-23', (SELECT id FROM developers WHERE name = 'Capcom'), (SELECT id FROM publishers WHERE name = 'Capcom'));

    CREATE TABLE game_genres (
        game_id INT REFERENCES games(id) ON DELETE CASCADE,
        genre_id INT REFERENCES genres(id) ON DELETE CASCADE,
        PRIMARY KEY(game_id, genre_id)
    );
    INSERT INTO game_genres (game_id, genre_id) 
    VALUES ((SELECT id FROM games WHERE title = 'Hollow Knight: Silksong'), (SELECT id FROM genres WHERE name = 'Metroidvania')),
            ((SELECT id FROM games WHERE title = 'Dark Souls III'), (SELECT id FROM genres WHERE name = 'Action')),
            ((SELECT id FROM games WHERE title = 'Resident Evil 4 Remake'), (SELECT id FROM genres WHERE name = 'Horror'));

    CREATE TABLE game_platforms (
        game_id INT REFERENCES games(id) ON DELETE CASCADE,
        platform_id INT REFERENCES platforms(id) ON DELETE CASCADE,
        PRIMARY KEY(game_id, platform_id)
    );
    INSERT INTO game_platforms (game_id, platform_id) 
    VALUES ((SELECT id FROM games WHERE title = 'Hollow Knight: Silksong'), (SELECT id FROM platforms WHERE name = 'PC')),
            ((SELECT id FROM games WHERE title = 'Dark Souls III'), (SELECT id FROM platforms WHERE name = 'PS4')),
            ((SELECT id FROM games WHERE title = 'Resident Evil 4 Remake'), (SELECT id FROM platforms WHERE name = 'PS5'));
    
`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
