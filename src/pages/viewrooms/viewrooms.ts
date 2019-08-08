import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import * as firebase from 'firebase';
import { fetchData } from '../../app/firebase';
import { BookingPage } from '../booking/booking';
/**
 * Generated class for the ViewroomsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-viewrooms',
  templateUrl: 'viewrooms.html',
})
export class ViewroomsPage {
 key: any;
 rooms: any;
 owners: any;
 uidOwner: any;
 database = firebase.database().ref();

  constructor(public navCtrl: NavController, public navParams: NavParams, private alert: AlertController) {
     
    this.key = this.navParams.data;

    const ref = this.database.child('rooms').orderByKey().equalTo(this.key).on('value', (snap) => {
      if(snap.exists()) {
        this.rooms = fetchData(snap);
        snap.forEach(element => {
          this.uidOwner = element.val().userUid;
        });
        const owner = this.database.child('profile').orderByChild('userUid').equalTo(this.uidOwner).on('value', (snapOwner) => {
          this.owners = fetchData(snapOwner);
        });
      }else {
        this.alert.create({
          title: 'Empty',
          subTitle: 'No Item Found',
          buttons: ['Go back']
        }).present();
      }
      
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewroomsPage');
  }

  bookNow(key){
    this.navCtrl.push(BookingPage, key);
  }


}
