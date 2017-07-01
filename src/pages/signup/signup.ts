import { Component } from '@angular/core';
import { NavController, ToastController, LoadingController } from 'ionic-angular';

import { TranslateService } from 'ng2-translate/ng2-translate';

import { MainPage } from '../../pages/pages';
import { UsersService } from '../../providers/users-service/users-service';
import * as firebase from 'firebase';

/*
  Generated class for the Signup page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
  providers: [UsersService]
})
export class SignupPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  public skills : string;
  public email : any;
  public phone : any;
  public password : any;
  public first_name : any;
  public last_name : any;
  public city : any;
  public state : any;
  public country : any;



  // Our translated text strings
  private signupErrorString: string;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController,
              public toastCtrl: ToastController,
              public translateService: TranslateService, public usersService: UsersService) {

    this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
      this.signupErrorString = value;
    })
  }






doSignup(){
var   account = {
      first_name: this.first_name,
      last_name: this.last_name || '',
      skills: this.skills || '',
      email: this.email,
      phone: this.phone || '',
      password: this.password,
      city: this.city || '',
      state: this.state || '',
      country: this.country || ''

    };
var that = this;

var loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 3000
    });
    loader.present();

console.log(account);


  	this.usersService.signUpUser(account).then(authData => {
  		//successful
  		loader.dismiss();
  		that.navCtrl.setRoot(MainPage);

  	}, error => {
loader.dismiss();
     // Unable to log in
      let toast = this.toastCtrl.create({
        message: error,
        duration: 3000,
        position: 'top'
      });
      toast.present();

that.password = ""//empty the password field

  	});

    
  }







/*
  doSignup() {

  var account = {
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      phone: this.phone,
      password: this.password
    };

    // Attempt to login in through our User service
    this.user.signup(this.account).subscribe((resp) => {


      this.navCtrl.push(MainPage);
    }, (err) => {

      this.navCtrl.push(MainPage); // TODO: Remove this when you add your signup endpoint

      // Unable to sign up
      let toast = this.toastCtrl.create({
        message: this.signupErrorString,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  } */
}
