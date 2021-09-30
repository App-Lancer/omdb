const axios = require("axios");

const apiKey = process.env.API_KEY;

const fieldsList = ["Plot", "Language", "imdbRating", "imdbVotes", "Runtime", "Genre"];

const url = "http://www.omdbapi.com?apikey=" + apiKey;

//To search for the search term in OMDB and get list data
function getSearchResults(searchTerm, page, callback){

    let getListUrl = url + "&page=" + page + "&s=" + searchTerm;

    axios.get(getListUrl)
        .then(result => {
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

                console.log("Promise started");
                //To fetch individual fetch of the components
                Promise.all(promises).then(values => {
                    var responseData = [];

                    for(index in values){
                        responseData.push(values[index].data);
                    }

                    console.log("Promise completed")

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

