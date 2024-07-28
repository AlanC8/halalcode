import { Request, Response } from 'express';
import Location from './models/Location';
import { AuthRequest } from '../middlewares/auth-middlewares';
import User from '../auth/models/User'; // Импортируем модель User

export const updateLocation = async (req: Request, res: Response): Promise<void> => {
    const { coordinates } = req.body;
    const userId = (req as AuthRequest).user?._id;

    if (!userId) {
        res.status(401).json({ message: 'Not authorized' });
        return;
    }

    try {
        const location = await Location.findOneAndUpdate(
            { user: userId },
            { coordinates },
            { new: true, upsert: true }
        );

        res.status(200).json(location);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getNearbyUsers = async (req: Request, res: Response): Promise<void> => {
    const { lng, lat } = req.query;

    try {
        const users = await User.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(lng as string), parseFloat(lat as string)]
                    },
                    $maxDistance: 10000 // 10km radius
                }
            }
        });

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};