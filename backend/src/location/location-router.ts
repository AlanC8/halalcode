import express from "express";
import { updateLocation, getNearbyUsers } from "./location-controller";
import { protect } from "../middlewares/auth-middlewares";
const router = express.Router();

router.post(
  "/update",
  protect as unknown as express.RequestHandler,
  updateLocation
);
router.get(
  "/nearby",
  protect as unknown as express.RequestHandler,
  getNearbyUsers
);

export default router;
