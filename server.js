const express = require("express");
const { config } = require("dotenv");
const { connectDB, disconnectDB } = require("./config/db.js");
const requestLogger = require("./middlewares/requestLogger.js");
const { logger } = require("./config/logger.js");
const app = express();

// connecting to the Database 
config();
connectDB();

// Middlewares 
app.use(requestLogger); 
app.use(express.json());
app.use(express.urlencoded({extended: true}));


// Routes //
const auth = require("./routes/auth.js");
app.use("/api/auth", auth.router);

const users = require("./routes/userRoute.js");
app.use("/api/users", users.router);  


app.get("/api", (req, res) => {
    res.json({ message: "Hello World" });
});

const PORT = process.env.PORT || 3000
const server = app.listen(PORT, () => {
    console.log(`Сервер работает на ПОРТЕ ${PORT}`);
});

 
// handle unhandled promise rejections (e.g database connection errors)
process.on('unhandledRejection', function(err) {
    console.log("We hve got an Unhandled Rejection");
    logger.error('Unhandled Rejection:', err);
    // server.close(async() => {
    //     await disconnectDB();
    //     process.exit(1);
    // });
});


// handle uncaught exceptions 
process.on('uncaughtException', async function(err) {
    console.log("We hve got an Unhandled Exception");
    logger.error('Uncaught Exception:', err);
    // await disconnectDB();
    process.exit(1);
});

// Graceful shutdown 
process.on("SIGTERM", async() => {
    console.log("SIGTERM received, shutting down gracefully");
    server.close(async () => {
        await disconnectDB();
        process.exit(0);
    });
});
