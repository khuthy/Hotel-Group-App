import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ProfilePage } from '../pages/profile/profile';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import * as firebase from 'firebase';
import { firebaseConfig, fetchData } from './firebase';
import { LoginPage } from '../pages/login/login';
import { SignoutPage } from '../pages/signout/signout';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  userEmail: string;

  pages: Array<{title: string, component: any}>;
  profile: any[];
  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();
    firebase.initializeApp(firebaseConfig);

    this.state();
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'History', component: HomePage },
      { title: 'Settings', component: ProfilePage },
      { title: 'Sign Out', component: SignoutPage }
    ];

  }
  state(){
    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        this.userEmail = user.email;
        const ref = firebase.database().ref('profile/'+user.uid);
        ref.on('value', (snap) => {
           this.profile  = fetchData(snap);
            if(this.profile.length > 0) {
              
              this.rootPage = HomePage;

            }else {
              this.rootPage = ProfilePage;
            }
        });

      }else {
        this.rootPage = LoginPage
      }
    })
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
