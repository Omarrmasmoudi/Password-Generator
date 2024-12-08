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




import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getDatabase, ref, set, push, onValue, remove, get, child } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyAayfhmohNLXUQsxee0sqbm5oqS_dM1NE8",
    authDomain: "passwordgen-daccf.firebaseapp.com",
    projectId: "passwordgen-daccf",
    storageBucket: "passwordgen-daccf.appspot.com",
    messagingSenderId: "621604319246",
    appId: "1:621604319246:web:55a2ae7d34bea4e9248c5f",
    databaseURL: "https://passwordgen-daccf-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);






function signUp(){
    const email = document.getElementById('signUpEmail').value;
    const password = document.getElementById('signUpPassword').value;
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential)=>{
            console.log('user signed up: ' , userCredential.user);
            closeAuthDiv();
        })
        .catch((error)=>{
            console.error('Error signing up : ',error);
        });
}



function signIn() {
    const email = document.getElementById('signInEmail').value;
    const password = document.getElementById('signInPassword').value;
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log('User signed in:', userCredential.user);
            closeAuthDiv();
            loadPasswords();
        })
        .catch((error) => {
            console.error('error signing in :',error);
            alert(`Error: ${error.message}`);
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
        const passwordRef = ref(db, `users/${user.uid}/passwords`);
        const newpasswordRef = push (passwordRef);

        set(newpasswordRef, {
            account: account,
            password: password,
            timestamp: Date.now()
        })

        .then(()=>{
            console.log('Password saved successfully');
            closeSaveDiv();
            loadPasswords();
        })
        .catch((error)=>{
            console.error('Error saving password:', error);
        });
    } else {
        console.error('No user signed in');
    }
}

function loadPasswords() {
    const user = auth.currentUser;
    const passwordList = document.getElementById('passwordList');

    if (user) {
        passwordList.innerHTML = 'Loading passwords ...';
        const passwordRef = ref(db,`users/${user.uid}/passwords`);
        onValue(passwordRef,(snapshot)=>{
            passwordList.innerHTML = '';
            if(snapshot.exists()){
                const passwords = snapshot.val();
                for (const key in passwords){
                    const data = passwords[key];
                    const listItem = document.createElement('li');
                    listItem.innerHTML =`
                    <span class="account-name">${data.account}</span>
                    <span class="password-masked">*******
                        <button onclick="revealPassword('${key}')">👁️</button>
                        <button onclick="copyPassword('${data.password}')">📋</button>
                    </span>
                    `;
                    passwordList.appendChild(listItem);
                }
            }else{
                const noPasswordsItem = document.createElement('li');
                noPasswordsItem.textContent = 'No passwords saved yet.';
                passwordList.appendChild(noPasswordsItem);
            }
        });
    } else {
        passwordList.innerHTML = 'Please sign in to view passwords.'
    }
}

function revealPassword(key){
    const user = auth.currentUser;
    const passwordRef = ref(db, `users/${user.uid}/passwords/${key}`);

    get(passwordRef).then ((snapshot)=>{
        if(snapshot.exists()){
            const data = snapshot.val();
            alert(`Password for ${data.account}: ${data.password}`);
        }else{
            alert('no such user');
        }
    }).catch((error)=>{
        console.log('error revealing password :', error)
    });
}
function copyPassword(password){
    navigator.clipboard.writeText(password).then(() => {
        console.log('Password copied to clipboard');
    }).catch(err => {
        console.error('Failed to copy password: ', err);
    });
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

    if(!account || !password){
        alert('Please enter both account and password');
        return;
    }
    savePassword(account, password);
    document.getElementById('input1').value = '';
    document.getElementById('input2').value = '';
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
        const passwordList = document.getElementById('passwordList');
        const lockIcon = document.querySelector('.lock-icon');

        if (user) {
            loadPasswords();
            lockIcon.style.display = 'block';
            passwordList.innerHTML='';
            loadPasswords();
        } else {
            lockIcon.style.display = 'none';
        }
    });
}
