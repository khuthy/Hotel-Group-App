export const firebaseConfig = {
    apiKey: "AIzaSyCc99DruzMRH31PPZn3JdSTsPFjFsgM3EA",
    authDomain: "admin-user-hotel-app.firebaseapp.com",
    databaseURL: "https://admin-user-hotel-app.firebaseio.com",
    projectId: "admin-user-hotel-app",
    storageBucket: "admin-user-hotel-app.appspot.com",
    messagingSenderId: "489535594102",
    appId: "1:489535594102:web:e487ba00e62a22e3"
  };

  export const fetchData = snapshots => {
    let hotels = [];

    snapshots.forEach(element => {
        let item = element.val();
        item.key = element.key;
        hotels.push(item);
    });
    return hotels;
}