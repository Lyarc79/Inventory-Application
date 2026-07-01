const { Router } = require("express");
const platformsController = require("../controllers/platformsController");
const {
  validatePlatform,
  validateAdminPassword,
} = require("../middleware/validators");

const platformsRouter = Router();

platformsRouter.get("/new", platformsController.getAddPlatform);
platformsRouter.post(
  "/new",
  validatePlatform,
  platformsController.postAddPlatform,
);
platformsRouter.post(
  "/:id/delete",
  validateAdminPassword,
  platformsController.postDeletePlatform,
);

module.exports = platformsRouter;
