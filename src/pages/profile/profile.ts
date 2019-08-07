import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, LoadingController, AlertController } from 'ionic-angular';
import * as firebase from 'firebase';
import { Users } from '../../app/users';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';
import { fetchData } from '../../app/firebase';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  profileFormValidation: FormGroup;
  users = {} as Users;
  profileAlreadyExists: any;
  database: any;
  count: number;
  validation_messages = {
    'username': [
      {type: 'required', message: 'Username is required.'}
    ],
    'contact': [
     {type: 'required', message: 'contact is required.'},
     {type: 'minlength', message: 'contact must be atleast 10 numbers'},
     {type: 'maxlength', message: 'contact must be less than 12 with country Code'}
   ],
   'bio':  [
    {type: 'required', message: 'Bio is required.'}
  ]

 
  }

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public forms: FormBuilder,
    public menuCtrl: MenuController,
    private camera: Camera,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController
    ) {
     
      this.users.image = '../../assets/imgs/team-avatar.jpg';

      this.profileFormValidation = this.forms.group({
      username: new FormControl('', Validators.required),
      contact: new FormControl('', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(12)])),
      bio: new FormControl('', Validators.compose([Validators.required, Validators.minLength(7), Validators.maxLength(50)]))
    
    })

   var user = firebase.auth().currentUser;
    if(user) {
      this.users.uid = user.uid;
      this.database = firebase.database().ref('profile/'+ this.users.uid);
      this.database.on('value', (snap) => {
        this.count = fetchData(snap).length;
        if(snap.exists()) {

        this.users.image = fetchData(snap)[0].Image;
        this.users.contact = fetchData(snap)[0].Contact;
        this.users.username = fetchData(snap)[0].Username;
        this.users.bio = fetchData(snap)[0].Bio;
        }else {
          console.log('create new profile');
          
        }
     
      })
    }else {
      this.navCtrl.setRoot(LoginPage);
    }


  }
  ionViewWillEnter() {
    this.menuCtrl.swipeEnable(false);
  }
  ionViewDidLeave() {
    this.menuCtrl.swipeEnable(true);
  }
 

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    var user = firebase.auth().currentUser;
    if(user) {
      this.users.uid = user.uid;
      
      
    }else {
      this.navCtrl.setRoot(LoginPage)
    }
  }
  takePhoto(sourcetype: number) {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      sourceType: sourcetype,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      targetHeight: 500,
      targetWidth: 500
    }
    
    this.camera.getPicture(options).then((captureDataUrl) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64 (DATA_URL):
     let imageUploaded = 'data:image/jpeg;base64,' + captureDataUrl;
     
     this.users.image = imageUploaded;
     
    }, (err) => {
     // Handle error
     console.log(err);
     
    });
  }
  upload() {
    let loaders = this.loadingCtrl.create({
      content: 'Uploading, Please wait...',
      duration: 300
    });
    let storageRef = firebase.storage().ref();

    const filename = Math.floor(Date.now() / 1000);

    const imageRef = storageRef.child(`profile/${filename}.jpg`);
    loaders.present()
    imageRef.putString(this.users.image, firebase.storage.StringFormat.DATA_URL)
    .then((snapshot) => {
     console.log(snapshot);
     
    })
  }

  SaveProfile(users: Users){

    if(this.count > 0) {
        console.log('save new profile');
        
    }else {
      console.log('edit existing profile');
      
    }

    
    
    if(this.profileFormValidation.valid) {
      

      this.upload();
    
      const ref = this.database.push();

      let alertSuccess = this.alertCtrl.create({
        title: 'Profile Created',
        subTitle: 'Successfully created a profile.',
        buttons: ['Ok']
      })

      ref.set({
        Image: this.users.image,
        Contact: this.users.contact,
        Username: this.users.username,
        Bio: this.users.bio,
        timestamp: Date(),
       
      
      })
      alertSuccess.present();
      this.navCtrl.setRoot(HomePage);

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
