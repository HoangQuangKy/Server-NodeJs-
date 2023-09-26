import express from "express";

const configViewEngine = (app) => {
    // app.use('/public', express.static('./src/public')); // setup cho cac file trong public hien len web
    app.set("view engine", "ejs");// set lay file .ejs
    app.set("views", "./src/views") // set lay cac file tu folder views

}

export default configViewEngine;