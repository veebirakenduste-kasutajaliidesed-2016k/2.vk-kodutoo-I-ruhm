var text_en_split = text_en.replace(/\./g, ""); //splits sentences on dot. Not necessary to use
var word_en_split = text_en.split(" "); //Splits sentence into words
var text_et_split = text_et.replace(/\./g, "");
var word_et_split = text_et.split(" ");
var word_array = [word_en_split]; //creates an array of split words
var array = JSON.stringify(word_en_split); // creates a stringified array

//document.querySelector(".split_here").innerHTML = text_split;
//document.querySelector(".array_here").innerHTML = word_split;

console.log(text_en);
console.log(text_et);
console.log(text_en_split);
console.log(text_et_split);

console.log(word_array);
console.log(word_en_split);
console.log(array);

var i; //counter of times gone through the array
var value_en = document.querySelector(".value_en"); //element where split words are written seperately <span>word</span>
var value_et = document.querySelector(".value_et");
for(i=0; i<word_en_split.length; i++){ 
	
	// Goes through the array of words and writes them seperately into a <div>
	
	console.log(word_en_split[i]);
	value_en.innerHTML += "<span>"+word_en_split[i]+" </span>"
	
}

for(i=0; i<word_et_split.length; i++){
	
	// Goes through the array of words and writes them seperately into a <div>
	
	console.log(word_et_split[i]);
	value_et.innerHTML += "<span>"+word_et_split[i]+" </span>"
	
}

function select_en(event) {
	
	//Function to allow selection of words seperately
	
	var to_click = event.target;
	
	if(to_click.className == "in"){ //just a test to see if double clicking would remove word from input. NOT
		console.log("should remove from input");
		var en = event.target.innerHTML;
		//document.querySelector(".en").value -= en; //see ei toimi
	}
	else{
		event.target.style.color = "green";
		var en = event.target.innerHTML;
		to_click.className = "in";
		document.querySelector(".en").value += en;
	}
	
	
}

function select_et(event) {
	
	//Function to allow selection of words seperately
	
	event.target.style.color = "green";
	var et = event.target.innerHTML;
	document.querySelector(".et").value += et;
	
}