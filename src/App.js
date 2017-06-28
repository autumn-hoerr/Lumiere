import React, { Component } from 'react';
import ig from 'instagram-tagscrape';
import firebase from './firebase.js'
import './App.css';

function PhotoCard(props){
  return (
    <div className="c-photo__card" style={{ backgroundImage: `url(${props.display_src})` }}></div>
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
    const photosRef = firebase.database().ref('photos');
    ig.scrapeTagPage('kimchiandthebeast')
      .then(result => {
        const photos = result.media
        const newPhotos = [];
        for( let photo in photos ){
          photosRef.child(photos[photo].id).once('value', function(snapshot){
            let exists = (snapshot.val() !== null);
            if(!exists){
              newPhotos.push(photos[photo].id);
              photosRef.child(photos[photo].id).set({
                display_src: photos[photo].display_src,
                id: photos[photo].id,
                code: photos[photo].code
              });
            }
          });
        }
        console.log(`${Date.now()}: Added ${newPhotos.length} new photos`);
      });
  }
  componentDidMount(){
    const photosRef = firebase.database().ref('photos');
    this.fetchData();
    photosRef.on('value', (snapshot) => {
      let photos = snapshot.val();
      let newState = [];
      for( let photo in photos){
        newState.push({
          id: photos[photo].id,
          display_src: photos[photo].display_src,
          code: photos[photo].code
        });
      }
      this.setState({
        photos: newState
      });
    });
    this.fetcher = setInterval(this.fetchData, 30000)
  }
  render() {
    return (
      <div className="c-photo">
        { this.state.photos.reverse().map( photo =>
          <PhotoCard key={ photo.code } {...photo} />
        )}
      </div>
    );
  }
}

export default App;
