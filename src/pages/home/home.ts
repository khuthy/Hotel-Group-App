import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import * as firebase from 'firebase';
import { ProfilePage } from '../profile/profile';
import { fetchData } from '../../app/firebase';
import { ViewroomsPage } from '../viewrooms/viewrooms';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  notFound: string = '';
  database = firebase.database().ref();
  hotels: any;
/* 3 cat */
  doubleRoom: any;
  singleRooms: any;
  luxuryRooms: any;

  constructor(public navCtrl: NavController, public loading: LoadingController) {

    this.loading.create({
      duration: 300,
      content: 'Loading...'
    }).present();
    const hotels = this.database.child('hotels');
    const rooms = this.database.child('rooms');

    hotels.on('value', snap => {
      if(snap.exists()) {
        this.hotels = fetchData(snap);
        this.notFound = '';
      }else {
        this.notFound = "Hotel not Found";
      }
      
    });

    rooms.orderByChild('RoomType').equalTo('Double').on('value', (doubleRooms) => {
      if(doubleRooms.exists()) {
        this.doubleRoom = fetchData(doubleRooms);
      }
    });
    rooms.orderByChild('RoomType').equalTo('Single').on('value', (Single) => {
      if(Single.exists()) {
        this.singleRooms = fetchData(Single);
      }else {
        this.singleRooms = "Still developing";
      }
    });
    rooms.orderByChild('RoomType').equalTo('Luxury King').on('value', (Luxury) => {
      if(Luxury.exists()) {
        this.luxuryRooms = fetchData(Luxury);
      }else {
        this.luxuryRooms = "still developing";
      }
    });

  }
  openPayment() {
    this.navCtrl.push(ProfilePage)
  }
  roomDetails(key) {
    this.navCtrl.push(ViewroomsPage, key)
  }



}
