import React, { Component } from 'react';
// import PropTypes from 'prop-types';

// import {  appConfig as _config } from '../globel.conf'

import { withStyles } from '@material-ui/core/styles';

const styles ={};

class YoutubeLink extends Component {

  render() {
    const { yt_code } = this.props;
    const youtubeUrl = `https://www.youtube.com/watch?v=${yt_code}&vq=hd720`;

    return  yt_code && <span><a rel="noopener noreferrer" target="_blank" href={ youtubeUrl } title='You Tube'>Trailer</a>&nbsp;</span>  
  }
  
}
 
// YoutubeLink.propTypes = {
//   classes: PropTypes.object.isRequired,
// };


export default withStyles(styles)(YoutubeLink);