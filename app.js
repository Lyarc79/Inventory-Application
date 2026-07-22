const { loadEnvFile } = require("node:process");
try {
  process.loadEnvFile("./config/.env");
} catch (error) {}

const express = require("express");
const app = express();
const path = require("node:path");
const gamesRouter = require("./routes/gamesRouter");
const genresRouter = require("./routes/genresRouter");
const platformsRouter = require("./routes/platformsRouter");

app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  res.locals.currentQuery = req.query;
  next();
});

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/genres", genresRouter);
app.use("/platforms", platformsRouter);
app.use("/", gamesRouter);
app.get("/", (req, res) => res.redirect("/games"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
