require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
app.use(cors());
const url = process.env.MONGO_URL;
const path=require("path");


async function main() {
    try {
        await mongoose.connect(url);
        console.log("Connected successfully to MongoDB Atlas");
    } catch (err) {
        console.error("Connection error:", err.message);
        process.exit(1);
    }
}

main();

app.use(express.json()); // Middleware for parsing JSON requests
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const router = require("./routers/router.js");
const userRouter = require("./routers/users.router.js");

app.use("/api/courses", router);
app.use("/api/users", userRouter);

app.all("*", (req, res) => {
    res.status(404).json({ message: "Route not found" });
});

app.use((error, req, res, next) => {
    res.status(error.statusCode || 500).json({ status: error.statusCode, message: error.message,code:400 });
});

app.listen(process.env.MONGO_PORT || 2004, () => console.log("Server is running on port 3003"));
