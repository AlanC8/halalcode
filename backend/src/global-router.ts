import { Router } from 'express';
import userRouter from './user/user-router';
// other routers can be imported here
const globalRouter = Router();

globalRouter.use(userRouter);
// app.use(authRoutes);
// app.use( protect, locationRoutes);
// app.use(protect, userRoutes);

export default globalRouter;
