import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth.routes";
import { adminRouter } from "./routes/admin.routes";
const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000", 
  credentials: true,
}));
app.use(express.json());

app.use("/api", authRouter);
app.use("/api/admin", adminRouter);

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Healthcare API is running" });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
