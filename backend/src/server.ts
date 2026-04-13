import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth.routes";

const app = express();

app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true,
}));
app.use(express.json());

app.use("/api", authRouter);

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Healthcare API is running" });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
