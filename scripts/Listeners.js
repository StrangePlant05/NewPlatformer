let jumped = false;
document.addEventListener("keydown", (event) => {
    if (event.code == "Space" && !jumped) {
        player.jump();
        jumped = true;
    } 
    Utils.inputStates[event.key] = true;
});

document.addEventListener("keyup", (event) => {
    if (event.code == "Space") jumped = false;
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