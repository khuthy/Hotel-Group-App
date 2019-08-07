import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, MenuController } from 'ionic-angular';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import * as firebase from 'firebase';
import { HomePage } from '../home/home';
import { RegisterPage } from '../register/register';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loginForm: FormGroup;

  users = {
    email: '',
    password: ''
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
   ]
 
  }

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public forms: FormBuilder,
    public loading: LoadingController,
    public alertCtrl: AlertController,
    public menuCtrl: MenuController,
    
    ) {
      
    this.loginForm = this.forms.group({
      email: new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-.]+$')])),
      password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(10)]))
    
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

  login() {
    if(this.loginForm.valid) {

      let loaders = this.loading.create({
       
        content: 'Please wait...',
         duration: 2000
    });

   
    loaders.present();
    
    
    firebase.auth().signInWithEmailAndPassword(this.users.email, this.users.password).then(result => {
        
        
        this.navCtrl.setRoot(HomePage);
        
        
      }).catch((error) => {
        // Handle Errors here.
        let errorCode = error.code;
        let errorMessage = error.message;
        let errors = this.alertCtrl.create({
          title: errorCode,
          subTitle: errorMessage,
          buttons: ['Try Again']
        })
        errors.present();
        // ...
      });
    }else {
      let errors = this.alertCtrl.create({
        title: 'Empty Field Detected',
        subTitle: 'email and password can\'t be empty',
        buttons: ['Try Again']
      })
      errors.present();
    }
  }

  openRegisterPage() {
    this.navCtrl.push(RegisterPage)
  }

  facelogin() {
    firebase.auth().signInWithPopup(new this.facelogin()).then(resp => {

    }).catch(err => {
      console.log(err);
      
    })
  }

}
