import React, { Component } from 'react';
// import PropTypes from 'prop-types';

// import {  appConfig as _config } from '../globel.conf'

import { withStyles } from '@material-ui/core/styles';

const styles ={};

class Subtitle extends Component {

  render() {
    const { title } = this.props;
    const toUrl = `https://subscene.com/subtitles/title?q=${title}&l=`     
    return  <span>&nbsp;|&nbsp;<a target="_blank" href={ toUrl } title='Subtitle' rel="noopener noreferrer">En</a></span>  
  }
}
 
// Subtitle.propTypes = {
//   classes: PropTypes.object.isRequired,
// };


export default withStyles(styles)(Subtitle);