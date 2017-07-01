import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase';

/*
  Generated class for the PostsService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class PostsService {


public data: any;
public userNode: any;
public fireRef: any;
public postsNode: any;
public usersPostsNode: any;
public eventList: any;
public userId : any;
public progress : any;

  constructor(private http: Http) {
  	     this.userNode = firebase.database().ref('users');
  	     this.postsNode = firebase.database().ref('posts');
  	     this.usersPostsNode = firebase.database().ref('user-posts');
  	     this.fireRef = firebase.database().ref();



  	    //  this.userId = firebase.auth().currentUser.uid;
 //this.eventList = firebase.database().ref('questions/' + this.userId + '/questionPictures');

  }


listSomethingOnceService(path:any){

		return firebase.database().ref(path).once('value');
}

addAnythingService(path: any, data: {}){
  // Get a key for a new path.
  var newPostKey = firebase.database().ref('/categories').push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updatePath = {};
  updatePath[path +'/'+ newPostKey] = data;

//update one or more tables simultaneously
  return this.fireRef.update(updatePath);

}
viewAnythingService(path : any){
	         return firebase.database().ref().child(path).once('value');
}


//view all posts made by this userId
viewUsersPostsService(userId: any){
	var userRef = this.usersPostsNode.child(userId);
			return userRef.on('value');
}


deleteAnything(path : any){
  console.log("delete arrives service");
	var updatePath = {};
  updatePath[path] = null;
  return this.fireRef.update(updatePath);
}

createAnythingService(){

}

updateAnythingService(path: any, postData: {}){
 /* var updatePath = {};
  updatePath[path] = postData;

//update both nodes simultaneously
  return this.fireRef.set(updatePath); */
  
 // return firebase.database().ref(path).set(postData);

  // Get a key for a new Post.
  var newPostKey = firebase.database().ref().child('posts').push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates['/'+path] = postData;

  return firebase.database().ref().update(updates);
 
}

overwriteAnythingService(path: any, postData: {}){
	//permanently overwrites whatever is on the node before
	//this is different from update()
	return firebase.database().ref(path).set(postData);
}



listPostService(){
			return this.postsNode.once('value');
}

createPostService(userId: any, postBody: any){
  	 // A post entry.
  var postData = {
    uid: userId,
    body: postBody
  };


  // Get a key for a new Post.
  var newPostKey = this.postsNode.push().key;




  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updatePath = {};
  updatePath['/posts/' + newPostKey] = postData;
  updatePath['/user-posts/' +userId+"/"+ newPostKey] = postData;

//update both tables simultaneously
  return this.fireRef.update(updatePath);
  }

 /*
  addPicture(path: any, uploadDataContent : {}): any {

  	console.log("Started post service addPicture()");
  	var that = this;
     this.eventList.child('questions').push(uploadDataContent['answer'])
    .then((newGuest) => {
    	console.log("Pushed uploadcontent good");

      if (uploadDataContent['photo'] != null) {
        that.profilePictureRef.child(newGuest.key).child('profilePicture.png')
      .putString(uploadDataContent['photo'], 'base64', {contentType: 'image/png'})
        .then((savedPicture) => {


          that.eventList.child('questions').child(newGuest.key).child('profilePicture')
          .set(savedPicture.downloadURL);

        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
     that.progress = (savedPicture.bytesTransferred / savedPicture.totalBytes) * 100;


       console.log('Upload is ' + that.progress + '% done');
      return that.progress;

        });
      }



    });
  } */

}
