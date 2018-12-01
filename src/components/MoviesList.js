import React, { Component } from 'react';
import socketIOClient from "socket.io-client";

// const socketUrl = 'http://localhost:3001'
const socketUrl = '/'

class MoviesList extends Component {
  constructor(props){
    super(props);
    this.state = {movies: []};
  }

  setup() {
    const socket = socketIOClient(socketUrl);
    socket.on('connect', () => {
      const socketId = socket.id;
      socket.on(`init-${socketId}`, (data)=>{
        console.log('init called',data);
        this.setState({ movies: data.latestMovies });
      })
      console.log('Client => Connected => Server ID=>', socket.id, socket);
      socket.on("newmovies", (data) => {;
        // this.setState({movies:[...this.state.movies,data.latestMovies]});
        this.setState({ movies: data.latestMovies });
      });
    });
    socket.on('disconnect', () => {
      socket.off("newmovie")
      socket.removeAllListeners("newmovie");
      console.log("Socket Disconnected");
    });
  }

  componentDidMount(props, satets) {
    setTimeout(this.setup.bind(this), 1000);
  }

  
  render() {
     let movieList = this.state.movies.map((movie) =>{
      //  console.log('new => ',movie.title);
       return <li key={movie.id}>{movie.id} {movie.title}</li>;
     })
    return (
      <div className="hunter">
         <h2>hello MovieLis2</h2>
         <ul>
          {movieList}
         </ul>
      </div>
    );
    
  }
}

export default MoviesList;