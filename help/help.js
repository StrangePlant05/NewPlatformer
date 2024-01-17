let pageIndex = 0;
let imageArray = ['styles/images/Page1.gif','styles/images/Page2.gif','styles/images/Page3.gif','styles/images/Page4.gif','styles/images/Page5.png']

let headerCollectionArray = ["Starting a Quiz","Choosing an Answer","Getting a correct Answer","Running out of Time","Finishing a quiz"];
let textCollectionArray= ["Use the keybinds to move around, head to the finish box to win the game","Buttons move platforms or doors when the are pressed.","Spikes kill the player on contact, make sure to avoid them!","Crates act as objects to help the player in various ways"];

let queryString = window.location.search;
document.getElementById("Player").addEventListener('click',function(){
    document.getElementById("abc").src= 'help/1.gif'
    document.getElementById("textInstructions").innerText= textCollectionArray[0]
})
document.getElementById("Buttons").addEventListener('click',function(){
    document.getElementById("abc").src= 'help/2.gif'
    document.getElementById("textInstructions").innerText= textCollectionArray[1]
})
document.getElementById("Spikes").addEventListener('click',function(){
    document.getElementById("abc").src= 'help/3.gif'
    document.getElementById("textInstructions").innerText= textCollectionArray[2]
})
document.getElementById("Crates").addEventListener('click',function(){
    document.getElementById("abc").src= 'help/4.gif'
    document.getElementById("textInstructions").innerText= textCollectionArray[3]
})
document.getElementById("Return").addEventListener('click',function(){
   window.location.href = "http://127.0.0.1:5500/index.html"
})


function changeElems(x,y,z){
// if (pageIndex<=x){
        if (pageIndex == x){
            document.getElementById(z).disabled = true;
        }else{
            document.getElementById("previousPage").disabled = false;
            document.getElementById("nextPage").disabled = false;
            pageIndex-=y;
            if (pageIndex == 5){
            docFunc.ToNewPage("null","main.html",currentUser)
            }else{
            docFunc.Text("textTitle",headerCollectionArray[pageIndex])
            docFunc.Text("textInstructions",textCollectionArray[pageIndex])
            document.getElementById("abc").src= imageArray[pageIndex]
            }
        }
        
    }
    
// }
