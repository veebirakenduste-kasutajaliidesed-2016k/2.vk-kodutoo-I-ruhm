(function(){
   "use strict";

   var Trenniplaan = function(){

     // SEE ON SINGLETON PATTERN
     if(Trenniplaan.instance){
       return Trenniplaan.instance;
     }
     //this viitab Trenniplaan fn
     Trenniplaan.instance = this;

     this.routes = Trenniplaan.routes;
     // this.routes['home-view'].render()

     console.log('moosipurgi sees');

     // KÕIK muuutujad, mida muudetakse ja on rakendusega seotud defineeritakse siin
     this.click_count = 0;
     this.currentRoute = null;
     console.log(this);
	 
	 // hakkan hoidma koiki andmed
	 this.jars = [];

     // Kui tahan plaanile referenci siis kasutan THIS = TRENNIPLAAN RAKENDUS ISE
     this.init();
   };

   window.Trenniplaan = Trenniplaan; // Paneme muuutja külge

   Trenniplaan.routes = {
     'home-view': {
       'render': function(){
         // käivitame siis kui lehte laeme
         console.log('>>>>avaleht');
       }
     },
     'list-view': {
       'render': function(){
         // käivitame siis kui lehte laeme
         console.log('>>>>trenniplaan');
		 
		 //simulatsioon laeb kaua
		 window.setTimeout(function(){
			 document.querySelector('.loading').innerHTML = 'Laetud!';
		 }, 3000);
       }
     },
     'manage-view': {
       'render': function(){
		   // käivitame siis kui lehte laeme
		   console.log('>>>>plaani_loomine')
       }
     }
   };

   // Kõik funktsioonid lähevad Trenniplaan külge
   Trenniplaan.prototype = {

     init: function(){
       console.log('Rakendus läks tööle');

       //kuulan aadressirea vahetust
       window.addEventListener('hashchange', this.routeChange.bind(this));
	   
	   //kui aadressireal ei ole hashi siis lisan juurde
	   if(!window.location.hash){
		   window.location.hash = 'home-view';
		   //routechange siin ei ole sees vaja, sest kasitsi muutmine kaivitab routechange
	   }else{
		   //esimesel kaivitamisel vaatame urli ule ja uuendame menuud
	   this.routeChange();
	   }
	   
	   //saan katte plaanid localStorage kui on
	   if(localStorage.jars){
		   //vottan stringi ja teen tagasi objektideks
		   this.jars = JSON.parse(localStorage.jars);
		   console.log('laadisin localStorageist massiivi' + this.jars.length);
		   
		   this.createListFromArray(JSON.parse(localStorage.jars));
		   
		   console.log('laadisin localStorageist');
		   
		}else{
			
			//ei olnud localStorageist olenas, teen paringu serverisse
			
			var xhttp = new XMLHttpRequest();
			
			//vahetub siis kui toimub muutus uhenduses
			xhttp.onreadystatechange = function() {
				
				//fail joudis tervenisti kohale
				if (xhttp.readyState == 4 && xhttp.status == 200){
					
					var result = JSON.parse(xhttp.responseText);
					
					Trenniplaan.instance.createListFromArray(result);
					
					console.log('laadisin serverist');
				}
			};
			
			//paringu tegemine
			xhttp.open("GET", "saveData.php", true);
			xhttp.send();
		}

     },
	 
	 createListFromArrat: function(arrayOfObjects){
		 
		 this.jars = arrayOfObjects;
		 
		 //tekitan loendi htmli
		 this.jars.forEach(function(jar)){
			 
			 var new_jar = new Jar(jar.title, jar.repeats)
			 
			 var li = new_jar.createHtmlElement();
			 document.querySelector('.list-of-jars').appendChild(li);
		 });
		 
		 //esimene loogika oleks see, et kuulame hiireklikki nupul
		 this.bindEvents();
	 },

     bindEvents: function(){
       document.querySelector('.add-new-jar').addEventListener('click', this.addNewClick.bind(this));
	   //kuulan trukkimist otsikastis
	   document.querySelector('#search').addEventListener('keyup', this.search.bind(this));
	   
	   document.querySelector(".delete-btn").addEventListener('click', function(event){
		   console.log(event);
		   jars.forEach(function(jar){
			   
		   });
	   });
     },
	 
	 search: function(event){
		 //otsikasti vaartust
		 var needle = document.querySelector('#search').value.toLowerCase();
		 console.log(needle);
		 
		 var list = document.querySelectorAll('ul.list-of-jars li');
		 console.log(list);
		 
		 for(var i = 0; i < list.length; i++){
			 
			 var li = list[i];
			 
			 //uhel listitemi sisu tekst
			 var stack = li.querySelector('.content').innerHTML.toLowerCase();
			 
			 //kas otsisona on sisus olemas
			 if(stack.indexOf(needle) !== -1){
				 //olemas
				 li.style.display = 'list-item';
			 }else{
				 //ei ole, index on -1
				 li.style.display = 'none';
			 }
		 }
	 },
	 

     addNewClick: function(event){
		 //salvestame plaani
		 //console.log(event);
		 
		 var title = document.querySelector('.title').value;
		 var repeats = document.querySelector('.repeats').value;
		 
		 //console.log(title + '' + ingredients);
		 //1. tekitan uue Jar'i
		 var new_jar = new Jar(title, repeats);
		 
		 // lisan massiivi purgi
		 this.jars.push(new_jar);
		 console.log(JSON.stringify(this.jars));
		 //JSONi stringina salvestan localStorageisse
		 localStorage.setItem('jars', JSON.stringify(this.jars));
		 
		 //salvestan serverisse
		 var xhttp = new XMLHttpRequest();
		 xhttp.onreadystatechange = function() {
			 if (xhttp.redyState == 4 && xhttp.status == 200){
				 
				 console.log('salvestas serverisse');
			 }
		 };
		 console.log("saveData.php?title="+title+"&repeats=" +repeats);
		 xhttp.open("GET", "saveData.php?title="+title"&repeats=" +repeats, true);
		 xhttp.send();
		 
		 //2. lisan selle htmli listi juurde
		 var li = new_jar.createHtmlelement();
		 document.querySelector('.list-of-jars').appendChild(li);

     },

     routeChange: function(event){

       //kirjutan muuutujasse lehe nime, võtan maha #
       this.currentRoute = location.hash.slice(1);
       console.log(this.currentRoute);
	   
	   //kas meil on selline leht olemas?
	   if(this.routes[this.currentRoute]){
		   
		   //muudan menüü lingi aktiivseks
		   this.updateMenu();
		   
		   this.routes[this.currentRoute].render();
	   
	   }else{
		   //404 - ei olnud
	   }


     },

     updateMenu: function() {
       //http://stackoverflow.com/questions/195951/change-an-elements-class-with-javascript
       //1) võtan maha aktiivse menüülingi kui on
       document.querySelector('.active-menu').className = document.querySelector('.active-menu').className.replace('active-menu', '');

       //2) lisan uuele juurde
       //console.log(location.hash);
       document.querySelector('.'+this.currentRoute).className += ' active-menu';

     }

   }; //TRENNIPLAANI LOPP
   
   var Jar = function(new_title, new_repeats){
	   this.title = new_title;
	   this.repeats = new_repeats;
	   console.log('created new jar');
   };
   
   Jar.prototype = {
	   createHtmlElement: function(){
		   //vottes title ja repeats -> 
		   /*
		   li
			span.letter
				M<- title esimene taht
			span.content
				title / repeats
		   */
		   
		   var li = document.createElement('li');
		   
		   var span = document.createElement('span');
		   span.className = 'letter';
		   
		   var letter = document.createTextNode(this.title.charAt(0));
		   span.appendChild(letter);
		   
		   li.appendChild(span);
		   
		   var span_with_content = document.createElement('span');
		   span_with_content.className = 'content';
		   
		   var del = document.createElement('button');
		   del.appendChild(document.createTextNode('X'));
		   del.className = 'delete-btn';
		   del.setAttribute('data-id', this.id);
		   del.name = 'X';
		   
		   var content = document.createTextNode(this.title + ' | ' + this.repeats);
		   span_with_content.appendChild(content);
		   span_with_content.appendChild(del);
		   
		   li.appendChild(span_with_content);
		   
		   return li;
	   }
   };
   
   /*var button=document.getElementsByTagName('button')[0];
   var select=document.getElementsByTagName('list-of-jars')[0];
   button.onclick=function(){
	   select.removeChild(select.options[select.selectedIndex]);
	};*/

   // kui leht laetud käivitan Moosipurgi rakenduse
   window.onload = function(){
     var app = new Trenniplaan();
   };

})();