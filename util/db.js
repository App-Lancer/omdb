const mysql = require("mysql");

//fields list to store in DB
var fields = ["imdbID", "Title", "Year", "Runtime", "Genre", "Plot", "Language", "Awards", "Poster", "imdbRating", "Type"];

//Field map for DB to client
var tableToKeyMap = {
    imdbID : "imdbID",
    title : "Title",
    year : "Year",
    runtime : "Runtime",
    genere : "Genre",
    plot : "Plot",
    language : "Language",
    awards : "Awards",
    poster : "Poster",
    imdbRating : "imdbRating",
    type : "Type"
}

//connect to mysqlDB
function connectDB(callback){

    var connection = mysql.createConnection({
        host : "localhost",
        user : "root",
        password : "root",
        database : "omdb" 
    });

    connection.connect(function(err){
        if(err) throw err;

        callback(connection);
    })
}

// To add a movie comparison into the database
function addToDB(inputData, callback){
    connectDB(function(connection){
        getMaxId(connection, function(maxValue){
            var comparisonQuery = "Insert into Comparison (id, name) values ("+ maxValue +", \""+ inputData.name +"\");";
            connection.query(comparisonQuery, function(err, result){
                if(err) throw err;
                
                var values = [];
                var movies = inputData.movies;
                for(let index=0; index < movies.length; index++){
                    var movie = movies[index];
                    var value = [maxValue];

                    for(i in fields){
                        value.push(movie[fields[i]]);
                    }

                    values.push(value);
                }

                var movieQuery = "INSERT INTO Movie (comparison_id, imdbID, title, year, runtime, genere, plot, language, awards, poster, imdbRating, type) VALUES ?";

                connection.query(movieQuery, [values], function(err){
                    if(err) throw err;

                    callback({"message" : "Record added", "id" : maxValue});
                    connection.end();
                });
            });
        })
    });
}

//To fetch max id in comparison db to auto popupate the id for next movie comparison add
function getMaxId(connection, callback){
    connection.query("select max(id) as max from Comparison", function(err, result){
        if(err) throw err;

        var maxValue = result[0].max;
        if(maxValue == undefined || maxValue == null){
            maxValue = 0;
        } 
        callback(maxValue+1)

    });
}

//To fetch movie comparison getList from DB
function getList(page, callback){
    var records = (page - 1) * 100;
    connectDB(function(connection){
        var query = "Select * from Comparison LIMIT "+ records +", 100";

        connection.query(query, function(err,result){
            if(err) throw err;
        
            var results = [];
            for(index in result){
                var obj = {};
                obj["id"] = result[index]["id"];
                obj["name"] = result[index]["name"];
                results.push(obj);
            }
            callback(results);
            connection.end();
        });
    });
}

//To fetch a single movie comparison record from the DB
function get(id, callback){

    connectDB(function(connection){
        var comparisonQuery = "Select * from Comparison where id=" + id;

        connection.query(comparisonQuery, function(err, result){
            if(err) throw err;

            if(result.length == 0){
                callback({"message": "no such record found"});
            }else{
                var resResult = {
                    "id" : result[0].id,
                    "name" : result[0].name
                };

                var movieQuery = "Select * from Movie where comparison_id=" + id;
                connection.query(movieQuery, function(err, result){
                    if(err) throw err;
                    
                    var movies = [];
                    for(index in result){
                        var row = result[index];
                        var movie = {};
                        for(key in tableToKeyMap){
                            movie[tableToKeyMap[key]] = row[key];
                        }
                        movies.push(movie);
                    }

                    resResult["movies"] = movies;

                    callback(resResult);
                });
            }
        });
    });

}


module.exports = {addToDB, getList, get};