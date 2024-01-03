let jumped = false;

document.getElementById("ak").addEventListener("click",(event)=>{
    let jumpbuttonconfig = document.getElementById("wagaegs").value;

    Utils.keybinds.jump = jumpbuttonconfig;
    alert(jumpbuttonconfig)
});
document.addEventListener("keydown", (event) => {

    if (event.key === Utils.keybinds.jump && !jumped) {
        player.jump();
        jumped = true;
    } 
    Utils.inputStates[event.key] = true;
});

document.addEventListener("keyup", (event) => {
    if (event.key === Utils.keybinds.jump) jumped = false;
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