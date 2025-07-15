import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();


app.use(cors({
    origin : process.env.CORS_ORIGIN,
}))

app.use(express.json());

app.use(express.urlencoded({extended : true}));

app.use(express.static("public"));

app.use(cookieParser());





export{app};