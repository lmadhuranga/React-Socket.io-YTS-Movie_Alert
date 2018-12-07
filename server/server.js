const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path    = require("path");
const subscribe = require('rxjs')
const appConfig = require('./appConfig.json'); 
const _isProduction = process.env.NODE_ENV && process.env.NODE_ENV;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; 

const port = process.env.PORT || 3001;
// // support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/../build'))); 
// app.use(express.static('../public/img'))
const request = require("request");
const ytsUrl = `${appConfig.yts.api.movies_get}?limit=${appConfig.yts.api.params.limit}&sort_by=${appConfig.yts.api.params.sort_by}&order_by=${appConfig.yts.api.params.order_by}`;
let lastMovie = 'none';
let latestMoviesObj = []
let liveCount = 0;
let lastUpdatedTime;


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
        return request.get(ytsUrl, (error, response, body) => {
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
            socketClRrefreLiveCount();
            checkBrockenLinks();
            setTimeout(() => socketClNewMovie(latestMoviesObj), 5000);
        }
        __callBack1(true);
    })
}

function _isUrlActive(index, url, __callBack) {
    return request.get(url, (error, response, body) => {
        const status = (response && response.statusCode==200);
        __callBack(status, response.statusCode, index, url);
    });
}

function checkBrockenLinks() {
    latestMoviesObj.forEach((movie, index) => {        
        _isUrlActive(index, movie.small_cover_image, (status, code, index, url)=> {
            if(!status){
                const hostUrl = _isProduction ? appConfig.remote.url:appConfig.local.url;
                const newUrl = `${hostUrl}/${appConfig.system.notSmallCover}`;
                latestMoviesObj[index].small_cover_image = newUrl;
                console.log('Broken link', status, code, url, newUrl);
            }            
        });
    });
}

app.get('/check', function (req, res) {
    checkBrockenLinks();
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
    console.log('process.env',process.env);
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
    socketClRrefreLiveCount();
});

const server = app.listen(port,()=>{
    console.log('start server',port);
});


function getNewUserMovies(){
    return latestMoviesObj.slice(0, 5);
}

function joinedNewMember(userId){    
    liveCount++;
    socketClRrefreLiveCount();
    if (lastMovie=='none') {
        getYts(()=>{
            socketClInitCall(userId, getNewUserMovies());
        });
        return;        
    }
    socketClInitCall(userId, getNewUserMovies());
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
        socketClRrefreLiveCount();
        console.info("Client disconnected Live -> ", liveCount)
    });
});

function socketClNewMovie(movies) {
    io.emit('newmovies',  {latestMovies:movies});
}

function socketClInitCall(userId, movies){
    io.emit(`init-${userId}`,  {latestMovies: movies});
}

function socketClRrefreLiveCount(){
    io.emit('liveCount',  { liveCount:liveCount });
}