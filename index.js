const characters = ["A", "B", "C", "D", "E", "F", "G",
    "H", "I", "J", "K", "L", "M", "N",
    "O", "P", "Q", "R", "S", "T", "U",
    "V", "W", "X", "Y", "Z", "a", "b",
    "c", "d", "e", "f", "g", "h", "i",
    "j", "k", "l", "m", "n", "o", "p",
    "q", "r", "s", "t", "u", "v", "w",
    "x", "y", "z", "0", "1", "2",
    "3", "4", "5", "6", "7", "8",
    "9", "_", "-"];

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getDatabase, ref, set, push, onValue, get } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyAayfhmohNLXUQsxee0sqbm5oqS_dM1NE8",
    authDomain: "passwordgen-daccf.firebaseapp.com",
    projectId: "passwordgen-daccf",
    storageBucket: "passwordgen-daccf.appspot.com",
    messagingSenderId: "621604319246",
    appId: "1:621604319246:web:55a2ae7d34bea4e9248c5f",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);


const submitSignUp = document.getElementById('submitSignUp');
const submitSignIn = document.getElementById('submitSignIn');

submitSignUp.addEventListener("click", function (event) {
    event.preventDefault()
    const email = document.getElementById('signUpEmail').value;
    const password = document.getElementById('signUpPassword').value;
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            alert("Creating Account ...")
            closeAllDivs();
            updateUserDisplay(user);
        })
        .catch((error) => {
            const errorMessage = error.message;
            alert(errorMessage)
        })
})

submitSignIn.addEventListener("click", function (event) {
    event.preventDefault()
    const email = document.getElementById('signInEmail').value;
    const password = document.getElementById('signInPassword').value;
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("User signed in:", user);
            closeAllDivs();
            updateUserDisplay(user);
        })
        .catch((error) => {
            const errorMessage = error.message;
            alert(errorMessage)
        })
})

// window.signUp = function() {
//     const email = document.getElementById('signUpEmail').value;
//     const password = document.getElementById('signUpPassword').value;
//     createUserWithEmailAndPassword(auth, email, password)
//         .then((userCredential) => {
//             console.log('User signed up:', userCredential.user);
//             closeAuthDiv();
//         })
//         .catch((error) => {
//             console.error('Error signing up:', error);
//         });
// };

// window.signIn = function () {
//     const email = document.getElementById('signInEmail').value;
//     const password = document.getElementById('signInPassword').value;
//     signInWithEmailAndPassword(auth, email, password)
//         .then((userCredential) => {
//             console.log('User signed in:', userCredential.user);
//             closeAuthDiv();
//             loadPasswords();
//         })
//         .catch((error) => {
//             console.error('Error signing in:', error);
//             alert(`Error: ${error.message}`);
//         });
// };

function updateUserDisplay(user){
    const signInUpButtons = document.querySelector('.signInUpButtons');;
    const userSection = document.getElementById('userSection');
    const usernameElement = document.getElementById('username');
    
    if(user){
        const username = user.email.split('@')[0];
        signInUpButtons.style.display = 'none';
        usernameElement.textContent = username;
        userSection.style.display = 'block';
    }else{
        signInUpButtons.style.display = 'block';
        userSection.style.display = 'none';
    }
}


function getRandompass() {
    let randompass = '';
    for (let i = 0; i < 15; i++) {
        let randomindex = Math.floor(Math.random() * characters.length);
        randompass += characters[randomindex];
    }
    return randompass;
}

window.savePassword = function (account, password) {
    const user = auth.currentUser;
    if (user) {
        const passwordRef = ref(db, `users/${user.uid}/passwords`);
        const newpasswordRef = push(passwordRef);

        set(newpasswordRef, {
            account: account,
            password: password,
            timestamp: Date.now()
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
};

window.loadPasswords = function () {
    const user = auth.currentUser;
    const passwordList = document.getElementById('passwordList');

    if (user) {
        console.log('Loading passwords for user:', user.uid);
        passwordList.innerHTML = 'Loading passwords...';
        const passwordRef = ref(db, `users/${user.uid}/passwords`);
        onValue(passwordRef, (snapshot) => {
            passwordList.innerHTML = '';
            if (snapshot.exists()) {
                console.log('Passwords snapshot:', snapshot.val());
                const passwords = snapshot.val();
                for (const key in passwords) {
                    const data = passwords[key];
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `
                        <span class="account-name">${data.account}</span>
                        <span class="password-masked">*******
                            <button onclick="revealPassword('${key}')">👁️</button>
                            <button onclick="copyPassword('${data.password}')">📋</button>
                        </span>
                    `;
                    passwordList.appendChild(listItem);
                }
            } else {
                console.log('No passwords found for user:', user.uid);
                const noPasswordsItem = document.createElement('li');
                noPasswordsItem.textContent = 'No passwords saved yet.';
                passwordList.appendChild(noPasswordsItem);
            }
        });
    } else {
        console.error('Error fetching passwords:', error);
    }
};

window.revealPassword = function (key) {
    const user = auth.currentUser;
    const passwordRef = ref(db, `users/${user.uid}/passwords/${key}`);

    get(passwordRef).then((snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            alert(`Password for ${data.account}: ${data.password}`);
        } else {
            alert('No such user.');
        }
    }).catch((error) => {
        console.log('Error revealing password:', error);
    });
};

window.copyPassword = function (password) {
    navigator.clipboard.writeText(password).then(() => {
        console.log('Password copied to clipboard');
    }).catch(err => {
        console.error('Failed to copy password:', err);
    });
};

window.showSaveDiv = function () {
    closeAllDivs();
    document.getElementById('saveDiv').style.display = 'block';
};

window.ShowSignInDiv = function () {
    closeAllDivs();
    document.getElementById('signInDiv').style.display = 'block';
};

window.ShowSignUpDiv = function () {
    closeAllDivs();
    document.getElementById('signUpDiv').style.display = 'block';
};

window.closeAuthDiv = function () {
    document.getElementById('signUpDiv').style.display = 'none';
    document.getElementById('signInDiv').style.display = 'none';
};

window.closeAllDivs = function () {
    closeAuthDiv();
    closeSaveDiv();
};

window.closeSaveDiv = function () {
    document.getElementById('saveDiv').style.display = 'none';
};

window.savepass = function () {
    const account = document.getElementById('input2').value;
    const password = document.getElementById('input1').value;

    if (!account || !password) {
        alert('Please enter both account and password');
        return;
    }
    savePassword(account, password);
    document.getElementById('input1').value = '';
    document.getElementById('input2').value = '';
};

window.generateAndDisplayPasswords = function () {
    let PassOne = document.getElementById("passone");
    let PassTwo = document.getElementById("passtwo");
    PassOne.textContent = getRandompass();
    PassTwo.textContent = getRandompass();
};

window.toggleSidebar = function () {
    const sidebar = document.getElementById('sidebar');
    const lockIcon = document.querySelector('.lock-icon');
    sidebar.classList.toggle('open');
    lockIcon.classList.toggle('open');
};

window.copyonclickone = function () {
    let PassOne = document.getElementById("passone");

    navigator.clipboard.writeText(PassOne.textContent).then(() => {
        console.log('Password 1 copied to clipboard');
    }).catch(err => {
        console.error('Failed to copy password 1:', err);
    });
};

window.copyonclicktwo = function () {
    let PassTwo = document.getElementById("passtwo");

    navigator.clipboard.writeText(PassTwo.textContent).then(() => {
        console.log('Password 2 copied to clipboard');
    }).catch(err => {
        console.error('Failed to copy password 2:', err);
    });
};

window.onload = function () {
    auth.onAuthStateChanged((user) => {
        const passwordList = document.getElementById('passwordList');
        const lockIcon = document.querySelector('.lock-icon');
    
        if (user) {
            console.log('User signed in:', user);
            loadPasswords();
            lockIcon.style.display = 'block';
            passwordList.innerHTML = '';
            updateUserDisplay(user);

        } else {
            console.log('No user signed in');
            lockIcon.style.display = 'none';
            updateUserDisplay(null);
        }
    });
};

window.signOut = function(){
    auth.signOut().then(()=>{
        alert('signed out')
    }).catch((error)=>{
        alert('sign out error !')
    })
}

document.getElementById('signInBtn').addEventListener('click', ShowSignInDiv);
document.getElementById('signUpBtn').addEventListener('click', ShowSignUpDiv);
