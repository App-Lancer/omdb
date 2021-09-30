const express = require("express");
const axios = require("axios");
const bodyParser = require('body-parser');
require("dotenv").config();
const omdb = require("./util/omdb");
const db = require("./util/db");


const app = express();

app.use(bodyParser.json());

app.get("/search/:searchTerm", (req, resp, next) => {

    var searchTerm = req.params.searchTerm;
    var page = req.query.page;

    omdb.getSearchResults(searchTerm, page == undefined ? 1 : page, function(results){
        resp.json(results);
    });
});

app.post("/comparison", (req, res, next) => {
    try{
        db.addToDB(req.body, function(result){
            res.status(200).json(result);
        });
    }catch(err){

    }
});

app.get("/comparison", (req, res, next) => {
    var page = req.query.page;
    db.getList(page == undefined ? 1 : page, function(result){
        res.status(200).json(result);
    });
});

app.get("/comparison/:comparisonid", (req, res, next)=> {
    var id = req.params.comparisonid;

    console.log(id);
    db.get(id, function(result){
        res.status(404).json(result);
    });
});

app.listen(8080, ()=> {
    console.log("Server is running!!!");
});