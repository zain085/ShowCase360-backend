const express = require("express");
const { connectDB } = require("./config/db");
const dotenv = require("dotenv").config();
const cors = require("cors");

// Import route files
const authRoutes = require("./routes/authRoutes");
const expoRoutes = require("./routes/expoRoutes");
const exhibitorRoutes = require("./routes/exhibitorRoutes");
const boothRoutes = require("./routes/boothRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const bookmarkRoutes = require("./routes/bookmarkRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const messageRouter = require("./routes/messageRoutes");
const analyticsRouter = require("./routes/analyticsRoutes");

// Global error handler middleware
const errorHandler = require("./middlewares/errorMiddleware");

const port = process.env.PORT || 5000;
const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173", 
    "https://showcase360.netlify.app/" 
  ],
  credentials: true
}));

// Middleware to parse JSON requests
app.use(express.json());

// Register route handlers
app.use("/auth", authRoutes);
app.use("/expos", expoRoutes);
app.use("/exhibitors", exhibitorRoutes);
app.use("/booths", boothRoutes);
app.use("/sessions", sessionRoutes);
app.use("/bookmarks", bookmarkRoutes);
app.use("/feedback", feedbackRoutes);
app.use("/message", messageRouter);
app.use("/analytics", analyticsRouter);

// Global error handler (should be after all routes)
app.use(errorHandler);

// Connect to the database and start the server
connectDB();
app.listen(port, () => {
  console.log(`Server is running at port: ${port}`);
});
