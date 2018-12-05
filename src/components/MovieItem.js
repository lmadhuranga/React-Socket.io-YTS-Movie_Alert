import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import MovieName from './MovieName';
import TorrentLinks from './TorrentLinks';
import YoutubeLink from './YoutubeLink';
import Subtitle from './Subtitle';
import ImdbLink from './ImdbLink';

// import {  appConfig as _config } from '../globel.conf'

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';

import LinearProgress from '@material-ui/core/LinearProgress';
const MIN = 0;
const MAX = 10;
const normalise = value => (value - MIN) * 100 / (MAX - MIN);

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
    width: 100,
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
        movie:{},
    };
  }
 
  render() {
    const { classes, movie } = this.props;
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
                            <MovieName movie={movie}></MovieName>
                        </Typography>
                        { movie.genres && <Typography gutterBottom>[ { movie.genres && movie.genres.join(' / ') } ]</Typography> }
                        <Typography color="textSecondary">10 / { movie.rating } - { movie.language }</Typography>
                        <LinearProgress variant="determinate" value={normalise(movie.rating)} />
                    </Grid>
                    <Grid item>
                        <Typography style={{ cursor: 'pointer' }}>
                            <YoutubeLink yt_code={ movie.yt_trailer_code }></YoutubeLink>
                            <TorrentLinks torrents={ movie.torrents } ></TorrentLinks>
                            <ImdbLink code={ movie.imdb_code } ></ImdbLink>
                            <Subtitle title={ movie.title_long } ></Subtitle>
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
     /* <li key={movie.id}> <img alt={movie.title_long}  src={movie.small_cover_image} />  {movie.title_long} - {movie.rating}  {movie.genres.join()}</li>; */


export default withStyles(styles)(MovieItem);