
(function(){
	"use strict";
	var Translate = function(){
		
		this.target = document.querySelector(".target");
		
		if(Translate.instance){
			return Translate.instance;
		}
		
		Translate.instance = this;
		
		this.init();
	
	};
	var i = 0;
	//window.Translate = Translate;
	
	Translate.prototype = {
		init : function(){
			console.log("hakkame tõlkima");
			
			this.bindMouseEvent();
			
			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function(){
			   console.log(xhttp.readyState);
			   if(xhttp.readyState == 4 && xhttp.status == 200){
				   //JSON-parse = string objektideks
				   var result = JSON.parse(xhttp.responseText);
				   console.log("result: "+result);
				   
				   //NB! saab viidata MOOSIPURGILE ka Moosipurk.instance
				   
				   Translate.instance.createListFromArray(result);
				   console.log("laadisin serverist");
			   }
			};
			//päringu tegemine
			xhttp.open("POST", "saveData.php", true);
			xhttp.send();
		},
		
		createListFromArray : function(arrayOfObjects){
			this.words = arrayOfObjects;
			
			this.words.forEach(function(word){
				i++;
				var new_Print = new Print(word.en, word.et);
				var p_en = new_Print.createHtmlElementEn();
				var p_et = new_Print.createHtmlElementEt();
				document.querySelector(".section_en").appendChild(p_en);
				document.querySelector(".section_et").appendChild(p_et);
				console.log(i);
			});
		},
		
		bindMouseEvent : function(){
			document.querySelector(".save").addEventListener("click", this.editText.bind(this));
			document.querySelector('.add-new-jar').addEventListener('click', this.addNewClick.bind(this));
		},
		
		addNewClick: function(event){
			//salvestame purgi
			//console.log(event);

			var en = document.querySelector('.en').value;
			var et = document.querySelector('.et').value;

			//console.log(en + ' ' + et);
			//1) tekitan uue Jar'i
			var new_word = new Print(en, et);

			//lisan massiiivi purgi
			this.words.push(new_word);
			console.log(JSON.stringify(this.words));
			// JSON'i stringina salvestan localStorage'isse
			localStorage.setItem('words', JSON.stringify(this.words));

			//salvestan serverisse
			var xhttp = new XMLHttpRequest();
				xhttp.onreadystatechange = function(){

				if(xhttp.readyState == 4 && xhttp.status == 200){

					console.log("salvestas serverist");

				}

			};

			console.log("saveData.php?en="+en+"&et="+et);
			xhttp.open("POST", "saveData.php?en="+en+"&et="+et, true);
			xhttp.send();

			// 2) lisan selle htmli listi juurde
			var span_en = new_word.createHtmlElementEn();
			document.querySelector('.section_en').appendChild(span_en);
			var span_et = new_word.createHtmlElementEt();
			document.querySelector('.section_et').appendChild(span_et);
			document.querySelector("#equals").reset();

		},
		
		editText: function(){
			var edit = document.querySelector(".editable").innerHTML;
			this.target.innerHTML = edit;
		},
		
		test : function(){
			console.log("tere");
		},
	};
	
	var Print = function(new_en, new_et){
		this.en = new_en;
		this.et = new_et;
		console.log('created new Print');
	};
	
	Print.prototype = {
		createHtmlElementEn : function(){
			var word_en = document.createElement("span");
			var print_en = document.createTextNode(this.en + " ")
			word_en.className = "match"+i+"";
			word_en.appendChild(print_en);
			
			return word_en;
		},
		
		createHtmlElementEt : function(){
			var word_et = document.createElement("span");
			var print_et = document.createTextNode(this.et + " ")
			word_et.className = "match"+i+"";
			word_et.appendChild(print_et);
			
			return word_et;
		},

	};
	
	window.onload = function(){
		
		var start = new Translate();
		var start2 = new Print();
		
	};
	
})();