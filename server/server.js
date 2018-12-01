const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path    = require("path");


process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const port = process.env.PORT || 3001;
// // support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
console.log('sss',path.join(__dirname, '/../build'));
app.use(express.static(path.join(__dirname, '/../build'))); 

const request = require("request");
const url = "https://yts.am/api/v2/list_movies.json?limit=5"; 
let lastMovie = 'none';

function getYts() {
    request.get(url, (error, response, body) => {
        let jsonObj = JSON.parse(body);
        console.log('lastMovies',lastMovie, jsonObj.data.movies[0].title);
        if(lastMovie!=jsonObj.data.movies[0].title){
            lastMovie = jsonObj.data.movies[0].title;
            io.emit('newmovies',  {latestMovies:jsonObj.data.movies})
        }
    }); 
    
}

setTimeout(getYts, 1550);
setInterval(getYts, 360000);

app.get('/', function (req, res) {    
    const htmlPath = path.join(__dirname+'/build/index.html')
    res.sendFile(htmlPath);
})


const server = app.listen(port,()=>{
    console.log('start server',port);
})

const io = require('socket.io').listen(server);
//Establishes socket connection.
io.on("connection", socket => {
    socket.on("connection", () => console.log("Client connected"));
    socket.on("disconnect", () => console.log("Client disconnected"));
});