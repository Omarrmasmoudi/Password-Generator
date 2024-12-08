const characters = ["A","B","C","D","E","F","G"
                    ,"H","I","J","K","L","M","N",
                    "O","P","Q","R","S","T","U",
                    "V","W","X","Y","Z","a","b",
                    "c","d","e","f","g","h","i",
                    "j","k","l","m","n","o","p",
                    "q","r","s","t","u","v","w",
                    "x","y","z", "0", "1", "2", 
                    "3", "4", "5", "6", "7", "8",
                     "9","_","-"];







const firebaseConfig = {
    apiKey: "AIzaSyAayfhmohNLXUQsxee0sqbm5oqS_dM1NE8",
    authDomain: "passwordgen-daccf.firebaseapp.com",
    projectId: "passwordgen-daccf",
    storageBucket: "passwordgen-daccf.appspot.com",
    messagingSenderId: "621604319246",
    appId: "1:621604319246:web:55a2ae7d34bea4e9248c5f"
};


firebase.initializeApp(firebaseConfig);


const auth = firebase.auth();
const db = firebase.firestore();

function signUp(){
    const email = document.getElementById('signUpEmail').value;
    const password = document.getElementById('signUpPassword').value;
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential)=>{
            console.log('user signed up: ' , userCredential.user);
        })
        .catch((error)=>{
            console.log.error('Error signing up : ',error);
        })
}



function signIn(email, password) {
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log('User signed in:', userCredential.user);
        })
        .catch((error) => {
            console.error('Error signing in:', error);
        });
}

function getRandompass() {
    let randompass = '';
    for (let i = 0; i < 15; i++) {
        let randomindex = Math.floor(Math.random() * characters.length);
        randompass += characters[randomindex];
    }
    return randompass;
}

function savePassword(account, password) {
    const user = auth.currentUser;
    if (user) {
        db.collection('users').doc(user.uid).collection('passwords').add({
            account: account,
            password: password,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
            console.log('Password saved successfully');
            closeSaveDiv();
            loadPasswords();
        })
        .catch((error) => {
            console.error('Error saving password:', error);
        });
    } else {
        console.error('No user signed in');
    }
}

function loadPasswords() {
    const user = auth.currentUser;
    if (user) {
        db.collection('users').doc(user.uid).collection('passwords').orderBy('timestamp', 'desc').get()
        .then((querySnapshot) => {
            const passwordList = document.getElementById('passwordList');
            passwordList.innerHTML = ''; 
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const listItem = document.createElement('li');
                listItem.textContent = `${data.account}: ${data.password}`;
                passwordList.appendChild(listItem);
            });
        })
        .catch((error) => {
            console.error('Error loading passwords:', error);
        });
    } else {
        console.error('No user signed in');
    }
}

function showSaveDiv(){
    closeAllDivs();
    document.getElementById('saveDiv').style.display = 'block';
}

function ShowSignInDiv(){
    closeAllDivs();
    document.getElementById('signInDiv').style.display = 'block';
}
function ShowSignUpDiv(){
    closeAllDivs();
    document.getElementById('signUpDiv').style.display = 'block';
}


function closeAuthDiv(){
    document.getElementById('signUpDiv').style.display = 'none';
    document.getElementById('signInDiv').style.display = 'none';
}
function closeAllDivs(){
    closeAuthDiv();
    closeSaveDiv();
}
function closeSaveDiv(){
    document.getElementById('saveDiv').style.display = 'none'; 
}


function savepass() {
    const account = document.getElementById('input2').value;
    const password = document.getElementById('input1').value;
    savePassword(account, password);
}



function generateAndDisplayPasswords() {
    let PassOne = document.getElementById("passone");
    let PassTwo = document.getElementById("passtwo");

    PassOne.textContent = getRandompass();
    PassTwo.textContent = getRandompass();
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const lockIcon = document.querySelector('.lock-icon');
    sidebar.classList.toggle('open');
    lockIcon.classList.toggle('open');
}

function copyonclickone() {
    let PassOne = document.getElementById("passone");

    navigator.clipboard.writeText(PassOne.textContent).then(() => {
        console.log('Password 1 copied to clipboard');
    }).catch(err => {
        console.error('Failed to copy password 1: ', err);
    });
}

function copyonclicktwo() {
    let PassTwo = document.getElementById("passtwo");

    navigator.clipboard.writeText(PassTwo.textContent).then(() => {
        console.log('Password 2 copied to clipboard');
    }).catch(err => {
        console.error('Failed to copy password 2: ', err);
    });
}


window.onload = function() {
    auth.onAuthStateChanged((user) => {
        if (user) {
            loadPasswords();
        } else {
            alert('not signed in !')
        }
    });
}
