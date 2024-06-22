import app from "./app";
import dotenv from "dotenv";
import userRouter from "./routes/userRoutes";

dotenv.config();

export const env = process.env;

process.env.TZ = 'Europe/Spain';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
