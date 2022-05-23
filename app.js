import multer from "multer";
import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import ApiError from "./utils/ApiError.js";

// Routes
import studentRoutes from "./routes/student.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

/*
.
.
    Multer Storage
.
.
*/

const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

/*
.
.
    App Setup
.
.
*/

// enable cors
app.use(cors());
app.options("*", cors());

// parse json request body
app.use(express.json());

// body Parser to handle form data (text Only)
app.use(express.urlencoded({ extended: false }));

// setting up Multer for File Upload
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

// setting up Static Folders
app.use(express.static(path.join(__dirname, "public")));
/**
  the reason for doing this is because express assumes that the files in images folder are served as they were
  in the root folder. In our case we are looking in http://localhost:5000/images instead of http://localhost:5000/.
*/
app.use("/images", express.static(path.join(__dirname, "images")));

// send back a 404 error for any unknown api request

/*
.
.
    Routes
.
.
*/

app.use("/student", studentRoutes);

// unknown route
app.use((req, res, next) => {
  next(new ApiError(404, "Not found"));
});

export default app;
