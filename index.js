import express from "express";
import "dotenv/config";
import ejsMate from "ejs-mate";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 4000;

// setup ejs and ejs mate
app.set("view engine", "ejs");
app.set("views", "./views");
app.engine("ejs", ejsMate);

// Serve static files from the 'public' directory
app.use(express.static(join(__dirname, "public")));

// Add the middlewares
app.use(express.json());

// Import and connect databases
import connectDB from "./database/database.js";
connectDB();

// // Import routes and mount them
import router from "./routes/instagram.routes.js";
app.use("/", router);


app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
});
