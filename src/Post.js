import React, { useEffect, useState } from 'react'
import './post.css';
import Avatar from '@material-ui/core/Avatar';
import { db } from './firebase';
import firebase from "firebase";



//rfce
function Post({username, caption, imageurl, postId, user}) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    useEffect(() => {
        let unsubscribe;
        if(postId){
    unsubscribe = db.collection("posts").doc(postId).collection("comments").orderBy('timestamp', 'desc').onSnapshot((onSnapshot) => {
    setComments(onSnapshot.docs.map((doc) => 
    doc.data()
    ));
 });
        }

        return () => {
            unsubscribe();
        };
    }, [postId]);

    //to submit comment to that post
    const postComment = (event) => {
        event.preventDefault();
        db.collection("posts").doc(postId).collection("comments").add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
           text: comment,
           username: user.displayName
        });
        setComment('');
    }


    return (
        <div className="post">
            <div className="post-header">
          <div className="post_avatar">

          <Avatar alt={username} src="/static/images/avatar/1.jpg" />
          </div>
           
            <h3>{username}</h3>
           
            </div>       
          
            <img className="post-image" src={imageurl} alt="" />
           
            <h4 className="post-text">
               <strong>{username}: </strong>{caption}</h4>
               <p className="post-commentHeading">Comments:</p>

               
  {/* //at firebase inside collection comments we have text and username */}  
            <div className="post_comments">
            {
                comments.map((cur) => (              
                    <p className="post_nameandText">
    <strong>{cur.username}</strong> {cur.text}
                    </p>
                ))
            }
            </div>
               

            {user &&    <form className="post_commentBox">
              <input  
               className="post_input"
               type="text"
               placeholder="Add a comment..."
               value={comment}
               onChange={(e) => setComment(e.target.value)}
               />
               
                   <button
                   className="post_button"
                   type="submit"
                   onClick={postComment}
                   >Post</button>
               </form>
            }
        </div>
    )
}

export default Post
