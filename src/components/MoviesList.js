import React, { Component } from 'react';
import socketIOClient from "socket.io-client";

const socketUrl = '/'

class MoviesList extends Component {
  constructor(props){
    super(props);
    this.state = {movies: [], liveCount:0};
  }

  setup() {
    const socket = socketIOClient(socketUrl);
    socket.on('connect', () => {
      const socketId = socket.id;
      socket.on(`init-${socketId}`, (data)=>{
        console.log('init called',data);
        this.setState({ movies: data.latestMovies});
      })
      console.log('Client => Connected => Server ID=>', socket.id, socket);
      socket.on("newmovies", (data) => {;
        // this.setState({movies:[...this.state.movies,data.latestMovies]});
        this.setState({ movies: data.latestMovies });
      });
      socket.on("liveCount", (data) => {;
        this.setState({ liveCount:data.liveCount });
      });
    });
    socket.on('disconnect', () => {
      const socketId = socket.id;
      socket.removeAllListeners("newmovies");
      socket.removeAllListeners(`init-${socketId}`);
      socket.removeAllListeners(`liveCount`);
      socket.off(`ini t-${socketId}`)
      socket.off("newmovies")
      socket.off(`liveCount`)
      console.log("Socket Disconnected");
    });
  }

  componentDidMount(props, satets) {
    setTimeout(this.setup.bind(this), 1000);
  }

  
  render() {
     let movieList = this.state.movies.map((movie) =>{
      //  console.log('new => ',movie.title);
       return <li key={movie.id}> <img alt={movie.title_long} src={movie.small_cover_image} /> {movie.title_long} - {movie.rating} {movie.genres.join()}</li>;
     })
    return (
      <div className="MovieList">
         <h2>hello MovieLis2 ({this.state.liveCount})</h2>
         <ul>
          {movieList}
         </ul>
      </div>
    );
    
  }
}

export default MoviesList;