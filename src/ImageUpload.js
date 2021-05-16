//rfce
import { Button } from '@material-ui/core'
import React, { useState } from 'react'
import {storage, db} from "./firebase";
import firebase from "firebase";
import './ImageUpload.css';

function ImageUpload({username}) {
      {/*1. caption input
      2. file picker
      3. post button */}
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const handleChange = (e) => {
        //if we picked two files so it takes only one
        if(e.target.files[0]){
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
       const uploadTask = storage.ref(`images/${image.name}`).put(image);
       uploadTask.on(
           "state_changed",
           (snapshot) => {
               //progress logic
               const progress = Math.round(
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100
               );
               setProgress(progress);
           },
           (error) => {
               console.log(error);
               alert(error.message);
           },
           () => {
               //getDownloadURL() to get from firebase
              storage
              .ref("images")
              .child(image.name)
              .getDownloadURL()
              .then(url => {
                  //post image inside db
                  db.collection("posts").add({
                      //with serverTimestamp there will a consistent time may be in london someone upload at morning 3:00 so in pakistan later someone upload at morning 3:00.
                      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                      caption: caption,
                      imageurl: url,
                      username: username
                      //above is download url
                  });
                  setImage(null);
                  setProgress(0);
                  setCaption("");    
              }); 
              //this above tell that go and get the download link fron firebase
           }
       );
    };
    return (
        <div className="imageupload" >       
      <progress className="image_progress" value={progress} max="100"/>
      <input className="imageupload_caption" type="text" placeholder='Eneter a caption...'
      value={caption} 
      onChange={(e) => setCaption(e.target.value)} />
      <input type="file" onChange={handleChange} />      
      <Button className="imageupload_btn"  onClick={handleUpload}>Upload</Button>
        </div>
    )
}

export default ImageUpload
