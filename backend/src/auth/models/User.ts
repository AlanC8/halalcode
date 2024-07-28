import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId; // Добавление _id в интерфейс
    username: string;
    email: string;
    password: string;
    location: {
        type: string;
        coordinates: number[];
    };
}

const userSchema: Schema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    location: {
        type: { type: String, default: 'Point' },
        coordinates: { type: [Number], default: [0, 0] }
    }
});

userSchema.index({ location: '2dsphere' });

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;

