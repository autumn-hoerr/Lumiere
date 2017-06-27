import React, { Component } from 'react';
import ig from 'instagram-tagscrape';
import asyncPoll from 'react-async-poll';

const PhotoList = ({ data }) => {
    console.log(data)
    const imgs = data.media.map( ({photo}) => <img className="c-photo-card" src={ photo.display_src } alt={ photo.caption } />);
    return <div>{ imgs }</div>
}

const onPollInterval = (props, dispatch) => {
  return dispatch(
    ig.scrapeTagPage('kimchiandthebeast')
  );
};

export default asyncPoll(2*1000, onPollInterval)(PhotoList)

//  state ={
  //   photos: []
  // }
  // fetchPhotos(props, dispatch){
  //   console.log("fetching...")
  //   return dispatch(
  //     ig.scrapeTagPage('kimchiandthebeast')
  //       .then(result => {
  //         const photos = result.media
  //         this.setState({ photos })
  //     })
  //   );
  // }
  // componentDidMount(){
  //   this.fetchPhotos();
  //   asyncPoll(2*1000, this.fetchPhotos)(PhotoCard);
  // }