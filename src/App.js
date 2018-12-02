import React, { Component } from 'react';
import MoviesList from './components/MoviesList';
require('dotenv').config()

class App extends Component {
  render() {
    return (
      <div className="App">
        < MoviesList />
      </div>
    );
  }
}

export default App;
