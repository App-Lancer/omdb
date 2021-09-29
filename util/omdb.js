const axios = require("axios");

const apiKey = process.env.API_KEY;

const fieldsList = ["Plot", "Language", "imdbRating", "imdbVotes", "Runtime", "Genre"];

const url = "http://www.omdbapi.com?apikey=" + apiKey;

function getSearchResults(searchTerm, page, callback){

    let getListUrl = url + "&page=" + page + "&s=" + searchTerm;

    axios.get(getListUrl)
        .then(result => {
            var search = result.data.Search;
            var promises = [];
            for(let i=0; i< search.length; i++){
                var obj = search[i];
                var imdbId = obj.imdbID;
                var singleGet = url + "&i=" + imdbId;
                var getProm = axios.get(singleGet);
                promises.push(getProm);
            }

            var allPromises = new Promise.all(promises);

            allPromises.then(values => {
                console.log(values);
            })
        })
        .catch(error => {
            console.log("Err in fetching data "+ error);
        });
}


module.exports = {getSearchResults};

