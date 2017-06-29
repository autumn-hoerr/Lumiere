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
      firebase: true,
      hashtag: 'kimchiandthebeast'
    }
    this.fetchData = this.fetchData.bind(this);
  }
  fetchData(){
    console.log("fetching...")
    const photosRef = firebase.database().ref('photos');
    ig.scrapeTagPage(this.state.hashtag)
      .then(result => {
        const photos = result.media
        // console.dir(result);
        if(this.state.firebase){
          // console.log("firebase enabled")
          photos.map(function(photo){
            photosRef.child(photo.id).once('value', function(snapshot){
              let exists = (snapshot.val() !== null);
              console.log(photo.id, snapshot.val());
              if(!exists){
                photosRef.child(photo.id).set({
                  display_src: photo.display_src,
                  id: photo.id,
                  code: photo.code,
                  caption: photo.caption
                });
              }
            });
            return true;
          });
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
