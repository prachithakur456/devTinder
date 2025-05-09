const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const connectDB = require('./config/database');

const app = express();

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json()); // express middleware to process json request
app.use(cookieParser());

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);

connectDB()
.then(() => {
    console.log("DB connected successfullly");
    app.listen('5000', () => {
        console.log("Hello from server")
    });
})
.catch((err) => console.log(err, "Error")); 

