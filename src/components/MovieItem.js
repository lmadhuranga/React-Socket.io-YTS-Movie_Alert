import React, { Component } from 'react';
import socketIOClient from "socket.io-client";
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';

import LinearProgress from '@material-ui/core/LinearProgress';
const MIN = 0;
const MAX = 10;
const normalise = value => (value - MIN) * 100 / (MAX - MIN);
const socketUrl = process.env.NODE_ENV==='development'?'http://localhost:3001':'/';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    margin: 'auto',
    maxWidth: 500,
  },
  image: {
    width: 128,
    height: 128,
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
});

class MovieItem extends Component {
  constructor(){
    super();
    this.state = { 
      movies: [], 
      liveCount:0,
    };
  }
 

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  }

  setup() {
    const socket = socketIOClient(socketUrl);
    socket.on('connect', () => {
      const socketId = socket.id;
      socket.on(`init-${socketId}`, (data)=>{
        // console.log('init called',data);
        this.setState({ movies: data.latestMovies});
      })
    //   console.log('Client => Connected => Server ID=>', socket.id, socket);
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

  componentDidMount() {
    setTimeout(this.setup.bind(this), 1000);
  }

  
  render() {
    const { classes, movie } = this.props;
    const youtubeUrl = `https://www.youtube.com/watch?v=${movie.yt_trailer_code}`
     /* <li key={movie.id}>
      <img alt={movie.title_long} 
     src={movie.small_cover_image} /> 
     {movie.title_long} -
      {movie.rating} 
     {movie.genres.join()}</li>; */
    return (
        <Grid container wrap="nowrap" spacing={16}>
            <Grid item>
                <ButtonBase className={classes.image}>
                    <img className={classes.img} alt={movie.title_long} src={movie.medium_cover_image} />
                </ButtonBase>
            </Grid>
            <Grid item xs={12} sm container>
                <Grid item xs container direction="column" spacing={16}>
                    <Grid item xs>
                        <Typography gutterBottom variant="subtitle1">
                            <a target="_blank" href={ movie.url } title={movie.title}> {movie.title}</a> { movie.year }
                        </Typography>
                        { movie.genres && <Typography gutterBottom>[ { movie.genres && movie.genres.join(' / ') } ]</Typography> }
                        <Typography color="textSecondary">10 / { movie.rating } - { movie.language }</Typography>
                        <LinearProgress variant="determinate" value={normalise(movie.rating)} />
                    </Grid>
                    <Grid item>
                        <Typography style={{ cursor: 'pointer' }}>
                            <a target="_blank" href={ youtubeUrl } title={movie.title_long}> Trailer </a>
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item>
                    <Typography variant="subtitle1">..</Typography>
                </Grid>
            </Grid>
        </Grid>
      );
    
  }
}
 
// MovieItem.propTypes = {
//   classes: PropTypes.object.isRequired,
// };


export default withStyles(styles)(MovieItem);