let jumped = false;
let jumped2 = false;
let destroying1 = false;
let destroying2 = false;

let isGettingKeybind = false;
let keybindFor;
let shit = [
document.getElementById("ju1"),
document.getElementById("le1"),
document.getElementById("ri1"),
document.getElementById("ju2"),
document.getElementById("le2"),
document.getElementById("ri2"),
document.getElementById("de1"),
document.getElementById("de2"),
]

function shitloop(x){
for (let shite = 0; shite<shit.length; shite++){
        shit[shite].style.backgroundColor = "black";
}
        try{
        x.style.backgroundColor = "pink";
        }catch{
        }
}

// document.getElementById("ak").addEventListener("click",(event)=>{
//     let jumpbuttonconfig = document.getElementById("wagaegs").value;

//     if (jumpbuttonconfig.length == 1){
//     Utils.keybindsPlayer1.jump = jumpbuttonconfig.toLowerCase();
//     }else{
//      Utils.keybindsPlayer1.jump = jumpbuttonconfig;
//     }
    
//     alert(jumpbuttonconfig)
// });document.getElementById("jumpPlayer1")
document.getElementById("jumpPlayer1").addEventListener("click",(event)=>{
    isGettingKeybind = true;
    keybindFor = "jump1"
    shitloop( shit[0])
    
})
document.getElementById("leftPlayer1").addEventListener("click",(event)=>{
    isGettingKeybind = true;
    keybindFor = "left1"
    shitloop( shit[1])
})
document.getElementById("rightPlayer1").addEventListener("click",(event)=>{
    isGettingKeybind = true;
    keybindFor = "right1"
    shitloop( shit[2])
})
document.getElementById("jumpPlayer2").addEventListener("click",(event)=>{
    isGettingKeybind = true;
    keybindFor = "jump2"
    shitloop( shit[3])
})
document.getElementById("leftPlayer2").addEventListener("click",(event)=>{
    isGettingKeybind = true;
    keybindFor = "left2"
    shitloop( shit[4])
})
document.getElementById("rightPlayer2").addEventListener("click",(event)=>{
    isGettingKeybind = true;
    keybindFor = "right2"
    shitloop( shit[5])
})
document.getElementById("destroyPlayer1").addEventListener("click",(event)=>{
    isGettingKeybind = true;
    keybindFor = "destroy1"
    shitloop( shit[6])
})
document.getElementById("destroyPlayer2").addEventListener("click",(event)=>{
    isGettingKeybind = true;
    keybindFor = "destroy2"
    shitloop( shit[7])
})
document.addEventListener("keydown", (event) => {
let x = event.key.toUpperCase();
if (x == " "){
    x = "SPACE";
}
    if (isGettingKeybind) {
        // Utils.keybindsPlayer1.jump
        isGettingKeybind = false;
        switch (keybindFor){
            case "jump1":
                Utils.keybindsPlayer1.jump = event.key;
                document.getElementById("ju1").innerHTML = x
            break; 
            case "jump2":
                Utils.keybindsPlayer2.jump = event.key;
                document.getElementById("ju2").innerHTML = x
                break; 
            case "left1":
                Utils.keybindsPlayer1.moveLeft = event.key;
                document.getElementById("le1").innerHTML = x
                break; 
            case "left2":
                Utils.keybindsPlayer2.moveLeft = event.key;
                document.getElementById("le2").innerHTML = x
                break; 
            case "right1":
                Utils.keybindsPlayer1.moveRight = event.key;
                document.getElementById("ri1").innerHTML = x
                break; 
            case "right2":
                Utils.keybindsPlayer2.moveRight = event.key;
                document.getElementById("ri2").innerHTML = x
                break; 
            case "destroy1":
                Utils.keybindsPlayer2.destroy = event.key;
                document.getElementById("de1").innerHTML = x
                break; 
            case "destroy2":
                Utils.keybindsPlayer2.destroy= event.key;
                document.getElementById("de2").innerHTML = x
                break; 
        }
        shitloop(shit[9]);
    }
    //alert(event.key)
});
document.getElementById('settings').addEventListener("click", () => {
    document.getElementById("player1").classList.toggle('toggleSettingsPlayer1');
    document.getElementById("player2").classList.toggle('toggleSettingsPlayer2');
});

window.addEventListener("resize", (event)=> {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.getElementById("menu").classList.add('disableTransitions');
    let playerKeybindMenu = document.getElementsByClassName('playerKeybindMenu');
    playerKeybindMenu[0].classList.add('disableTransitions');
    playerKeybindMenu[1].classList.add('disableTransitions');
    let buttons = document.getElementsByClassName('buttonItems');
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.add('disableTransitions');
    }
    setTimeout(()=> {
        document.getElementById("menu").classList.remove('disableTransitions');
        playerKeybindMenu[0].classList.remove('disableTransitions');
        playerKeybindMenu[1].classList.remove('disableTransitions');
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove('disableTransitions');
        }
    }, 1);
});

document.addEventListener("keyup", (event) => {
    const eventKey = event.key.toLowerCase();
    if (eventKey === Utils.keybindsPlayer1.jump) jumped = false;
    if (eventKey === Utils.keybindsPlayer2.jump) jumped2 = false;
    if (eventKey === Utils.keybindsPlayer1.destroy) destroying1 = false;
    if (eventKey === Utils.keybindsPlayer2.destroy) destroying2 = false;
    Utils.inputStates[eventKey] = false;
});

document.addEventListener("mousedown", (event) => {
    Utils.inputStates[event.button] = true;
});

document.addEventListener("mousedown", (event) => {
    Utils.inputStates[event.button] = false;
});

document.addEventListener("mousemove", (event) => {
    Utils.mouse.x = event.clientX;
    Utils.mouse.y = event.clientY;
});