import React, { Component } from 'react';
import ig from 'instagram-tagscrape';
import firebase from './firebase.js'
import './App.css';

function PhotoCard(props){
  return (
    <div className="c-photo__card" style={{ backgroundImage: `url(${props.display_src})` }}>
      <div className="c-photo__meta">{props.caption}</div>
    </div>
  );
}

class App extends Component {
  constructor(){
    super();
    this.state = {
      photos: [],
      firebase: false,
      hashtag: 'birthday'
    }
    this.fetchData = this.fetchData.bind(this);
  }
  fetchData(){
    console.log("fetching...")
    const photosRef = firebase.database().ref('photos');
    ig.scrapeTagPage(this.state.hashtag)
      .then(result => {
        const photos = result.media
        
        if(this.state.firebase){
          for( let photo in photos ){
            photosRef.child(photos[photo].id).once('value', function(snapshot){
              let exists = (snapshot.val() !== null);
              if(!exists){
                photosRef.child(photos[photo].id).set({
                  display_src: photos[photo].display_src,
                  id: photos[photo].id,
                  code: photos[photo].code,
                  caption: photos[photo].caption
                });
              }
            });
          }
        }

        this.setState({ photos: photos });
      });
  }
  componentDidMount(){
    
    this.fetchData();
    // const photosRef = firebase.database().ref('photos');
    // photosRef.on('value', (snapshot) => {
    //   let photos = snapshot.val();
    //   let newState = [];
    //   for( let photo in photos){
    //     newState.push({
    //       id: photos[photo].id,
    //       display_src: photos[photo].display_src,
    //       code: photos[photo].code
    //     });
    //   }
    //   this.setState({
    //     photos: newState
    //   });
    // });
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
