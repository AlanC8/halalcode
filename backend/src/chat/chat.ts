import { Chat, IMessage, Message } from '../messageModel/Message';
import connectDB from '../db';


connectDB();


async function addMessageToChat(roomId: string, messageData: Partial<IMessage>) {
    try {
        const message = new Message(messageData) as IMessage;
        await message.save();
    
    
        let chat = await Chat.findOne({ roomId });
        if (!chat) {
          chat = new Chat({ roomId, messages: [message._id as typeof message._id] });
        } else {
          chat.messages.push(message.id);
        }
    
    
        await chat.save();
        console.log('Message added to chat');
      } catch (error) {
        console.error('Error adding message to chat:', error);
      }
    }
    
    
    export default addMessageToChat;
    