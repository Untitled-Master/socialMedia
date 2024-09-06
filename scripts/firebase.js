const firebaseConfig = {
    apiKey: "AIzaSyDk3RLkM4f732rtIaaWfIQAx3IMvqamJZ0",
    authDomain: "crss-58a32.firebaseapp.com",
    databaseURL: "https://crss-58a32-default-rtdb.firebaseio.com",
    projectId: "crss-58a32",
    storageBucket: "crss-58a32.appspot.com",
    messagingSenderId: "907816297594",
    appId: "1:907816297594:web:8995e1aa9ee37b12dc87c3",
    measurementId: "G-2TRNZD1NZK"
  };

firebase.initializeApp(firebaseConfig);

const loginBtn = document.getElementById('login-btn');

// Add login event
loginBtn.addEventListener('click', e => {
    // Firebase Google Auth provider
    var provider = new firebase.auth.GoogleAuthProvider();
    
    // Sign in
    firebase.auth().signInWithPopup(provider).then(result => {
        console.log(result);
        console.log("User signed in");
        let name = result.user.displayName;
        let email = result.user.email;
        let pfp = result.user.photoURL;
        let uid = result.user.uid;
        let phoneNumber = result.user.phoneNumber;
        let providerData = result.user.providerData; // Note: No need for closing parenthesis here

        // Save user data to localStorage
        localStorage.setItem('userName', name);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userPfp', pfp);
        localStorage.setItem('userId', uid);
        localStorage.setItem('userPhoneNumber', phoneNumber);
        localStorage.setItem('userProviderData', JSON.stringify(providerData)); // Convert to JSON string

        // Redirect to home.html
        window.location.href = "feed.html";
        
    }).catch(error => {
        console.log(error);
        alert("Error: " + error.message);
    });
});

