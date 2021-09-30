Create database omdb;

Create table Comparison (id int, name varchar(250), PRIMARY KEY (id));

Create table Movie(comparison_id int, imdbID varchar(50), title varchar(250), year varchar(50), runtime varchar(50), genere varchar(50), plot varchar(500), language varchar(50), awards varchar(500), poster varchar(500), imdbRating varchar(100), type varchar(50), FOREIGN KEY (comparison_id) REFERENCES Comparison(id));