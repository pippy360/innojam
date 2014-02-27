var counterToArrive;
var counterToLeave;
var totalSecondsToLeave;
var totalSecondsToArrive;

function CreateTimer(counterToArriveID, counterToLeaveID, minutesToBus, minutesToWalk){
	counterToArrive = document.getElementById(counterToArriveID);
	counterToLeave = document.getElementById(counterToLeaveID);
	
	totalSecondsToArrive = minutesToBus*60;
	totalSecondsToLeave = totalSecondsToArrive - minutesToWalk*60;
	
	updateCounter();
	window.setTimeout("tick()", 1000);
}

function tick(){
	if(totalSecondsToLeave<=0){return;}
	
	totalSecondsToArrive -= 1;
	totalSecondsToLeave -= 1;
	
	updateCounter();
	
	window.setTimeout("tick()", 1000);
}

function updateCounter(){
	//to arrive
	var minutes = Math.floor(totalSecondsToArrive/60);
	var seconds = totalSecondsToArrive%60;
	counterToArrive.innerHTML = ((minutes<10)? "0"+minutes : minutes) + ":" + ((seconds<10)? "0"+seconds : seconds);
	
	//to leave house
	minutes = Math.floor(totalSecondsToLeave/60);
	seconds = totalSecondsToLeave%60;
	counterToLeave.innerHTML = ((minutes<10)? "0"+minutes: minutes) + ":" + ((seconds<10)? "0"+seconds : seconds);
}