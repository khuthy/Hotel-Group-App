import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import * as firebase from 'firebase';
import { fetchData } from '../../app/firebase';
import { LoginPage } from '../login/login';
import { ConfirmedMessagePage } from '../confirmed-message/confirmed-message';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
/**
 * Generated class for the PaymentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {

  paymentForm: FormGroup;

 card = {
   name: '',
   number: null,
   expiryDate: '',
   securityCode: null,
   userUid: ''



 }
 key: any;
 database: any;
 buttonNameUpdate: boolean;
 buttonNameSave: boolean;
 total: number;

 validation_messages = {
  'name': [
    {type: 'required', message: 'Name of the Card holder is required.'}
  ],
  'number': [
   {type: 'required', message: 'Check Out date is required.'},
   {type: 'minLength', message: 'Your card number must be atleast 16 numbers.'},
   {type: 'maxLength', message: 'Your card number is too long.'},
  
 ],
 'expiryDate': [
  {type: 'required', message: 'Expiry date is required.'}
 
],
 'securityCode': [
  {type: 'required', message: 'Security Code is required.'}
 
],


}

  constructor(
    public navCtrl: NavController, 
    public forms: FormBuilder,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController

    ) {
      this.paymentForm = this.forms.group({
        name: new FormControl('', Validators.compose([Validators.required])),
        number: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(16), Validators.maxLength(16)])),
        expiryDate: new FormControl('', Validators.compose([Validators.required])),
        securityCode: new FormControl('', Validators.compose([Validators.required])),
      })
    

    var user = firebase.auth().currentUser;
    if(user) {
      this.card.userUid = user.uid;
      this.database = firebase.database().ref();
      this.total = this.navParams.data;
      this.database.child('payment').orderByChild('userUid').equalTo(user.uid).on('value', (snap) => {
       
        if(snap.exists()) {
          this.key = fetchData(snap)[0].key;
          console.log(this.key);
          
        this.card.number = fetchData(snap)[0].number;
        this.card.securityCode = fetchData(snap)[0].securityCode;
        this.card.expiryDate = fetchData(snap)[0].expiryDate;
        this.card.name = fetchData(snap)[0].name;
        this.buttonNameUpdate = true;
        }else {
          console.log('create new payments');
          this.buttonNameSave = true;
          
        }
     
      })
    }else {
      this.navCtrl.setRoot(LoginPage);
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentPage');
  }
  payment(){
    let loaders = this.loadingCtrl.create({
      content: 'Processing Payment...',
      duration: 3000
    });
    
    
   if(this.paymentForm.valid) {
      
    loaders.present();
      
      
      const ref = this.database.child('payment').push();

  

      ref.set({
        number: this.card.number,
        securityCode: this.card.securityCode,
        expiryDate: this.card.expiryDate,
        name: this.card.name,
        userUid: this.card.userUid,
        timestamp: Date(),
       });

       setTimeout(() => {
          this.navCtrl.setRoot(ConfirmedMessagePage);
       }, 3000)
      

    }else {
      let alert = this.alertCtrl.create({
        title: 'error detected.',
        subTitle: 'Your Inputs can\'t be empty',
        buttons: ['Try again']
      })
      alert.present();
    } 
   
  }
  
  updatePayment() {
    let loaders = this.loadingCtrl.create({
      content: 'Processing Payment...',
      duration: 300
    });
    let alertSuccess = this.alertCtrl.create({
      title: 'Profile Updated',
      subTitle: 'You have successfully updated your profile',
      buttons: ['Ok']
    })
    if(this.paymentForm.valid) {
      loaders.present();
       firebase.database().ref('payment/'+ this.key).update({
        number: this.card.number,
        securityCode: this.card.securityCode,
        expiryDate: this.card.expiryDate,
        name: this.card.name,
        userUid: this.card.userUid,
        timestamp: Date(),
    });
    setTimeout(() => {
      this.navCtrl.setRoot(ConfirmedMessagePage);
   }, 3000)
  
    alertSuccess.present();
    }else {
      let alert = this.alertCtrl.create({
        title: 'error detected.',
        subTitle: 'Your Inputs can\'t be empty',
        buttons: ['Try again']
      })
      alert.present();
    }
  }



}
