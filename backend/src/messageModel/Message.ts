

import mongoose, { Document, Schema } from 'mongoose';


// Define the IMessage interface
interface IMessage extends Document {
  username: string;
  text: string;
  roomId: string;
  socketID: string;
  createdAt: Date;
  messageId: string;
}


// Define the IChat interface
interface IChat extends Document {
  roomId: string;
  messages: IMessage[];
}


// Define the MessageSchema
const MessageSchema: Schema = new Schema({
  username: { type: String, required: true },
  text: { type: String, required: true },
  roomId: { type: String, required: true },
  socketID: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  messageId: { type: String, required: true },
});


// Define the ChatSchema
const ChatSchema: Schema = new Schema({
  roomId: { type: String, required: true },
  messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
});


// Create the models
const Message = mongoose.model<IMessage>('Message', MessageSchema);
const Chat = mongoose.model<IChat>('Chat', ChatSchema);


export { Message, Chat, IMessage, IChat };
