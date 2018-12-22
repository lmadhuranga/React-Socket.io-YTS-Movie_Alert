import React, { Component } from 'react';
// import PropTypes from 'prop-types';

// import {  appConfig as _config } from '../globel.conf'

import { withStyles } from '@material-ui/core/styles';

const styles ={};

class ImdbLink extends Component {

  render() {
    const { code } = this.props;
    const toUrl = `https://www.imdb.com/title/${code}/`;

    return  code && <span>&nbsp;|&nbsp;<a rel="noopener noreferrer" target="_blank" href={ toUrl } title='Imbd'>IMDb</a></span>  
  }
  
}
 
// ImdbLink.propTypes = {
//   classes: PropTypes.object.isRequired,
// };


export default withStyles(styles)(ImdbLink);