import express, { Application } from 'express';
import handle from "./errors/handler";
import userRouter from './routes/userRoutes';

const app: Application = express();

app.use(express.json());

app.use("/users", userRouter);

app.use(handle);

export default app;