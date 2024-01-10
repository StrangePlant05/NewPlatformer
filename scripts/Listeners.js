let jumped = false;
let jumped2 = false;

document.getElementById("ak").addEventListener("click",(event)=>{
    let jumpbuttonconfig = document.getElementById("wagaegs").value;

    if (jumpbuttonconfig.length == 1){
    Utils.keybindsPlayer1.jump = jumpbuttonconfig.toLowerCase();
    }else{
     Utils.keybindsPlayer1.jump = jumpbuttonconfig;
    }
    
    alert(jumpbuttonconfig)
});

window.addEventListener("resize", (event)=> {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
document.addEventListener("keydown", (event) => {
    const eventKey = event.key.toLowerCase();
    if (eventKey === Utils.keybindsPlayer1.jump && !jumped) {
        player1.jump();
        jumped = true;
    }
    if (eventKey === Utils.keybindsPlayer2.jump && !jumped2) {
        player2.jump();
        jumped2 = true;
    }
    Utils.inputStates[eventKey] = true;
});

document.addEventListener("keyup", (event) => {
    const eventKey = event.key.toLowerCase();
    if (eventKey === Utils.keybindsPlayer1.jump) jumped = false;
    if (eventKey === Utils.keybindsPlayer2.jump) jumped2 = false;
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