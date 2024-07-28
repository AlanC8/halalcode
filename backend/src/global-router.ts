import { Router } from "express";
import userRouter from "./user/user-router";
import locationRouter from "./location/location-routes";
import openaiRouter from "./guide/openai-router";
import authRouter from "./auth/auth-router";
import chatRouter from "./chat/route";
// other routers can be imported here
const globalRouter = Router();
globalRouter.use("/auth/", authRouter);
globalRouter.use("/users/", userRouter);
globalRouter.use("/locations/", locationRouter);
globalRouter.use("/guide/", openaiRouter);

globalRouter.use(chatRouter);



export default globalRouter;


