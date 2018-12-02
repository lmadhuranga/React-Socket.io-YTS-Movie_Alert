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
app.use(express.static(path.join(__dirname, '/../build'))); 
const request = require("request");
const url = "https://yts.am/api/v2/list_movies.json?limit=20&sort_by=id&order_by=desc"; 
let lastMovie = 'none';
let latestMoviesObj = []
let liveCount = 0;

function getYts() {
    request.get(url, (error, response, body) => {
        let jsonObj = JSON.parse(body);
        console.log('lastMovies',lastMovie, jsonObj.data.movies[0].title);
        if(lastMovie!=jsonObj.data.movies[0].title){
            latestMoviesObj = jsonObj.data.movies;
            lastMovie = jsonObj.data.movies[0].title;
            io.emit('newmovies',  {latestMovies:jsonObj.data.movies});
            updateLiveCount();
        }
    }); 
    
}

setInterval(getYts, 360000);

app.get('/', function (req, res) {    
    const htmlPath = path.join(__dirname+'/build/index.html')
    res.sendFile(htmlPath);
})

app.get('/live',(req, res)=>{
    console.info('liveCount',liveCount);
    res.json({liveCount:liveCount});
})

app.get('/test', function (req, res) {
    let newList = latestMoviesObj.map((movie)=>{
        return {
            id:movie.id, 
            title:movie.title
        }
    });
    io.emit('newmovies',  { latestMovies:latestMoviesObj })
    res.json({latestMovies:newList});
    updateLiveCount();
})


const server = app.listen(port,()=>{
    console.log('start server',port);
})

function updateLiveCount(){
    io.emit('liveCount',  { liveCount:liveCount })
}

function joinedNewMember(userId){
    liveCount++;
    updateLiveCount();
    if (lastMovie=='none') {
        request.get(url, (error, response, body) => {
            let jsonObj = JSON.parse(body); 
            latestMoviesObj = jsonObj.data.movies;
            lastMovie = jsonObj.data.movies[0].title;
            io.emit(`init-${userId}`,  {latestMovies:jsonObj.data.movies})
        }); 
    } else {
        io.emit(`init-${userId}`,  {latestMovies:latestMoviesObj})
    }
}

const io = require('socket.io').listen(server);
//Establishes socket connection.
io.on("connection", socket => {
    joinedNewMember(socket.client.id);
    socket.on("disconnect", () => {
        liveCount--;
        if(liveCount<0)
        {
            liveCount = 0;
        }
        updateLiveCount();
        console.info("Client disconnected Live -> ", liveCount)
    });
});