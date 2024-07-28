import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://anuza2005:918273645@chatapp.kf0vpvd.mongodb.net/');
        console.log('MongoDB connected...');
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

export default connectDB;