import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    email: string;
    password: string;
    location: {
        type: string;
        coordinates: number[];
    };
    languages: string[];
    age: number; // Добавлено поле для возраста
    country: string; // Добавлено поле для страны
}

const userSchema: Schema = new mongoose.Schema({
   
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
    },
    languages: {
        type: [String],
        default: []
    },
    age: {
        type: Number,
        required: true
    },
    country: {
        type: String,
        required: true
    }
});

userSchema.index({ location: '2dsphere' });

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;


