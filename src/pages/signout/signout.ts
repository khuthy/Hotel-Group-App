import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as firebase from 'firebase';
import { LoginPage } from '../login/login';
/**
 * Generated class for the SignoutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signout',
  templateUrl: 'signout.html',
})
export class SignoutPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.SignOut();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignoutPage');
  }

  SignOut(){
    firebase.auth().signOut().then((resp) => {
      console.log('logged out', resp);
      this.navCtrl.setRoot(LoginPage)
      
    }).catch((err) => {
      console.log(err);
      
    })
  }
}
