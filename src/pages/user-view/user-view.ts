import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { UserEditPage } from '../user-edit/user-edit';
import { UsersService } from '../../providers/users-service/users-service';
import * as firebase from 'firebase';
//import { Items } from '../../providers/providers';

@Component({
  selector: 'page-user-view',
  templateUrl: 'user-view.html',
  providers: [UsersService]
})
export class UserViewPage {
  item: any;
public userDislplayName : any;
public userPhotoUrl : any;
public userCity : any;
public userState : any;
public userSkills : any;
public userPhone : any;
public myUserId : any;
public userCountry : any;
public userAbout : any;

  constructor(public alertCtrl : AlertController,public toatCtrl: ToastController, public navCtrl: NavController, public navParams: NavParams, public usersService:UsersService) {
    
    this.myUserId = firebase.auth().currentUser.uid; //current user id
    
    if(navParams.get('key')){
		this.myUserId = this.navParams.get('key') ; //
		
	}
	
	

this.displayUser(this.myUserId);


    
  }
  
  
  
displayUser(theUserId){
	
	var that = this;
	
	this.usersService.viewUser(theUserId).then(snapshot => {
	
		 //get user photo
		 if(snapshot.val()){
		that.userPhotoUrl = snapshot.val().photo || ''; //get user photo
	   that.userDislplayName= snapshot.val().first_name + ' ' +snapshot.val().last_name ; 
	   that.userSkills= snapshot.val().skills || ''; 
	   that.userAbout= snapshot.val().about || ''; 
	   that.userCity= snapshot.val().city || ''; 
	   that.userState= snapshot.val().state || ''; 
	   that.userPhone= snapshot.val().phone || ''; 
	   that.userCountry= snapshot.val().country || ''; 
	   //that.userCountry= snapshot.val().username || ''; 
	   
	   console.log("This is the user name: "+ that.userDislplayName);
		 }
	})
}

editProfile(){
	
	this.navCtrl.push(UserEditPage);
}

logUserOut(){
	
	//pop to confirm if user really wishes to logout
	
	
	 let confirm = this.alertCtrl.create({
      title: 'Are you sure you want to logout?',
      message: '',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            //do nothing 
          }
        },
        {
          text: 'Yes',
          handler: () => {
            //call user logout service
	this.usersService.logoutUser().then(() => {
		//show toast before redirecting 
		this.navCtrl.setRoot(LoginPage);
	});
          }
        }
      ]
    });
    confirm.present();
    
    
	
}

}
