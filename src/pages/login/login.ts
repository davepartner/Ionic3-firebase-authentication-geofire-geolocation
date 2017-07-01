import { Component } from '@angular/core';
import { NavController, ToastController, LoadingController,AlertController } from 'ionic-angular';

import { TranslateService } from 'ng2-translate/ng2-translate';

import { MainPage } from '../../pages/pages';
import { SignupPage } from '../signup/signup';
//import { User } from '../../providers/user';
import { UsersService } from '../../providers/users-service/users-service';
import * as firebase from 'firebase';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [UsersService]
})
export class LoginPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type

  email: string;
  password: string;
  account: {email: string, password: string} = {
    email: this.email,
    password: this.password
  };

  // Our translated text strings
  private loginErrorString: string;

  constructor(public navCtrl: NavController,
  			  public alertCtrl: AlertController,
              public toastCtrl: ToastController,
              public translateService: TranslateService,
              public usersService: UsersService,
              public loadingCtrl: LoadingController) {

    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })
  }

redirectToSignup(){

	this.navCtrl.push(SignupPage);
}
  submitLogin(){

var that = this;

var loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 3000
    });
    loader.present();


  	this.usersService.loginUser(this.email, this.password).then(authData => {
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



showForgotPassword(){

	 let prompt = this.alertCtrl.create({
      title: 'Enter Your Email',
      message: "A new password will be sent to your email",
      inputs: [
        {
          name: 'recoverEmail',
          placeholder: 'you@example.com'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Submit',
          handler: data => {


            //add preloader
            let loading = this.loadingCtrl.create({
				dismissOnPageChange: true,
				content: 'Reseting your password..'
			});
			 loading.present();
             //call usersservice
            this.usersService.forgotPasswordUser(data.recoverEmail).then(() => {
            	   //add toast
            	     loading.dismiss().then(() => {
            	     	//show pop up
            	     		let alert = this.alertCtrl.create({
					      title: 'Check your email',
					      subTitle: 'Password reset successful',
					      buttons: ['OK']
					    });
					    alert.present();
            	     })

            	}, error => {
            		//show pop up
            		loading.dismiss().then(() => {
				  		let alert = this.alertCtrl.create({
					      title: 'Error resetting password',
					      subTitle: error.message,
					      buttons: ['OK']
					    });
					    alert.present();
					 })


            	});
          }
        }
      ]
    });
    prompt.present();
  }



/*
  // Attempt to login in through our User service
  doLogin() {
    this.user.login(this.account).subscribe((resp) => {
      this.navCtrl.push(MainPage);
    }, (err) => {
      this.navCtrl.push(MainPage);
      // Unable to log in
      let toast = this.toastCtrl.create({
        message: this.loginErrorString,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  } */
}
