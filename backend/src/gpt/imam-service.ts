import OpenAI from 'openai';
import dotenv from 'dotenv';
import { systemPrompt } from './prompt';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Определите ваш системный промпт здесь
// const systemPrompt = "You are a helpful assistant. Answer the questions to the best of your ability.";

class ImamService {
  async askQuestion(question: string) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: question,
          },
        ],
        temperature: 0.5,
      });

      if (response.choices && response.choices.length > 0) {
        const resContent = response.choices[0].message?.content;

        // Попытка распарсить JSON-ответ
        try {
          const parsedRes = JSON.parse(resContent || '{}');
          return parsedRes;
        } catch (e) {
          // Если не удалось распарсить JSON, возвращаем текст как есть
          return { text: resContent };
        }
      } else {
        return null;
      }
    } catch (error: any) {
      console.error('Error communicating with OpenAI:', error.message);
      return null;
    }
  }
}

export default ImamService;
