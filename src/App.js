import React from 'react';
import { useEffect, useState } from 'react';
import './App.css';
import Post from './Post';
import {db, auth} from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {
  
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  //above consts are of material ui
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null); 
  const [openSignIn, setOpenSignIn] = useState(false); 


  //------------2. this is the listner for authentication 
  useEffect(() => {
   //// 2. this will listen for every single time if any any change happen on authentication 
   //// this above means if you login or logout it will run 
  const unsubscribe = auth.onAuthStateChanged((authUser) => {
     if (authUser){
    console.log(authUser);
    setUser(authUser);

     }else{
       //user has log out
      setUser(null);
     }
   })

   //for example new user log in and he change his name so bcz of dependencies [user, username] it fires again the whole useEffect but with return below it deteched the old one.
   //we did this thing bcz useEffect and onAuthStateChanged both fires according to their dependencies
   return () => {
     //perform some cleanup action
     unsubscribe();
   }
  }, [user, username]);

  //[] only run when page loads
  // if not [] then each time things randers
  useEffect(() => {
    ////normal way of reading
    // db.collection('posts').onSnapshot(snapshot => {
    //   setPosts(snapshot.docs.map(doc => doc.data()));
    // })
    ////another way to get individual ids
    //this timestamp is to manage time the post can be on same time.
db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })

  },[]);

  //-----------1. to create new user with pass and email for authentication
  const signUp = (event) => {
   event.preventDefault();
   //1. create user and catch him
   auth.createUserWithEmailAndPassword(email, password)
   .then((authUser) => {
    return authUser.user.updateProfile({
       displayName: username
     })
   })
   .catch((error) => alert(error.message));
  }

  const signIn = (event) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message));
    //to close model
    setOpenSignIn(false);
  }


  return (
    <div className="App">
    
<Modal
  open={open}
  onClose={() => setOpen(false)} 
>
<div style={modalStyle} className={classes.paper}>
     <form className="app_signup" >
      <center>
      <img 
        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" className="form-image" />

      <Input
        placeholder="username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        ></Input>

        <Input
        placeholder="email"
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        ></Input>

       <Input
        placeholder="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        ></Input>

        <Button type="submit" onClick={signUp}>sign Up</Button>
      </center>
      </form>
    </div>
</Modal>



<Modal
  open={openSignIn}
  onClose={() => setOpenSignIn(false)} 
>
<div style={modalStyle} className={classes.paper}>
     <form className="app_signup" >
      <center>
      <img 
        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" className="form-image" />

        <Input
        placeholder="email"
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        ></Input>

       <Input
        placeholder="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        ></Input>

        <Button type="submit" onClick={signIn}>sign In</Button>
      </center>
      </form>
    </div>
</Modal>
     

      <div className="app-header">
        <img 
        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" className="app-header-image" />
      
      {
     //----------just auth.signout() to sign out
     user ? <Button onClick={() => auth.signOut()} >Logout</Button> 
     :
     <div className="app_loginContainer">
       <Button onClick={() => setOpenSignIn(true)} >Sign In</Button>
       <Button onClick={() => setOpen(true)} >Sign Up</Button>
     </div>
    
   }
      
      
      </div>

      <div className="app__post">

        <div className="app_first">

      {
user?.displayName ? (
  <p></p> 
): (<h3>Sorry you need to login to upload posts and to add comments.</h3>
)
}
</div>

      {
        //when we did not had key simple way
        // posts.map( cur => (
        //   <Post username={cur.username} caption={cur.caption} imageurl={cur.imageurl}></Post>
        // ))

        //another way by destructuring with key
        posts.map(({id, post}) => (
          //bcz of this id only particular element of that id will be load not all elements in map
          <Post key={id} username={post.username} caption={post.caption} imageurl={post.imageurl} postId={id} user={user}></Post>
        ))
      }
      </div>
 



  {/* //working on firebase storage to store image and post on firebase */}
   {/* //user? measin this is optional    */}

   {
user?.displayName ? (
<ImageUpload username={user.displayName} /> 
): (<h3>Sorry you need to login to upload posts and to add comments.</h3>
)}
      
    </div>
  );
}

export default App;
