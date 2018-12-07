const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path    = require("path");
const subscribe = require('rxjs')
const appConfig = require('./appConfig.json'); 

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
console.log('process.env',process.env);

const port = process.env.PORT || 3001;
// // support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/../build'))); 
// app.use(express.static('../public/img'))
const request = require("request");
const url = "https://yts.am/api/v2/list_movies.json?limit=20&sort_by=id&order_by=desc"; 
let lastMovie = 'none';
let latestMoviesObj = []
let liveCount = 0;
let lastUpdatedTime;
let newUserMovies;


function checkLastUpdate() {
    if(!lastUpdatedTime) {
        // send request
        // console.log('reuset ok  no data previouse');
        lastUpdatedTime = new Date().getTime();
        return true;
    }

    const currtTime = new Date().getTime();
    diff = currtTime - lastUpdatedTime; 
    if(diff>1800000) {
        // retuest
        console.log(' ok request else');
        lastUpdatedTime = new Date().getTime();
        return true;
    }
    console.log('not yet', diff);
    return false
}

function serverCall(__callBack) {
    if(checkLastUpdate()){
        return request.get(url, (error, response, body) => {
            __callBack(JSON.parse(body));
        });    
    }
} 

function getYts(__callBack1){
    serverCall((jsonObj)=>{
        console.log('lastMovies',lastMovie, jsonObj.data.movies[0].title);
        if(lastMovie!=jsonObj.data.movies[0].title){
            latestMoviesObj = jsonObj.data.movies;
            lastMovie = jsonObj.data.movies[0].title;
            io.emit('newmovies',  {latestMovies:jsonObj.data.movies});
            updateLiveCount();
        }
        __callBack1(true);
    })
}

function checkEachUrl(index, url, __callBack) {
    return request.get(url, (error, response, body) => {
        const valid = (response && response.statusCode==200);
        __callBack(valid, index, url);
        return;
    });
}
  

app.get('/check', function (req, res) {
    latestMoviesObj.forEach((movie, index) => {        
        checkEachUrl(index, movie.small_cover_image, (response, index, url)=> {
            latestMoviesObj[index].small_cover_image = appConfig.system.notSmallCover;
        });
    });
    res.send('done')
})

setInterval(()=>{
    getYts((res)=>{
        console.log('1 Timer called now ->', new Date());
    })
}, 360000);

app.get('/', function (req, res) {    
    const htmlPath = path.join(__dirname+'/build/index.html')
    res.sendFile(htmlPath);
})

app.get('/live',(req, res)=>{
    getYts(()=>{
        console.info('liveCount',liveCount);
        res.json({liveCount:liveCount});
    })
})

app.get('/test', function (req, res) {
    let newList = latestMoviesObj.map((movie)=>{
        return {
            id:movie.id, 
            title:movie.title
        }
    });
    io.emit('newmovies',  { latestMovies:getNewUserMovies() })
    res.json({latestMovies:getNewUserMovies()});
    updateLiveCount();
});

const server = app.listen(port,()=>{
    console.log('start server',port);
});

function updateLiveCount(){
    io.emit('liveCount',  { liveCount:liveCount });
}

function getNewUserMovies(){
    return latestMoviesObj.slice(0, 5);
}

function joinedNewMember(userId){    
    liveCount++;
    updateLiveCount();
    if (lastMovie=='none') {
        getYts(()=>{
            io.emit(`init-${userId}`,  {latestMovies:getNewUserMovies()});
        });
        return;        
    }
    io.emit(`init-${userId}`,  {latestMovies:getNewUserMovies()});
    return;
}


const io = require('socket.io').listen(server);
//Establishes socket connection.
io.on("connection", socket => {
    console.log('New Clinet',socket.client.id);
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