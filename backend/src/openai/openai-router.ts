import express from "express";
import OpenAIController from "./openai-controller";
import OpenAIService from "./openai-service";
import { protect } from "../middlewares/auth-middlewares";

const router = express.Router();

// Create an instance of OpenAIService
const openAIService = new OpenAIService();

// Create an instance of OpenAIController with the service
const openAIController = new OpenAIController(openAIService);

// Define the route and use the controller's method
router.post("/information", openAIController.getInformation);

export default router;
