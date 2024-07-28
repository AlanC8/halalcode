import { Router } from 'express';
import userRouter from './user/user-router';
// other routers can be imported here
const globalRouter = Router();

globalRouter.use(userRouter);


export default globalRouter;
