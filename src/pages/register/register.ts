import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, MenuController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import * as firebase from 'firebase';
import { ProfilePage } from '../profile/profile';
/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  registerForm: FormGroup;
  users = {
    email: '',
    password: '',
    confirmPassword: ''
  }

  validation_messages = {
    'email': [
      {type: 'required', message: 'Email address is required.'},
      {type: 'pattern', message: 'Email address is not Valid.'},
      {type: 'validEmail', message: 'Email address already exists in the system.'},
    ],
    'password': [
     {type: 'required', message: 'Password is required.'},
     {type: 'minlength', message: 'password must be atleast 6 char or more.'},
     {type: 'maxlength', message: 'Password must be less than 8 char or less'},
   ],
   'confirmPassword': [
    {type: 'required', message: 'Confirm Password is required.'},
    {type: 'minlength', message: 'Confirm Password  must be atleast 6 char or more.'},
    {type: 'maxlength', message: 'Confirm Password  must be less than 8 char or less'},
    {type: 'pattern', message: 'Password do not match' }
  ]
 
  }
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public forms: FormBuilder,
    public loading: LoadingController,
    public alertCtrl: AlertController,
    public menuCtrl: MenuController
    ) {
      this.registerForm = this.forms.group({
        email: new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-.]+$')])),
        password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(10)])),
        confirmPassword: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(10)]))
      
      })
  }
  ionViewWillEnter() {
    this.menuCtrl.swipeEnable(false);
  }
  ionViewDidLeave() {
    this.menuCtrl.swipeEnable(false);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.menuCtrl.swipeEnable(false);
  }

  RegisterUser() {

    if(this.registerForm.valid) {
      if(this.users.password == this.users.confirmPassword) {
        
      let loaders = this.loading.create({
        duration: 2000,
        content: 'Please wait...',
        
    });

    let alert = this.alertCtrl.create({
       title: 'Registration',
       subTitle: 'Successfully Registered in the app',
       buttons: ['ok']
    });
    loaders.present();
    
    
      firebase.auth().createUserWithEmailAndPassword(this.users.email, this.users.password).then(result => {
        alert.present();
        this.navCtrl.push(ProfilePage);
      }).catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        this.alertCtrl.create({
          title: errorCode,
          subTitle: errorMessage,
          buttons: ['Try Again']
        }).present()
        // ...
      });

      }else {
        this.alertCtrl.create({
          title: 'Password Error',
          subTitle: 'Password do not match.',
          buttons: ['Try Again']
        }).present()

      }

    }else {

      this.alertCtrl.create({
        title: 'Error Detected',
        subTitle: 'Your fields are Empty.',
        buttons: ['Try Again']
      }).present()

    }

  }
  openLoginPage() {
    this.navCtrl.push(LoginPage)
  }

}
