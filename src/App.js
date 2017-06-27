import React, { Component } from 'react';
import ig from 'instagram-tagscrape';
import './App.css';


function PhotoCard(props){
  return (
    <img className="c-photo-card" src={ props.display_src } alt={ props.caption } />
  );
}

class App extends Component {
  state ={
    photos: []
  }
  componentDidMount(){
    ig.scrapeTagPage('kimchiandthebeast')
      .then(result => {
        const photos = result.media
        this.setState({ photos })
      })
  }
  render() {
    return (
      <div>
        { this.state.photos.map( photo =>
          <PhotoCard key={ photo.code } {...photo} />
        )}
      </div>
    );
  }
}

export default App;
