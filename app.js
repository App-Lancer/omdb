const express = require("express");
const axios = require("axios");
require("dotenv").config();
const omdb = require("./util/omdb");


const app = express();

app.get("/search/:searchTerm", (req, resp, next) => {

    var searchTerm = req.params.searchTerm;
    var page = req.query.page;

    omdb.getSearchResults(searchTerm, page == undefined ? 1 : page, function(results){

    });
})

app.listen(8080, ()=> {
    console.log("Server is running!!!");
});