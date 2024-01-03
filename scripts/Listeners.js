let jumped = false;
let jumpbuttonconfig;

document.getElementById("ak").addEventListener("click",(event)=>{
    jumpbuttonconfig = document.getElementById("wagaegs").value;

    if (jumpbuttonconfig/1){
    jumpbuttonconfig = "Digit"+jumpbuttonconfig
    }else{
    jumpbuttonconfig = "Key"+jumpbuttonconfig
    }
    Utils.keybinds = {
    "jump": jumpbuttonconfig
    }
    alert(jumpbuttonconfig)
});
document.addEventListener("keydown", (event) => {

    if (event.code == jumpbuttonconfig && !jumped) {
        player.jump();
        jumped = true;
    } 
    Utils.inputStates[event.key] = true;
});

document.addEventListener("keyup", (event) => {
    if (event.code == jumpbuttonconfig) jumped = false;
    Utils.inputStates[event.key] = false;
});

document.addEventListener("mousedown", (event) => {
    Utils.inputStates[event.button] = true;
});

document.addEventListener("mousedown", (event) => {
    Utils.inputStates[event.button] = false;
});

document.addEventListener("mousedown", (event) => {
    Utils.mouse.x = event.clientX;
    Utils.mouse.y = event.clientY;
});