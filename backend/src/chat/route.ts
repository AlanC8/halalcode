import { Router, Request, Response } from "express";
import { Chat, Message } from "../messageModel/Message";


const chatRouter = Router();


chatRouter.post("/create-chat", async (req: Request, res: Response) => {
  try {
    const { roomId } = req.body;
    const existingChat = await Chat.findOne({ roomId });


    if (existingChat) {
      return res.status(400).json({ error: "Chat already exists" });
    }


    const newChat = new Chat({ roomId, messages: [] });
    await newChat.save();


    res.status(201).json(newChat);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});


chatRouter.get("/messages/:roomId", async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;
    const messages = await Message.find({ roomId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});


export default chatRouter;



