import express from "express";
import OpenAIController from "./openai-controller";
import OpenAIService from "./openai-service";
// import { protect } from "../middlewares/auth-middlewares";

const router = express.Router();
const openAIService = new OpenAIService();
const openAIController = new OpenAIController(openAIService);

router.post("/information", openAIController.getInformation);
router.post("/information2", openAIController.getInformation2);

export default router;
