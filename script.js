
let turntext = document.querySelector("p");
let resetbutton = document.querySelector("#Reset");
let holder = document.querySelector(".holder")
let turn = "X";
let game_is_over = false; 
let winner = null;

let gridbuttons = document.getElementsByClassName("GridButton");
let amountbuttons = document.getElementsByClassName("AmountButton");

let [rows, columns] = [5, 5];
let AmtToWin = 4;

let bnsfilled = {};
let createdrows = [];
let QueueToCreateRows = [];

function Animate(Element, AnimationName) {

    const toAnimate = document.querySelector(Element);

    toAnimate.classList.add(AnimationName);

    toAnimate.addEventListener("animationend", function() {
        toAnimate.classList.remove(AnimationName);
    });
}

function UpdateTurnText() {
    turntext.innerHTML = "[ " + turn + " ] TURN";
}

function ResetGame() {
    
    winner = null;
    game_is_over = false;
    bnsfilled = {};
    turn = "X";

    for (let i = 1; i <= rows*columns; i++) {
        let bn = document.getElementById(i);

        if (bn != null) {
            bn.innerHTML = "";
            bn.style.color = "black"; 
        }
    }   

    UpdateTurnText(); 
}

function CheckVertical([spot, progress]) {

    if (progress >= AmtToWin) {
        return true;
    }

    let tempkey = bnsfilled[spot];
    let nextspot = Number(spot) + Number(columns);
    let nextspotelement = document.getElementById(nextspot);

    if (nextspotelement != null && tempkey == bnsfilled[nextspot]) {
        return CheckVertical([nextspot, progress + 1]);
    }
    
    return false;
}

function CheckHorizontal([spot, progress]) {

    if (progress >= AmtToWin) {
        return true;
    }

    let tempkey = bnsfilled[spot];
    let nextspot = Number(spot) + 1;
    
    let spotelement = document.getElementById(spot);
    let nextspotelement = document.getElementById(nextspot);

    if (nextspotelement != null) {
        let spotrowN = spotelement.parentElement.id.split("_")[1];
        let nextspotrowN = nextspotelement.parentElement.id.split("_")[1];
        
        if (tempkey == bnsfilled[nextspot] && spotrowN == nextspotrowN) {     
            return CheckHorizontal([nextspot, progress + 1]);
        } 
    }
    
    return false;
}

function CheckDStairs([spot, progress]) {
    
    if (progress >= AmtToWin) {
        return true;
    }
    
    let tempkey = bnsfilled[spot];
    let nextspot = Number(spot) + columns + 1;
    
    let spotelement = document.getElementById(spot);
    let nextspotelement = document.getElementById(nextspot);

    if (nextspotelement != null) {
        let spotrowN = spotelement.parentElement.id.split("_")[1];
        let nextspotrowN = nextspotelement.parentElement.id.split("_")[1];
        
        if (tempkey == bnsfilled[nextspot] && spotrowN == nextspotrowN - 1) {
            return CheckDStairs([nextspot, progress + 1]);
        } 
    }
    
    return false;
}

function CheckUStairs([spot, progress]) {
    
    if (progress >= AmtToWin) {
        return true;
    }

    let tempkey = bnsfilled[spot];
    let nextspot = Number(spot) + columns - 1;

    let spotelement = document.getElementById(spot);
    let nextspotelement = document.getElementById(nextspot);

    if (nextspotelement != null) {
        let spotrowN = spotelement.parentElement.id.split("_")[1];
        let nextspotrowN = nextspotelement.parentElement.id.split("_")[1];
        
        if (tempkey == bnsfilled[nextspot] && spotrowN == nextspotrowN - 1) { 
            return CheckUStairs([nextspot, progress + 1]);
        } 
    }

    return false;
}

function CheckCombination(spot) {
    
    let params = [spot, 1]
    return CheckVertical(params) || CheckHorizontal(params) || CheckDStairs(params) || CheckUStairs(params)
}

function CheckBoard() {

    for (const [i, v] of Object.entries(bnsfilled)) {
        
        if (CheckCombination(i)) {
            return [true, bnsfilled[i]];
        }
    }

    return [false, null];  
}

function CreateRow(NRow) {

    const newrow = document.createElement("div");
    newrow.className = "row";
    newrow.id = "row_" + NRow;
    holder.appendChild(newrow);
    createdrows.unshift(newrow);
        
    for (let n = 1; n <= columns; n++) {

        const newspot = document.createElement("button");
        newspot.className = "input";
        newspot.id = n + ((NRow-1)*columns);
        newrow.appendChild(newspot);

        newspot.addEventListener("click", function() {
            
            let clicksound = new Audio("sounds/click.mp3");
            clicksound.volume = 0.25;
            clicksound.play();
    
            if (bnsfilled[newspot.id] || game_is_over ) {
                return;
            }
    
            bnsfilled[newspot.id] = turn;
    
            if (turn == "X") {
                newspot.innerHTML = "X";
                turn = "O";
            } else if (turn == "O") {
                newspot.innerHTML = "O";
                turn = "X";
            }
    
            UpdateTurnText();
    
            [game_is_over, winner] = CheckBoard();
    
            if (game_is_over) {
                
                if (document.querySelector("h2")) {
                    document.querySelector("h2").remove(); 
                }

                let clicksound = new Audio("sounds/win.mp3");
                clicksound.volume = 0.25;
                clicksound.play();
    
                const winnertext = document.createElement("h2")
                winnertext.innerHTML = "Winner is [" + winner + "]"
                document.body.appendChild(winnertext);
    
                Animate("h2", "Animation")
            }
        })
    }
}

function CreateBoard() {

    ResetGame();
    
    for (let i = 0; i < QueueToCreateRows.length; i++) {
        clearTimeout(QueueToCreateRows[i])
    }

    for (let i = 0; i < createdrows.length; i++) {
        createdrows[i].remove();
    }    

    for (let i = 1; i <= rows; i++) {

        let timeoutid = setTimeout(()=>{
            CreateRow(i)
        }, 100*i) 
        
        QueueToCreateRows.push(timeoutid)
    }
}

resetbutton.addEventListener("click", ResetGame)

//----------------------------------------------------------------------

UpdateTurnText();
CreateBoard();

for (let i = 0; i < gridbuttons.length; i++) {
    gridbuttons[i].addEventListener("click", function(){
        rows = Number(gridbuttons[i].innerHTML.split("x")[0]);
        columns = Number(gridbuttons[i].innerHTML.split("x")[1]);
        CreateBoard()
    })
}

for (let i = 0; i < amountbuttons.length; i++) {
    amountbuttons[i].addEventListener("click", function(){
        AmtToWin = Number(amountbuttons[i].innerHTML)
        CreateBoard()
    })
}
