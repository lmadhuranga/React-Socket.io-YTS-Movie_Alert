import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import {  appConfig  } from '../globel.conf'

import {withStyles } from '@material-ui/core/styles';

import socketIOClient from "socket.io-client";
import PropTypes from 'prop-types';
import MovieItem  from './MovieItem';
import { Typography } from '@material-ui/core';
let socketUrl = process.env.NODE_ENV==='development' ? appConfig.localHost :'/';

const styles = theme => ({
  root: {
    width: '100%',
    // maxWidth: 500,
    flexGrow: 1,
    overflow: 'hidden',
    padding: `0 ${theme.spacing.unit * 3}px`,
  },
  paper: {
    maxWidth: 400,
    margin: `${theme.spacing.unit}px auto`,
    padding: theme.spacing.unit * 2,
  },
});

// export default withStyles(styles)(MoviesList);
class MoviesList extends Component {
  constructor(){
    super();
    this.state = { 
      movies: [], 
      liveCount:0 
    };
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
    
    const { classes } = this.props;
    let movieList = this.state.movies.map((movie) =>{
      return(
        <Paper key={ movie.id } className={classes.paper} xs={12}> 
          <MovieItem key={ movie.id } movie={ movie }></MovieItem> 
        </Paper>
      );
      // return <li key={movie.id}> <img alt={movie.title_long} src={movie.small_cover_image} /> {movie.title_long} - {movie.rating} {movie.genres.join()}</li>;
    })
    return (
      <Paper className={classes.root} > 
        <Typography align={'center'} component="h2" variant="display2" gutterBottom>
          YTS Latest Movies ({this.state.liveCount})
        </Typography>
        { movieList } 
      </Paper>
    );
    
  }
}
 
MoviesList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MoviesList);