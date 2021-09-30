const express = require("express");
const axios = require("axios");
const bodyParser = require('body-parser');
require("dotenv").config();
const omdb = require("./util/omdb");
const db = require("./util/db");


const app = express();

app.use(bodyParser.json());

//To allow orign
app.use(function(req, res, next){
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST");

    next();
});

//To fetch data from OMDB server and send data to the client
app.get("/search/:searchTerm", (req, resp, next) => {

    var searchTerm = req.params.searchTerm;
    var page = req.query.page;

    omdb.getSearchResults(searchTerm, page == undefined ? 1 : page, function(results){
        resp.json(results);
    });
});

//To add a comparison data from client into database
app.post("/comparison", (req, res, next) => {
    try{
        console.log(req.body);
        db.addToDB(req.body, function(result){
            res.status(200).json(result);
        });
    }catch(err){
        res.status(400).json({"message" : "Internal Error"});
    }
});

//To fetech comparison list view from db and send to client
app.get("/comparison", (req, res, next) => {
    var page = req.query.page;
    db.getList(page == undefined ? 1 : page, function(result){
        res.status(200).json(result);
    });
});

//To fetch a single comparison and send the data to client
app.get("/comparison/:comparisonid", (req, res, next)=> {
    var id = req.params.comparisonid;
    db.get(id, function(result){
        res.status(200).json(result);
    });
});


//Server start
app.listen(8080, ()=> {
    console.log("Server is running!!!");
});