import React, { Component } from 'react';
// import PropTypes from 'prop-types';

// import {  appConfig as _config } from '../globel.conf'

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({});

class TorrentLinks extends Component {

  render() {
    const { torrents } = this.props;
    const torrentLinks = torrents.map((torrent)=> {
            return(
                <span key={ torrent.hash } >
                    &nbsp;|&nbsp;
                    <a target="_blank" href={ torrent.url } rel="noopener noreferrer"
                        key={ torrent.hash } 
                        title={` Seeder: ${ torrent.seeds }   Pears: ${ torrent.peers }  Size: ${ torrent.size } ` }
                    >
                        { torrent.quality }
                    </a>
                </span>
            );
        })
    return ( torrentLinks );  
  }
}
 
// TorrentLinks.propTypes = {
//   classes: PropTypes.object.isRequired,
// };


export default withStyles(styles)(TorrentLinks);