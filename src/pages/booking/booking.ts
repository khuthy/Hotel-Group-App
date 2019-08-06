import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastCmp, ToastController } from 'ionic-angular';
import * as firebase from 'firebase';
import { fetchData } from '../../app/firebase';
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


 public childCount: number = 0;
 public notNegetiveAllowed: string = '';
 key: any;
 roomDetails: any;

 booking = {
   checkin: '',
   checkout: '',
   adultCount: 0,
   childCount: 0,
   total: 0,
 }
 database = firebase.database().ref();
 
  constructor(
    public navCtrl: NavController,
     public navParams: NavParams, 
     public alertCtrl: AlertController, 
     private toastCtrl: ToastController
     ) {
    this.key = this.navParams.data;
     this.database.child('rooms').orderByKey().equalTo(this.key).on('value', (snap) => {
      if(snap.exists()) {
        
        this.roomDetails = fetchData(snap);
        this.booking.total = this.roomDetails[0].Price;
  
      }else{
        this.alertCtrl.create({
          title: 'Empty',
          subTitle: 'No data to display'
        }).present();
      }
        
    })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BookingPage');
  }

  AdultPlus() {
    
    this.booking.adultCount++;
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
   

    let alert = this.alertCtrl.create({
      title: 'Successfully Booked',
      subTitle: 'You have Successfully Booked a Room. Came back next time for more.',
      buttons: ['Ok']
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
      let sum = parseFloat(dayCheckout)-parseFloat(dayCheckin);
      this.booking.total = this.booking.total + sum + this.booking.childCount + this.booking.adultCount;
      console.log(this.booking.total);


      const ref = this.database.child('booking');
      const recordBooking =  ref.push();

     recordBooking.set({
      Checkin: this.booking.checkin,
      Checkout: this.booking.checkout,
      Adults: this.booking.adultCount,
      Children: this.booking.childCount,
      roomKey: this.key,
      Price: this.booking.total,
      timeStamp: Date()
    })
    alert.present();
    
    }

    
  }
  
  


  

}
