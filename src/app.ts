import express, { Application } from 'express';
import handle from "./errors/handler";
import userRouter from './routes/userRoutes';
import proxyRouter from './routes/proxyRoutes';
import pollsRouter from './routes/pollRoutes';
import { verifyToken } from "./middleware/authentication";

const app: Application = express();

app.use(express.json());

app.use("/users", userRouter);

app.use("/", pollsRouter);

app.use("/proxy", proxyRouter);

app.use(handle);

export default app;