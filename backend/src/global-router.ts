import { Router } from "express";
import userRouter from "./user/user-router";
import locationRouter from "./location/location-router";
import openaiRouter from "./openai/openai-router";
import authRouter from "./auth/auth-router";
// other routers can be imported here
const globalRouter = Router();
globalRouter.use("/auth/", authRouter);
globalRouter.use("/users/", userRouter);
globalRouter.use("/locations/", locationRouter);
globalRouter.use("/openai/", openaiRouter);

export default globalRouter;
