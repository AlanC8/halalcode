import { Request, Response } from "express";
import OpenAIService from "./openai-service";


class OpenAIController {
 private openAIService: OpenAIService;


 constructor(openAIService: OpenAIService) {
   this.openAIService = openAIService;
 }


 getInformation = async (req: Request, res: Response): Promise<void> => {
   try {
     const location = req.body.location;
     const response = await this.openAIService.generateInformation(location);
     res.json(response);
   } catch (error: any) {
     console.error("Error in /api/information:", error);
     res.status(400).json({ error: error.message });
   }
 };
 getInformation2 = async (req: Request, res: Response): Promise<void> => {
   try {
     const data = req.body;
     const response = await this.openAIService.generateInformation2(
       data.location,
       data.fromTime,
       data.toTime
     );
     res.json(response);
   } catch (error: any) {
     console.error("Error in /api/information:", error);
     res.status(400).json({ error: error.message });
   }
 };
}


export default OpenAIController;


