import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectToDB } from "./db.js";

const app = express();

connectToDB();

// app.use(cors({
//     origin: "http://localhost:5174",
//     credentials: true
// }))
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());


app.get('/', (req, res)=>{
    res.send("Hello")
})

export {app}