const { Router } = require("express");
const platformsController = require("../controllers/platformsController");
const {
  validatePlatform,
  validateAdminPassword,
} = require("../middleware/validators");

const platformsRouter = Router();

platformsRouter.get("/", platformsController.getAddPlatform);
platformsRouter.post(
  "/",
  validatePlatform,
  platformsController.postAddPlatform,
);
platformsRouter.post(
  "/:id/delete",
  validateAdminPassword,
  platformsController.postDeletePlatform,
);

module.exports = platformsRouter;
