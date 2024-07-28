import { Request, Response } from 'express';
import ImamService from './imam-service';

const imamService = new ImamService();

export const askImam = async (req: Request, res: Response) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  try {
    const response = await imamService.askQuestion(question);
    if (response) {
      res.status(200).json({ response });
    } else {
      res.status(500).json({ error: 'Error processing the request' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
