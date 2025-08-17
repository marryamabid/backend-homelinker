import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
const PORT = 3000;

const app = express();
dotenv.config();

import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import listingRoutes from "./routes/listing.routes.js";

const allowedOrigins = [
  "http://localhost:5173", // dev
  "https://home-linker-realestate.vercel.app", // deployed frontend
];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:", err);
  });

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/listing", listingRoutes);

app.get("/", (req, res) => {
  res.send({ message: "Hello from Express on Vercel!" });
});
app.use((err, req, res, next) => {
  console.error("Caught Error:", err);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({ message, success: false, statusCode });
});
export default app;
