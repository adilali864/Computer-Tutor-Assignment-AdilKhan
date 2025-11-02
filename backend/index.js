import express from "express";
import "dotenv/config";
import { connectDB } from "./db/db.js";
import eventRoutes from "./route/event.route.js";
import bodyParser from "body-parser";

import cors from "cors";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api/event", eventRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server running at port: ", PORT);
  });
});
