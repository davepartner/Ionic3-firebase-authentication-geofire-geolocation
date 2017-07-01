import { Component } from '@angular/core';
import { NavController, ModalController , AlertController, ToastController, ActionSheetController } from 'ionic-angular';

import { UserViewPage } from '../user-view/user-view';

import { PostsService } from '../../providers/posts-service/posts-service';
import * as firebase from 'firebase';
import GeoFire from 'geofire'; //I created a geofire.d.ts file in /app folder that's why this works'

//geolocation
import { Geolocation } from '@ionic-native/geolocation';

@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html',
  providers: [PostsService, Geolocation]
})
export class ListMasterPage {
  userPostsLists = [];
  userProfileLists: any;
  userId: any;
  public geoFire : any;
  public firebaseRef : any;
  constructor(public postsService: PostsService, public alertCtrl: AlertController, public toastCtrl: ToastController, public navCtrl: NavController,public actionSheetCtrl: ActionSheetController, public modalCtrl: ModalController, private geolocation: Geolocation) {
   
this.listUsersNearby();
this.getUserLocation();

       this.userProfileLists = firebase.database().ref('users');
       this.userId = firebase.auth().currentUser.uid;
       //get list of posts on page init
       this.listCategories();
       
       this.firebaseRef = firebase.database().ref('users-location/');
this.geoFire = new GeoFire(this.firebaseRef); //this 


  }



getUserLocation(){
	
this.geolocation.getCurrentPosition().then((resp) => {
 
 //this updates the current position of the user
 /*var postData = {
 	latitude : resp.coords.latitude,
    longitude : resp.coords.longitude
 }*/
 
 var that = this;
 
    this.geoFire.set(that.userId, [resp.coords.latitude, resp.coords.longitude]).then(function() {
      console.log("Current user " + that.userId + "'s location has been added to GeoFire");

      // When the user disconnects from Firebase (e.g. closes the app, exits the browser),
      // remove their GeoFire entry
      this.firebaseRef.child(this.userId).onDisconnect().remove();

      console.log("Added handler to remove user " + that.userId + " from GeoFire when you leave this page.");
    }).catch(function(error) {
      console.log("Error adding user " + that.userId + "'s location to GeoFire");
    });
    
    
 /*
 this.postsService.overwriteAnythingService('/users-location/'+this.userId, postData).then(()=>{
 	console.log("location saved");
 }); */
 
}).catch((error) => {
	
	var that = this;
  console.log('Error getting location', error);
   
      let alert = that.alertCtrl.create({
      title: 'Geolocation not available',
      subTitle: 'We have an error getting your location, ensure that your phone\'s GPS is on!',
      buttons: ['OK']
    });
    alert.present();
    
    
});

var that = this;
let watch = that.geolocation.watchPosition();
watch.subscribe((data) => {
 // data can be a set of coordinates, or an error (if an error occurred).
 // data.coords.latitude
 // data.coords.longitude
 
 /*if(typeof data.coords != "undefined"){
 	 var postData = {
		 	latitude : data.coords.latitude,
		    longitude : data.coords.longitude
		 }
 
 
		 this.postsService.overwriteAnythingService('/users-location/'+this.userId, postData).then(()=>{
		 	console.log("location saved");
		 });
 } */

});
	
}
  listUsersNearby(){
  	
  	var that = this;
  	
  	  let toast = this.toastCtrl.create({
      message: 'Fetching users nearby...',
    });
    
    toast.present();
    
  	this.postsService.listSomethingOnceService('/users').then((snapshot)=>{

that.userPostsLists.length = null; //so that it ddoesn't repeat the list
  	snapshot.forEach(function (childSnapshot) {
  		                var data = childSnapshot.val();
                        data['key'] = childSnapshot.key;
                        data['profilePic'] = '/assets/img/marty-avatar.png';
                         that.userPostsLists.push(data);
                });
            
    toast.dismiss();
        
                

  	}, error =>{
  		  let toast = this.toastCtrl.create({
      message: 'Sorry couldnt retrive list, check your internet connection',
      duration: 3000
    });
    toast.present();
  		});

  }
  
  
  viewUser(userkKey){
  	this.navCtrl.push(UserViewPage, {
  		key: userkKey
  	});
  }
  
  addVacancy() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Find people within',
      buttons: [
        {
          text: 'Within Yaba',
          role: 'destructive',
          handler: () => {
            console.log('Destructive clicked');
          }
        },{
          text: 'Within Lagos',
          handler: () => {
            console.log('Archive clicked');
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }
  

  addCategory() {
    let prompt = this.alertCtrl.create({
      title: 'Add New Category',
      message: "",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {

          }
        },
        {
          text: 'Save',
          handler: data => {

             var postData = {
      			    uid: this.userId,
      			    details: {
                  title: data.title
                }
      			  };

            this.postsService.addAnythingService('/categories', postData);

              let toast = this.toastCtrl.create({
    			      message: 'Category was added successfully, pull to refresh',
    			      duration: 3500
    			    });
			    toast.present();

			    this.listCategories();
          }
        }
      ]
    });
    prompt.present();
  }




  listCategories(){
  	var that = this;
  	this.postsService.listSomethingOnceService('/users').then(snapshot => {
  			         //empty this array first to avoid duplication of content when value changes in the database
  			         //so every time there is a change in the database, empty the array, fetch fresh data from db
  			         //this is because we are fetching data with on('value') inside listPostService()

  			         that.userPostsLists.length = 0;

                      snapshot.forEach(function (childSnapshot) {
                          var data = childSnapshot.val();
                          data['key'] = childSnapshot.key;
                           that.userPostsLists.push(data);
                      });
  			});
  }

  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
  }

  
 
}
