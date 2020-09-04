let pomoTime = 1500;
let shortBreakTime = 300;
let longBreakTime = 900;

// all timer info grouped together into an object
var timerInfo = {
    start: null,
    timeRemaining: pomoTime,
    end: null,               
    lastClicked: null,
    timerLen: null,
    timerActive: false,
    isLooped: false,
    loopCount: 0
};

let timerEl = document.querySelector("#timer");
let titleEl = document.querySelector("title");
timerEl.innerText = timeToText(pomoTime);

///////////////// Command buttons event listeners//////////////
//TODO create function which creates Clicked functions: because repeated code ??

// pomo event listener
let pomoEl = document.querySelector("#pomoButton")
let pomoClicked = function() {
    timerEl.innerText = timeToText(pomoTime);
    timerInfo.lastClicked = pomoClicked;
    timerInfo.timeRemaining = pomoTime;
    timerInfo.timerActive = false;
    timerInfo.isLooped = false;

};
pomoEl.addEventListener("click", pomoClicked);
    
// shortBreak event listener
let shortBreakEl = document.querySelector("#shortButton");
let shortClicked = function () {
    timerEl.innerText = timeToText(shortBreakTime);
    timerInfo.lastClicked = shortClicked;
    timerInfo.timeRemaining = shortBreakTime;
    timerInfo.timerActive = false;
    timerInfo.isLooped = false;
};
shortBreakEl.addEventListener("click", shortClicked);

// LongBreak event listener
let longBreakEl = document.querySelector("#longButton");
let longClicked = function () {
    timerEl.innerText = timeToText(longBreakTime);
    timerInfo.lastClicked = longClicked;
    timerInfo.timeRemaining = longBreakTime;
    timerInfo.timerActive = false;
    timerInfo.isLooped = false;
    
};
longBreakEl.addEventListener("click", longClicked);

// Loop event listener
let loopEl = document.querySelector("#loopButton");
let loopClicked = function () {
    timerEl.innerText =  timeToText(pomoTime);
    timerInfo.lastClicked = loopClicked;
    timerInfo.timeRemaining = pomoTime;
    timerInfo.timerActive = false;
    timerInfo.isLooped = true;
    timerInfo.loopCount = 0;
};
loopEl.addEventListener("click", loopClicked);

// loop array : order to call functions to create 4 pomodoro loop session
let loopArray = [shortClicked, pomoClicked, shortClicked, pomoClicked, shortClicked, pomoClicked]

///////////////control buttons event listenrs///////////////////

// pauseButton event listener
let pauseEl = document.querySelector("#pause");
let pauseClicked = function () {
    if (timerInfo.timerActive === true){
        timerInfo.timerActive = false;
}
};
pauseEl.addEventListener("click", pauseClicked);

// playButton event listener
let playEl = document.querySelector("#start")
let playClicked = function() {
    // make sure timer is not currently active else ignore event
    if (timerInfo.timerActive === false){
        timerInfo.start = new Date;
        timerInfo.end = timerInfo.start.getTime() + (timerInfo.timeRemaining * 1000);  //timer
        timerInfo.timerActive = true;

    }
};
playEl.addEventListener("click", playClicked); 

// resetButton event listener
let resetEl = document.querySelector("#reset");
let resetClicked = function() {
    // call the last command button callback function
    if (timerInfo.isLooped) {
        loopClicked();
    }
    else {
        timerInfo.lastClicked();
    }
    timerInfo.timerActive = false;
    
};
resetEl.addEventListener("click", resetClicked);


///////////////////// pomo-info button event listeners/////////

let modalEl = document.getElementById("pomo-modal");
let pomoInfoBtnEl = document.getElementById("pomo-info");
let closeBtnEl = document.getElementById("close-btn");
/* open modal*/
pomoInfoBtnEl.onclick = function() {
    modalEl.style.display = "block";
}
/* remove modal from view*/
closeBtnEl.onclick = function() {
    modalEl.style.display = "none";
}
// when user clicks outside of modal: close modal 
window.onclick = function() {
    if(event.target == modalEl) {
        modalEl.style.display = "none";
    }
}

/*   Source of the audio file for the timer alarm 
Autor: Freezeman
Tiltle: beep1.wav
url: https://freesound.org/people/Freezeman/sounds/153213/
copyright notice: creative commons */
let audio = new Audio('sounds/153213__freezeman__beep1.wav'); 

////////////////////////////////////////////////////////////////////

// format function converts remaining secounds to the required format 
// time = time in seconds 
function timeToText (time) {
    let minutes = Math.floor(time / 60);
    let seconds = time - (minutes * 60);
    let text = "";
    if (minutes < 10) {
        text += "0"
    }
    text += minutes.toString() + ":";
    if (seconds === 0){
        text += "00" 
    }
    else if (seconds < 10) {
        text += "0" + seconds.toString();
    }
    else {
        text += seconds.toString(); 
    }
    return text;
};

function remainingTime (timerInfo) {   //T0DO optmize
    let seconds = Math.floor((timerInfo.end - Date.now()) / 1000); //timer
    return seconds;
}

function updateTimer () {
    if (timerInfo.timerActive) {
    // update .timeRemaining, timerEl.innerText and tab
    let r = remainingTime(timerInfo);
    let text = timeToText(r);
    timerEl.innerText = text;
    titleEl.innerText = text + "  JD's Pomodoro Timer";
    timerInfo.timeRemaining = r;
    // when timer ends and loop code 
        if (timerInfo.timeRemaining <= 0) {
            timerInfo.timerActive = false;
            audio.play();
        
            if(timerInfo.isLooped) {
                if(loopArray.length <= timerInfo.loopCount){
                    timerInfo.isLooped = false;
                    timerInfo.loopCount = 0;
                }
                else {
                    // call next function in the loop
                    loopArray[timerInfo.loopCount]();
                    timerInfo.isLooped = true;  // reseting isLooped as function sets to false               
                    playClicked();
                    timerInfo.loopCount++;
                }
            }
        }
    }

};

// call updateTimer every 200 miliseconds 
setInterval(updateTimer, 200);

//Todo In Future
/*
1. Try to optimize to make timer less taxing on browser
2. Improve media aqueries to make website more responsive
3. Improve the aesthetic of the website
4. ?? ADD Some functionality or feature
5. Add an effect to when the timer goes off
*/
