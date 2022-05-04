const express = require("express");
const app = express();
const port = 5000;

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");

const userRoute = require("./routes/usersRoute");
const authRoute = require("./routes/authRoute");
const postRoute = require("./routes/postRoute");

dotenv.config();

// mongoose.connect(process.env.MONGO_URL, () => {
//   console.log("DATA CONNECTED");
// });

mongoose.connect("mongodb://localhost:27017/Social", () => {
  //   console.log("DATA CONNECTED");
});
// MIDDLEWARE
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/post", postRoute);

app.listen(5000, () => {
  console.log("Backend server is running!");
});
