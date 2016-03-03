(function(){
	
	"use strict";
	
	var scam = function(){
		
		if(scam.instance){
			
			return scam.instance;
		}
		
		scam.instance = this;
		
		this.noobs = [];
		
		this.init();
		
	};
	
	window.scam = scam;
	
	scam.prototype = {
		
		init: function(){
			console.log('Rakendus läks tööle');

			if(!window.location.hash){
				window.location.hash = '#findOut';
			}
			
			if(window.location.hash === '#findOut'){
				  document.getElementById("findOut").style.display = "block";
				  document.getElementById("writeData").style.display = "none";
				  document.getElementById("listOfNoobs").style.display = "none";
			}else if(window.location.hash === '#writeData'){
				  document.getElementById("findOut").style.display = "none";
				  document.getElementById("writeData").style.display = "block";
				  document.getElementById("listOfNoobs").style.display = "none";
			}else if(window.location.hash === '#listOfNoobs'){
				  document.getElementById("findOut").style.display = "none";
				  document.getElementById("writeData").style.display = "none";
				  document.getElementById("listOfNoobs").style.display = "block";
			}
			
			var xhttp = new XMLHttpRequest();
			//vahetub siis kui toimub muutus ühenduses
			xhttp.onreadystatechange = function() {

				//console.log(xhttp.readyState);
				//fail jõudis tervenisti kohale
				if (xhttp.readyState == 4 && xhttp.status == 200) {
					var result = JSON.parse(xhttp.responseText);
					console.log(result);

					scam.instance.createListFromArray(result);
					console.log('laadisin serverist');
				}
			};
			//päringu tegemine
			xhttp.open("GET", "saveData.php", true);
			xhttp.send();
			
		},
		
		createListFromArray: function(arrayOfObjects){

			this.noobs = arrayOfObjects;

			//tekitan loendi htmli
			this.noobs.forEach(function(pleb){
			var all_noobs = new noob(pleb.name, pleb.surname, pleb.age, pleb.address, pleb.creditcard, pleb.security);

			var li = all_noobs.createHtmlElement();
			document.querySelector('.list-of-noobs').appendChild(li);
			});

			this.bindEvents();
		},
		
		routeChange: function(nr){
			
			if(nr === 1){
				document.getElementById("findOut").style.display = "none";
				document.getElementById("writeData").style.display = "block";
				document.getElementById("listOfNoobs").style.display = "none";
			}else if(nr === 2){
				document.getElementById("findOut").style.display = "none";
				document.getElementById("writeData").style.display = "none";
				document.getElementById("listOfNoobs").style.display = "block";
			}
			
		},
		
		bindEvents: function(){
			
			document.querySelector('.wanna').addEventListener('click', routeChange(1));
			
			document.querySelector('.youFool').addEventListener('click', routeChange(2));

		},
		
		addNewClick: function(event){

			var name = document.querySelector('.title').value;
			var surname= document.querySelector('.ingredients').value;
			var age = document.querySelector('.colour').value;
			var address = document.querySelector('.colour').value;
			var creditcard = document.querySelector('.colour').value;
			var security = document.querySelector('.colour').value;

			if(!name || !surname || !age || !address || creditcard || security){
				alert('Lisage palun kõik andmed');
			}else{
				var all_noobs = new noob(name, surname, age, address, creditcard, security);

				 //salvestan serverisse
				var xhttp = new XMLHttpRequest();
				xhttp.onreadystatechange = function() {
					if (xhttp.readyState == 4 && xhttp.status == 200) {

						console.log('salvestas serverisse');
						var result =xhttp.responseText;
						console.log(result);
					}
				};
					//päringu tegemine
				xhttp.open("GET", "saveData.php?name="+name+"&surname="+surname+"&age="+age+"&address="+address+"&creditcard="+creditcard+"&security="+security, true);
				xhttp.send();
			}
		}
	};
	
	var noob = function(name, surname, age, address, creditcard. security){
		this.name = name;
		this.surname = surname;
		this.age = age;
		this.address = address;
		this.creditcard = creditcard;
		this.security = security;
		this.id = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1) +  Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
		console.log('created new noob');
	};
		
	noob.prototype = {
		
		createHtmlElement: function(){
			 
			var li = document.createElement('li');

			var span1 = document.createElement('span');
			span1.className = 'content';

			var del = document.createElement('button');
			del.appendChild(document.createTextNode('X'));
			del.className = 'delete-btn';
			del.setAttribute('data_id', this.id);
			del.name = 'X';

			var content = document.createTextNode(this.name + ' | ' + this.surname + ' | ' + this.age + ' | ' + this.address + ' | ' + this.creditcard + ' | ' + this.security+ '   ');
			span1.appendChild(content);
			span1.appendChild(del);

			li.appendChild(span1);

			return li;

		}
	};
	
	window.onload = function(){
		var app = new scam();
	};

})();