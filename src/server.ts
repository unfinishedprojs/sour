import dotenv from "dotenv";

dotenv.config();

export const env = process.env;

import app from "./app";

process.env.TZ = 'Europe/Spain';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
