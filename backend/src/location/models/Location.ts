import mongoose, { Document, Schema } from 'mongoose';

export interface ILocation extends Document {
    user: mongoose.Schema.Types.ObjectId;
    coordinates: number[];
    timestamp: Date;
}

const locationSchema: Schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    coordinates: {
        type: [Number],
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

locationSchema.index({ coordinates: '2dsphere' });

const Location = mongoose.model<ILocation>('Location', locationSchema);

export default Location;
