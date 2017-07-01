import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, AlertController, NavParams } from 'ionic-angular';
import { UsersService } from '../../providers/users-service/users-service';
import { PostsService } from '../../providers/posts-service/posts-service';
import * as firebase from 'firebase';
import { UserViewPage } from '../user-view/user-view';
import { HomePage } from '../home/home';
//import { ImagePicker } from '@ionic-native/image-picker';
/**
 * Generated class for the UserEdit page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-user-edit',
  templateUrl: 'user-edit.html',
  providers: [PostsService]
})
export class UserEditPage {

public userId : string;
public skills : string;
  public email : any;
  public about : any;
  public phone : any;
  public password : any;
  public first_name : any;
  public last_name : any;
  public city : any;
  public state : any;
  public country : any;
  public myUserId : any;
public guestPicture : any;
public userDetails = [];

  constructor( public navCtrl: NavController,public alertCtrl: AlertController, public navParams: NavParams, public toastCtrl: ToastController, public postsService : PostsService) {
  	
  	this.myUserId = firebase.auth().currentUser.uid; //current user id
    this.getUserDetails(this.myUserId);
  }


 
 getUserDetails(userId : any){
 	var that = this;
  	  let toast = this.toastCtrl.create({
      message: 'Fetching user profile...',
    });
    
    toast.present();
    
  	this.postsService.listSomethingOnceService('/users/'+userId).then((snapshot)=>{

//that.userDetails.length = null; //so that it ddoesn't repeat the list
  
		  var data = snapshot.val();
          data['profilePic'] = '/assets/img/marty-avatar.png';
          that.userDetails.push(snapshot.val());
          that.userId = snapshot.key;
          
          that.skills = snapshot.val().skills || '';
		  that.email  = snapshot.val().email || '';
		  that.phone  = snapshot.val().phone || '';
		  that.first_name  = snapshot.val().first_name || '';
		  that.last_name  = snapshot.val().last_name || '';
		  that.city  = snapshot.val().city || '';
		  that.about  = snapshot.val().about || '';
		  that.state  = snapshot.val().state || '';
		  that.country  = snapshot.val().country || '';
		  
	  toast.dismiss();
        
                

  	}, error =>{
  		  let toast = this.toastCtrl.create({
      message: 'Sorry couldnt retrive user details, check your internet connection',
      duration: 3000
    });
    toast.present();
  		});
 }
 
 
   updateProfile(){
   	 var  postData = {
	  	email: this.email,
	  	first_name: this.first_name,
	  	last_name: this.last_name,
	  	skills: this.skills,
	  	phone: this.phone,
	  	city: this.about,
	  	state: this.state,
	  	country: this.country,
	  	
	  }
	  
	  console.log(postData);

	  this.postsService.updateAnythingService('users/'+this.myUserId, postData).then(()=> {

	  	//toast
			  let toast = this.toastCtrl.create({
			    message: 'update successful',
			    duration: 1500,
			    position: 'top'
			  });

			  toast.onDidDismiss(() => {
			   this.navCtrl.push(UserViewPage, {
			   	key: this.myUserId
			   });
			  });

			  toast.present();
	  	}, error =>{
	  		 let toast = this.toastCtrl.create({
			    message: error.message,
			    duration: 3000,
			    position: 'top'
			  });
	  		
	  		toast.present();
	  	});
   }
   
   
   
   
/*
   deleteCategory(categoryId : any){
   		 let confirm = this.alertCtrl.create({
		      title: 'This will delete this category and all the questions in it!',
		      message: 'Are you sure you want to proceed',
		      buttons: [
		        {
		          text: 'Don\'t delete',
		          handler: () => {
		          	//
		          }
		        },
		        {
		          text: 'Delete',
		          handler: () => {
		      this.postsService.deleteAnything('categories/'+categoryId).then(()=> {

					  let toast = this.toastCtrl.create({
					    message: 'Delete successful',
					    duration: 2000,
					    position: 'top'
					  });

					  toast.onDidDismiss(() => {
					   this.navCtrl.push(HomePage);
					  });
					  toast.present();

		   		});



		          }
		        }
		      ]
		    });
		    confirm.present();
   }



*/


/*
 selectImage(){
   ImagePicker.getPictures({maximumImagesCount: 1}).then((results) => {
  for (var i = 0; i < results.length; i++) {
      console.log('Image URI: ' + results[i]);
      var imageUrl = results[i];
  } 

  //upload to firebase
  //imageUrl


}, (err) => { });

} */

/*
choosePicture(){
	Camera.getPicture(options).then((imageData) => {
 // imageData is either a base64 encoded string or a file URI
 // If it's base64:
 let base64Image = 'data:image/jpeg;base64,' + imageData;


}, (err) => {
 // Handle error
});
} */


/*
getPictureFromGallery(){

  Camera.getPicture({
    quality : 95,
    destinationType : Camera.DestinationType.DATA_URL,
    sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
    allowEdit : false,
    encodingType: Camera.EncodingType.PNG,
    targetWidth: 500,
    targetHeight: 500,
    saveToPhotoAlbum: true
  }).then(imageData => {
    this.guestPicture = imageData;
console.log("full imagedata: "+imageData);
  }, error => {
    console.log(JSON.stringify(error));
    alert("ERROR -> " + JSON.stringify(error));

  });
}

uploadImage(){
  var that = this;

    that.addPicture('categories/'+that.categoryId+'/questions',that.guestPicture);
}



addPicture(path : any, photoData : any) {


  /*
	  let toast = this.toastCtrl.create({
      message: 'Image upload started in the background',
      duration: 3000,
      position: 'top'
    });
    toast.present();
 */

/*
      let loader = this.loadingCtrl.create({
           content: "Uploading Image, Please Wait...",
         });
         loader.present();

  if (photoData != null) {


  	var that = this;
     var newDetailsKey = firebase.database().ref().child(path).push(postDataDetails);

        that.profilePictureRef.child(that.categoryId+'/questions/'+newDetailsKey.key).child('gamePicture.png')
      .putString(photoData, 'base64', {contentType: 'image/png'})
        .then(savedPicture => {


        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
     that.uploadProgress = (savedPicture.bytesTransferred / savedPicture.totalBytes) * 100;


    if(that.uploadProgress == 100){
      loader.dismiss();
    }


            	//update the question with photo url
             firebase.database().ref().child(path+'/'+newDetailsKey.key)
              .update({photoUrl : savedPicture.downloadURL});


      // console.log('Upload is ' + that.uploadProgress + '% done');

       let toast = that.toastCtrl.create({
         message: 'Upload is ' + that.uploadProgress + '% done',
         duration: 3000,
         position: 'top'
       });
       toast.present();

      return  that.uploadProgress;

        });
      }



*/


/*
  // Create the file metadata
  var metadata = {
    contentType: 'image/jpeg'
  };
 var file = photoData;
 var that = this;

 var loader = that.loadingCtrl.create({
      content: "Uploading Image, "+ that.progress +"% Please Wait...",
    });


  // Upload file and metadata to the object 'images/mountains.jpg'
  var uploadTask = that.profilePictureRef.child('images/' + 'imageUploadPicture.png')
  .putString(photoData, 'base64' ,metadata);

  // Listen for state changes, errors, and completion of the upload.
  uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function(snapshot) {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      that.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + that.progress + '% done');


         loader.present();

      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
          break;
      }
    }, function(error) {
    switch (error.code) {
      case 'storage/unauthorized':
        // User doesn't have permission to access the object
        break;

      case 'storage/canceled':
        // User canceled the upload
        break;
      case 'storage/unknown':
        // Unknown error occurred, inspect error.serverResponse
        break;
    }
  }, function(){
    // Upload completed successfully, now we can get the download URL

console.log("Image uploaded completely, now saving to database: "+uploadTask.snapshot);

     loader.dismiss();
    var downloadURL = uploadTask.snapshot.downloadURL;

var that = this;

var that = this;
    var postDataDetails = {
  		question_description : that.question_description || '',
  		question_title : that.question_title || '',
  		right_answer : that.right_answer || 1,
      photoUrl : uploadTask.snapshot.downloadURL
  	}
     var newDetailsKey = firebase.database().ref().child(path).push();

    //update the question with photo url
   firebase.database().ref().child(path+'/'+newDetailsKey.key)
    .update(postDataDetails);
  });


  //that.question_description = '';
  //that.question_title = '';
  that.guestPicture = '';


  let toast = this.toastCtrl.create({
       message: 'Upload added successful,add another.',
       duration: 3000
     });
     toast.present();
  }

*/


















}
