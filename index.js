const express = require("express");
const app = express();

const port = 5000;

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
var bodyParser = require("body-parser");

const userRoute = require("./routes/usersRoute");
const authRoute = require("./routes/authRoute");
const postRoute = require("./routes/postRoute");
const multer = require("multer");
const path = require("path");

dotenv.config();

// mongoose.connect(process.env.MONGO_URL, () => {
//   console.log("DATA CONNECTED");
// });

mongoose.connect("mongodb://localhost:27017/Social", () => {
  //   console.log("DATA CONNECTED");
});
// MIDDLEWARE
app.use("/images", express.static(path.join(__dirname, "public/images")));
// this is for our path to get some images from the back

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    console.log(req.body.name);
    // console.log(file.body.name);
    // cb(null, file.body.name);
    // cb(null, req.body.name);
    // cb(null, file.originalname); //to text for postman
    // cb(null, file.originalname);
    // cb(null, req.body.name);
    //////// console.log(file);
  },
});

const upload = multer({ storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploded successfully");
  } catch (error) {
    console.error(error);
  }
});

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/post", postRoute);

app.listen(5000, () => {
  console.log("Backend server is running!");
});
