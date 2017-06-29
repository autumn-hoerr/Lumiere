import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import ig from 'instagram-tagscrape';
import firebase from './firebase.js'
import './App.css';

function PhotoControls(props){
  return(
    <div className="c-photo__controls">
      <button onClick={ () => props.removePhoto(props.id) }>
        <img src="/trashcan.svg" width="20" height="30" alt="Delete" />
      </button>
    </div>
  )
}

class PhotoCard extends Component{
  constructor(props){
    super(props);
  }
  render(){
    return (
      <div className="c-photo">
        <div className="c-photo__card" style={{ backgroundImage: `url(${this.props.display_src})` }}></div>
        <div className="c-photo__meta"><p>{this.props.caption}</p></div>
        <PhotoControls removePhoto={this.props.removePhoto} id={this.props.id} />
      </div>
    );
  }
}

class App extends Component {
  constructor(){
    super();
    this.state = {
      photos: [],
      blacklist: [],
      firebase: true,
      polling: true,
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
    } else {
      this.setState({ blacklist: this.state.blacklist.concat([id]) });
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
        } else {
          this.setState({ photos: photos });
        }
      });
  }
  componentDidMount(){
    this.fetchData();

    if(this.state.firebase){
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
          if(!this.state.blacklist.includes(photos[photo].id)){
            newState.push({
              id: photos[photo].id,
              display_src: photos[photo].display_src,
              code: photos[photo].code,
              date: photos[photo].date
            });
          }
        }
        this.setState({
          photos: newState
        });
      });
    }

    if(this.state.polling){
      this.fetcher = setInterval(this.fetchData, 30000)
    }
  }
  render() {
    return (
        <div className="c-photo-grid">
          <ReactCSSTransitionGroup
            transitionName="card"
            transitionAppear={false}
            transitionAppearTimeout={500}
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300} >
              
                { this.state.photos
                    .filter((photo) => !this.state.blacklist.includes(photo.id))
                    .sort((a,b) => {return b.date - a.date })
                    .map( photo =>
                      <PhotoCard key={ photo.id } removePhoto={ this.removePhoto } {...photo} />
                    )
                }
              
          </ReactCSSTransitionGroup>
      </div>
    );
  }
}

export default App;
