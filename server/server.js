const express = require('express');
const bodyParser = require('body-parser');
const app = express();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const port = 3001;
// // support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

const request = require("request");
const url = "https://yts.am/api/v2/list_movies.json?limit=5"; 
let lastMovie = 'none';

function getYts() {
    request.get(url, (error, response, body) => {
        let jsonObj = JSON.parse(body);
        console.log('lastMovies',lastMovie, jsonObj.data.movies[0].title);
        if(lastMovie!=jsonObj.data.movies[0].title){
            lastMovie = jsonObj.data.movies[0].title;
            io.emit('newmovies',  {latestMovies:jsonObj.data.movies[0]})
        }
    }); 
    
}

setTimeout(getYts, 1550);
setInterval(getYts, 360000);

app.get('/call', function (req, res) {
  res.json(latestMovie);
  getYts()
})


const server = app.listen(port)

const io = require('socket.io').listen(server);
//Establishes socket connection.
io.on("connection", socket => {
    socket.on("connection", () => console.log("Client connected"));
    socket.on("disconnect", () => console.log("Client disconnected"));
});