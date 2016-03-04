(function(){
	
	"use strict";
	
	var scam = function(){
		
		if(scam.instance){
			
			return scam.instance;
		}
		
		scam.instance = this;
		
		this.noobs = [];
		
		this.count = 0;
		
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
				  document.querySelector(".findOut").style.display = "block";
				  document.querySelector(".writeData").style.display = "none";
				  document.querySelector(".listOfNoobs").style.display = "none";
			}else if(window.location.hash === '#writeData'){
				  document.querySelector(".writeData").style.display = "block";
				  document.querySelector(".findOut").style.display = "none";
				  document.querySelector(".listOfNoobs").style.display = "none";
			}else if(window.location.hash === '#listOfNoobs'){
				  document.querySelector(".listOfNoobs").style.display = "block";
				  document.querySelector(".findOut").style.display = "none";
				  document.querySelector(".writeData").style.display = "none";
			}
			
			this.showData();
			this.bindEvents();
			//this.showData();
			
		},
		
		createListFromArray: function(arrayOfObjects){

			this.noobs = arrayOfObjects;

			//tekitan loendi htmli
			this.noobs.forEach(function(pleb){
			var all_noobs = new noob(pleb.name, pleb.surname, pleb.age, pleb.address, pleb.creditcard, pleb.security);

			var li = all_noobs.createHtmlElement();
			document.querySelector('.list-of-noobs').appendChild(li);
			});

			//this.bindEvents();
		},
		
		routeChange: function(nr){
			
			console.log(nr);
			
			if(nr === 1){
				
				document.querySelector(".writeData").style.display = "block";
				document.querySelector(".findOut").style.display = "none";
				document.querySelector(".listOfNoobs").style.display = "none";
				window.location.hash = '#writeData';
			}else if(nr === 2){
				
				document.querySelector(".listOfNoobs").style.display = "block";
				document.querySelector(".findOut").style.display = "none";
				document.querySelector(".writeData").style.display = "none";
				window.location.hash = '#listOfNoobs';
			}
			
		},
		
		bindEvents: function(){
			
			document.querySelector('.wanna').addEventListener('click', function(){
				scam.instance.routeChange(1);
			});
			console.log("click");
			
			document.querySelector('.youFool').addEventListener('click', function(event){
				
				if(scam.instance.addNewClick(event)){
					
					scam.instance.routeChange(2);

					scam.instance.showData();
					
				}
			});
			

		},
		
		bindSecEvents: function(){
			
			document.querySelector('.delete').addEventListener('click', function(){

				var x = document.querySelector('.delete').value;
				console.log(x);
				console.log(scam.instance.noobs[0]);
				
				scam.instance.noobs.splice(0, 1);
				
			});
		},
		
		addNewClick: function(event){
			
			console.log(event);

			var name = document.querySelector('.name').value;
			var surname= document.querySelector('.surname').value;
			var age = document.querySelector('.age').value;
			var address = document.querySelector('.address').value;
			var creditcard = document.querySelector('.creditcard').value;
			var security = document.querySelector('.security').value;
			var data_id = document.querySelector('.delete').value;

			if(!name || !surname || !age || !address || !creditcard || !security){
				alert('Lisage palun kõik andmed');
				return false;
			}else{
				var all_noobs = new noob(name, surname, age, address, creditcard, security, data_id);

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
				xhttp.open("GET", "saveData.php?name="+name+"&surname="+surname+"&age="+age+"&address="+address+"&creditcard="+creditcard+"&security="+security+"&data_id="+data_id, true);
				xhttp.send();
				
				return true;
			}
		},
		
		showData: function(){
			
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
			
			window.setTimeout(function(){scam.instance.bindSecEvents()}, 5000);
		}
	};
	
	var noob = function(name, surname, age, address, creditcard, security){
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
			
			/*scam.instance.count += 1;
			console.log(scam.instance.count);*/
			 
			var tr = document.createElement('tr');

			var td1 = document.createElement('td');
			td1.className = 'content1';
			var td2 = document.createElement('td');
			td2.className = 'content2';
			var td3 = document.createElement('td');
			td3.className = 'content3';
			var td4 = document.createElement('td');
			td4.className = 'content4';
			var td5 = document.createElement('td');
			td5.className = 'content5';
			var td6 = document.createElement('td');
			td6.className = 'content6';
			var td7 = document.createElement('td');
			td7.className = 'content7';

			var del = document.createElement('button');
			del.appendChild(document.createTextNode('X'));
			//del.setAttribute("id", "delete");
			del.className = 'delete';
			del.setAttribute('value', this.id);
			
			var content1 = document.createTextNode(this.name);
			var content2 = document.createTextNode(this.surname);
			var content3 = document.createTextNode(this.age);
			var content4 = document.createTextNode(this.address);
			var content5 = document.createTextNode(this.creditcard);
			var content6 = document.createTextNode(this.security);

			//var content = document.createTextNode(this.name + ' | ' + this.surname + ' | ' + this.age + ' | ' + this.address + ' | ' + this.creditcard + ' | ' + this.security+ '   ');
			//var content = document.createTextNode("<td>"+this.name + '<td></td>' + this.surname + '<td></td>' + this.age + '<td></td>' + this.address + '<td></td>' + this.creditcard + '<td></td>' + this.security+ '   ');
			td1.appendChild(content1);
			td2.appendChild(content2);
			td3.appendChild(content3);
			td4.appendChild(content4);
			td5.appendChild(content5);
			td6.appendChild(content6);
			td7.appendChild(del);

			tr.appendChild(td1);
			tr.appendChild(td2);
			tr.appendChild(td3);
			tr.appendChild(td4);
			tr.appendChild(td5);
			tr.appendChild(td6);
			tr.appendChild(td7);

			return tr;

		},
	};
	
	window.onload = function(){
		var app = new scam();
	};

})();