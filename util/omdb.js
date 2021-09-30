const axios = require("axios");

const apiKey = process.env.API_KEY;

const fieldsList = ["Plot", "Language", "imdbRating", "imdbVotes", "Runtime", "Genre"];

const url = "http://www.omdbapi.com?apikey=" + apiKey;

function getSearchResults(searchTerm, page, callback){

    let getListUrl = url + "&page=" + page + "&s=" + searchTerm;

    console.log(page);
    console.log(searchTerm);
    axios.get(getListUrl)
        .then(result => {
            console.log(result.data);
            if(result.data.Response == "True"){
                var search = result.data.Search;
                var promises = [];
                for(let i=0; i< search.length; i++){
                    var obj = search[i];
                    var imdbId = obj.imdbID;
                    var singleGet = url + "&i=" + imdbId;
                    var getProm = axios.get(singleGet);
                    promises.push(getProm);
                }
                Promise.all(promises).then(values => {
                    var responseData = [];

                    for(index in values){
                        responseData.push(values[index].data);
                    }

                 callback(responseData);
                })
                .catch(error => {
                    console.log(error);
                    callback({"Error" : "Internal Error"});
                });
            }else{
                callback({"Error" : "Movie not found!"});
            }   
        })
        .catch(error => {
            console.log("Err in fetching data "+ error);
            callback({"Error" : "Internal Error"});
        });
}


module.exports = {getSearchResults};

