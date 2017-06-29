import React, { Component } from 'react';
import ig from 'instagram-tagscrape';
import firebase from './firebase.js'
import './App.css';



function PhotoCard(props){
  return (
    <div className="c-photo">
      <div className="c-photo__card" style={{ backgroundImage: `url(${props.display_src})` }}></div>
      <div className="c-photo__meta"><p>{props.caption}</p></div>
      <div className="c-photo__controls">
        <button onClick={ () => props.removePhoto(props.id) }>
          <img src="/trashcan.svg" width="20" height="30"/>
        </button>
      </div>
    </div>
  );
}

class App extends Component {
  constructor(){
    super();
    this.state = {
      photos: [],
      blacklist: [],
      firebase: true,
      hashtag: 'birthday'
    }
    this.fetchData = this.fetchData.bind(this);
    this.removePhoto = this.removePhoto.bind(this);
  }
  removePhoto(id){
    const blacklistRef = firebase.database().ref('blacklist');
    if(this.state.firebase){
      blacklistRef.child(id).set({
        display: false,
        id: id
      });
    }
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
              if(!exists){
                photosRef.child(photo.id).set({
                  display_src: photo.display_src,
                  id: photo.id,
                  code: photo.code,
                  caption: photo.caption,
                  date: photo.date,
                  owner: photo.owner,
                  dimensions: photo.dimensions
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

    const blacklistRef = firebase.database().ref('blacklist');
    blacklistRef.on('value', (snapshot) => {
      let list = snapshot.val();
      let newState = [];
      for(let item in list){
        newState.push(list[item].id);
      }

      this.setState({
        blacklist: newState
      })
    });
    
    const photosRef = firebase.database().ref('photos');
    photosRef.on('value', (snapshot) => {
      let photos = snapshot.val();
      let newState = [];
      for(let photo in photos){
        if(this.state.blacklist.includes(photos[photo].id)){
          console.log(`photo: ${photos[photo].id} is in blacklist`);
        } else {
          newState.push({
            id: photos[photo].id,
            display_src: photos[photo].display_src,
            code: photos[photo].code
          });
        }
      }
      this.setState({
        photos: newState
      });
    });

    // this.fetcher = setInterval(this.fetchData, 30000)
  }
  render() {
    return (
      <div className="c-photo-grid">
        { this.state.photos
            .filter((photo) => !this.state.blacklist.includes(photo.id))
            .sort((a,b) => {return a > b})
            .map( photo =>
              <PhotoCard key={ photo.code } removePhoto={ this.removePhoto } {...photo} />
            )
        }
      </div>
    );
  }
}

export default App;
