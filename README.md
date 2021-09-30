Execute the following queried in mysql before starting the server.
1. `Create database omdb;`
2. `Create table Comparison (id int, name varchar(250), PRIMARY KEY (id));`
3. `Create table Movie(comparison_id int, imdbID varchar(50), title varchar(250), year varchar(50), runtime varchar(50), genere varchar(50), plot varchar(500), language varchar(50), awards varchar(500), poster varchar(500), imdbRating varchar(100), type varchar(50), FOREIGN KEY (comparison_id) REFERENCES Comparison(id));`

To start the server
1. run the command `npm install` to install the required packages
2. Goto /util/db.js file and update DB user name, DB user password  
3. To start the server run the command `npm start`