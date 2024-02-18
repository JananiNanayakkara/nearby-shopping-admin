// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
	apiKey: 'AIzaSyCrdsRgFPfNfKMqWTP5K2PATIYev2QhDMg',
	authDomain: 'nearby-shopping.firebaseapp.com',
	projectId: 'nearby-shopping',
	storageBucket: 'nearby-shopping.appspot.com',
	messagingSenderId: '834725124762',
	appId: '1:834725124762:web:d47a5e41a51ec3f2301d23',
};

let app;
if (firebase.apps.length === 0) {
	app = firebase.initializeApp(firebaseConfig);
} else {
	app = firebase.app();
}

const auth = firebase.auth();
const db = firebase.firestore();

export { auth, db };
