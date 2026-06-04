import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import taskRoutes from "./routes/taskRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://cloud-native-task-manager-platform-9bht-23b7m00mf.vercel.app",
  "https://cloud-native-task-manager-platform.vercel.app"
];

app.use(helmet());

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  })
);

app.use(express.json());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.get("/", (req, res) => {
  res.json({ message: "Cloud-Native Task Manager API" });
});

app.use("/api/health", healthRoutes);
app.use("/api/tasks", taskRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;