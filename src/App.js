import React, { Component } from 'react';
import ig from 'instagram-tagscrape';
import './App.css';


function PhotoCard(props){
  return (
    <div className="c-photo-card" style={{ backgroundImage: `url(${props.display_src})` }}></div>
  );
}

class App extends Component {
  constructor(){
    super();
    this.state = {
      photos: []
    }
    this.fetchData = this.fetchData.bind(this);
  }
  fetchData(){
    console.log("fetching...")
    ig.scrapeTagPage('kimchiandthebeast')
      .then(result => {
        const photos = result.media
        this.setState({ photos: photos })
    })
  }
  componentDidMount(){
    this.fetchData();
    this.fetcher = setInterval(this.fetchData, 10000)
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
