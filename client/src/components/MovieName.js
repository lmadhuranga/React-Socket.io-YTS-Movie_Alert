import React, { Component } from 'react';
// import PropTypes from 'prop-types';

import {  appConfig } from '../globel.conf'

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({});

class TorrentLinks extends Component {

  render() {
    const { movie } = this.props; 
    const newTile = movie.title.substr(0, appConfig.movieName.length);
    return (<span><a target="_blank" rel="noopener noreferrer"  href={ movie.url } title={ movie.title }> { newTile }</a> { movie.year } </span> );  
  }
}
 
// TorrentLinks.propTypes = {
//   classes: PropTypes.object.isRequired,
// };


export default withStyles(styles)(TorrentLinks);