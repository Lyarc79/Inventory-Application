const { body } = require("express-validator");

const validateGame = [
  body("title")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Game name must be between 1 and 50 characters."),

  body("developer_name")
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage("Developer name must be between 1 and 30 characters."),

  body("publisher_name")
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage("Publisher name must be between 1 and 30 characters."),

  body("release_date")
    .trim()
    .isDate()
    .withMessage("Please enter a valid date."),

  body("price")
    .trim()
    .isFloat({ min: 0, maxDecimalPlaces: 2 })
    .withMessage("Price has to be a valid numeric number."),

  body("cover_image_url")
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage("Please enter a valid image URL."),

  body("genres").toArray(),
  body("genres.*").isInt().withMessage("Invalid genre selected."),

  body("platforms").toArray(),
  body("platforms.*").isInt().withMessage("Invalid platform selected."),
];

const validateGenre = [
  body("genre")
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage("Genre name must be between 1 and 30 characters.")
    .escape(),
];

const validatePlatform = [
  body("platform")
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage("Platform name must be between 1 and 30 characters.")
    .escape(),
];

const validateAdminPassword = [
  body("adminPassword").custom((value) => {
    if (value !== process.env.ADMIN_PASSWORD) {
      throw new Error("Incorrect admin password. Action denied.");
    }
    return true;
  }),
];

module.exports = {
  validateGame,
  validateGenre,
  validatePlatform,
  validateAdminPassword,
};
