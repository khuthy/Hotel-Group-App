import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import * as firebase from 'firebase';
import { fetchData } from '../../app/firebase';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { LoginPage } from '../login/login';
import { PaymentPage } from '../payment/payment';
/**
 * Generated class for the BookingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-booking',
  templateUrl: 'booking.html',
})
export class BookingPage {

  checkDate;

 public childCount: number = 0;
 public notNegetiveAllowed: string = '';
 key: any;
 roomDetails: any;
 bookingForm: FormGroup;

 booking = {
   checkin: '',
   checkout: '',
   adultCount: 1,
   childCount: 0,
   total: 0,
   userUid: ''
 }
 database = firebase.database().ref();
 MAX: number;
 profile_key: any;

 validation_messages = {
  'checkin': [
    {type: 'required', message: 'Check In date is required.'}
  ],
  'checkout': [
   {type: 'required', message: 'Check Out date is required.'}
  
 ]

}
 
  constructor(
    public navCtrl: NavController,
     public navParams: NavParams, 
     public alertCtrl: AlertController, 
     private toastCtrl: ToastController,
     public forms: FormBuilder,
     private loadingCtrl: LoadingController
     ) {
      const check = new Date();
      let year = check.getFullYear();
      let month = check.getMonth();
      let days = check.getDay();
  
     this.checkDate = year + '-' + days + '-' + month;

      this.bookingForm = this.forms.group({
        checkout: new FormControl('', Validators.compose([Validators.required])),
        checkin: new FormControl('', Validators.compose([Validators.required]))
      
      })
    var user = firebase.auth().currentUser;

    if(user) {
      this.key = this.navParams.data;
      this.booking.userUid = user.uid;
      
     this.database.child('rooms').orderByKey().equalTo(this.key).on('value', (snap) => {
      if(snap.exists()) {
        
        this.roomDetails = fetchData(snap);
        this.booking.total = this.roomDetails[0].Price;
        this.MAX = this.roomDetails[0].guest;
  
      }else{
        this.alertCtrl.create({
          title: 'Empty',
          subTitle: 'No data to display'
        }).present();
      }
        
    });
    }else {
      this.navCtrl.setRoot(LoginPage)
    }

    

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BookingPage');
  }

  AdultPlus() {
    
    this.booking.adultCount++;
    if((this.booking.childCount + this.booking.adultCount) > this.MAX) {
      this.booking.adultCount--;
      this.toastCtrl.create({
        position: 'top',
        message: 'Only '+this.MAX+' Guests are allowed.',
        duration: 3000      
      }).present()
      
    }
  }

  AdultMinus() {
    this.booking.adultCount--;
    if(this.booking.adultCount < 0) {
      this.booking.adultCount = 0;
      this.toastCtrl.create({
        position: 'top',
        message: 'Count can\'t be less than zero',
        duration: 3000      
      }).present()
    }
  }

  childPlus() {
    this.booking.childCount++;
    if((this.booking.childCount + this.booking.adultCount) > this.MAX) {
      this.booking.childCount--;
      this.toastCtrl.create({
        position: 'top',
        message: 'Only '+this.MAX+' Guests are allowed.',
        duration: 3000      
      }).present()
      
    }
    
  }
  childMinus() {
    this.booking.childCount--;
    if(this.booking.childCount < 0) {
      this.booking.childCount = 0;
      this.toastCtrl.create({
        position: 'bottom',
        message: 'Count can\'t be less than zero',
        duration: 3000      
      }).present()

    }
  }

  createBooking() {
   
if(this.bookingForm.valid){
    let loading = this.loadingCtrl.create({
      content: '',
      duration: 300
    })
    
      let monthCheckIn = this.booking.checkin.charAt(5)+this.booking.checkin.charAt(6);
     let dayCheckin = this.booking.checkin.charAt(8)+this.booking.checkin.charAt(9);

     let monthCheckout = this.booking.checkout.charAt(5)+this.booking.checkout.charAt(6);
     let dayCheckout = this.booking.checkout.charAt(8)+this.booking.checkout.charAt(9);

     
     
     
     //calculations

     if(parseFloat(monthCheckout)-parseFloat(monthCheckIn)<0 || parseFloat(dayCheckout)-parseFloat(dayCheckin)<=0 && monthCheckIn == monthCheckout){
      const alert =  this.alertCtrl.create({
        title: 'Incorrect Date',
        subTitle: 'Please select the future Date',
        buttons: ['Try again']
        
      });
      alert.present();
     }else {
      
      loading.present();
      let sum = parseFloat(dayCheckout)-parseFloat(dayCheckin);
      this.booking.total = Math.floor(this.booking.total * (sum + this.booking.childCount + this.booking.adultCount));
      console.log(this.booking.total);


      const ref = this.database.child('booking');
      const recordBooking =  ref.push();

      this.database.child('profile').orderByChild('userUid').equalTo(this.booking.userUid).on('value', (snap) => {
        this.profile_key  = fetchData(snap)[0].key;
        console.log(this.profile_key);
        
        
     });

     recordBooking.set({
      Checkin: this.booking.checkin,
      Checkout: this.booking.checkout,
      Adults: this.booking.adultCount,
      Children: this.booking.childCount,
      roomKey: this.key,
      userUid: this.booking.userUid,
      userProfileKey: this.profile_key,
      Price: this.booking.total,
      timeStamp: Date()
    })

    this.navCtrl.push(PaymentPage, this.booking.total);

    
}

  
  

}   
else {
  let alert = this.alertCtrl.create({
    title: 'error detected.',
    subTitle: 'Your Inputs can\'t be empty',
    buttons: ['Try again']
  })
  alert.present();

}
  

}

}
