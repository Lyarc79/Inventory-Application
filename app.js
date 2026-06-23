const { loadEnvFile } = require("node:process");
try {
  process.loadEnvFile("./config/.env");
} catch (error) {}

const { express } = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at htpp://localhost:${PORT}`);
});
