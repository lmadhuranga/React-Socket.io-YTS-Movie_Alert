"use strict";
var config = {
  socketHost  : "https://movies-lovers.herokuapp.com",
  // socketHost  : "http://localhost:3001",
  badgeColor  : '#FF0000',
  movieUrl    : "https://yts.am/movie",
  youtubeUrl  : "https://www.youtube.com/watch?v="
}
var socket = io.connect(config.socketHost);

// Conditionally initialize the options.
if (!localStorage.isInitialized) {
  localStorage.isActivated = true;   // The display activation.
  localStorage.frequency = 1;        // The display frequency, in minutes.
  localStorage.isInitialized = true; // The option initialization.
}
// Set Badge color to red
chrome.browserAction.setBadgeBackgroundColor({color:config.badgeColor});

// Show the notification base on the count of movies
function showNotifications(movies) {
  chrome.browserAction.setBadgeText({text: `${movies.length}`});

  //If movies more than 5 notify as list
  if(movies.length>5) {
    let moviesList = movies.map((movie) =>{ 
      let genres = movie.genres ? `[${movie.genres.join(' / ')}]`: '';
      return { title:movie.title_long, message:`10/${movie.rating} ${genres} ${movie.language}` };
    });

    chrome.notifications.create(`movie.title_long `, {
      type: "list",
      title: "Latest Movies List",
      message: "Just Arive to site",
      iconUrl: "48.png",
      items: moviesList
    });

  } else {
    // Create Single notification 
    movies.forEach((movie, movieIndex) => {
      let genres = movie.genres ? `[${movie.genres.join(' / ')}]`: '';
      chrome.notifications.create(`${movieIndex}`, {
        type: "basic",
        title: movie.title_long,
        message: `10/${movie.rating} ${genres} ${movie.language}`,
        iconUrl: movie.small_cover_image,
        // iconUrl: '48.png',
        buttons: [
          {title: 'Youtube'},
        ],
        priority: 0
      });
    });

    // When notificatin click redirect to Yts page
    chrome.notifications.onClicked.addListener((movieIndex) => {
      let toUrl = `${config.movieUrl}/${movies[movieIndex].slug}`;
      // chrome({url:toUrl});
    });
    // when youtube click got youtube trailre
    chrome.notifications.onButtonClicked.addListener((movieIndex, btnIndex) => {  
      let youtubeUrl = `${config.youtubeUrl}${movies[movieIndex].yt_trailer_code}`;
      chrome.tabs.create({url:youtubeUrl});
    });
  }
}

// Start listning to server
socket.on('connect', () => {
  const userId = socket.id;
  socket.on(`init-${userId}`, (data)=>{
    let movies = data.latestMovies;
    console.log('movies',movies);
    // Show the notification 
    showNotifications(movies);
  });
  
  // When new movie released dispaly
  socket.on("newmovies", (data) => {
    movies = data.latestMovies;
    console.log('movie',movies);
    showNotifications(movies);    
  });
});