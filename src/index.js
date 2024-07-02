import dotenv from "dotenv";
import { app } from "./app.js";
import connectDatabase from "./db/connectDb.js";
dotenv.config({
  path: "../env",
});
connectDatabase()
  .then(
    app.listen(process.env.PORT || 3000, () => {
      console.log(`app is listininig on port ${process.env.PORT}`);
    })
  )
  .catch((err) => {
    console.log("connection failed");
  });
