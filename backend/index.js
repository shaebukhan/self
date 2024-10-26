const express = require("express");
const app = express();
const cors = require("cors");
const ConnectDB = require("./config/db");
const morgan = require("morgan");
const AuthRoutes = require("./routes/AuthRoute");
const bodyParser = require('body-parser');
const PostRoutes = require("./routes/textRoute");
const path = require("path");
//middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
//Database Connection 
ConnectDB();


//Routes
app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/post", PostRoutes);

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server is Running on http://localhost:${PORT}`);
});