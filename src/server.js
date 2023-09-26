import express from "express";
import cors from 'cors'
import initWebRouter from './routes/web.js'
import configViewEngine from "./configs/viewEngine.js";
import 'dotenv/config.js';
import pool from './configs/connectDB.js';
import bodyParser from 'body-parser';



const app = express()
const port = process.env.port || 8080

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

configViewEngine(app)
initWebRouter(app)


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})