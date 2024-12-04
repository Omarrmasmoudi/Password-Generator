const characters = ["A","B","C","D",
    "E","F","G","H","I","J","K",
    "L","M","N","O","P","Q","R",
    "S","T","U","V","W","X","Y","Z",
    "a","b","c","d","e","f","g","h",
    "i","j","k","l","m","n","o","p",
    "q","r","s","t","u","v","w","x",
    "y","z", "0", "1", "2", "3", "4",
    "5", "6", "7", "8", "9","_","-"];



function getRandompass(){
    
    let randompass=''
    for (let i=0;i<15;i++){
        let randomindex = Math.floor(Math.random()*characters.length);
        randompass += characters[randomindex]
    };
   return randompass
}

function savepass(){
    
}
function showSaveDiv() {
    document.getElementById('saveDiv').style.display = 'block';
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
function copyonclicktwo(){
    let PassTwo = document.getElementById("passtwo");

    navigator.clipboard.writeText(PassTwo.textContent).then(() => {
        console.log('Password 2 copied to clipboard');
    }).catch(err => {
        console.error('Failed to copy password 2: ', err);
    });
}
