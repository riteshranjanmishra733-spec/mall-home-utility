import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import healthRouter from "./routes/health.js";
import authRouter from "./routes/auth.js";
import categoriesRouter from "./routes/categories.js";
import servicesRouter from "./routes/services.js";
import providersRouter from "./routes/providers.js";
import bookingsRouter from "./routes/bookings.js";
import providerBookingsRouter from "./routes/providerBookings.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());

app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/services", servicesRouter);
app.use("/api/providers", providersRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/provider/bookings", providerBookingsRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
