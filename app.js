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

     console.log('trenniplaani sees');

     // KOIK muuutujad, mida muudetakse ja on rakendusega seotud defineeritakse siin
     this.click_count = 0;
     this.currentRoute = null;
     console.log(this);
	 
	 //id, mis laheb plaanile kaasa
	 this.jar_id = 0;

     // hakkan hoidma koiki plaane
     this.jars = [];

     // Kui tahan Trenniplaanile referenci siis kasutan THIS = TRENNIPLAANI RAKENDUS ISE
     this.init();
   };

   window.Trenniplaan = Trenniplaan; // Paneme muuutja kulge

   Trenniplaan.routes = {
     'home-view': {
       'render': function(){
         // kaivitame siis kui lehte laeme
         console.log('>>>>avaleht');
       }
     },
     'list-view': {
       'render': function(){
         // kaivitame siis kui lehte laeme
         console.log('>>>>loend');

         //simulatsioon laeb kaua
         window.setTimeout(function(){
           //document.querySelector('.loading').innerHTML = 'laetud!';
         }, 3000);

       }
     },
     'manage-view': {
       'render': function(){
         // kaivitame siis kui lehte laeme
		 console.log('>>>>haldus');
       }
     }
   };

   // Koik funktsioonid lahevad Trenniplaani kulge
   Trenniplaan.prototype = {

     init: function(){
       console.log('Rakendus laks toole!!!');

       //kuulan aadressirea vahetust
       window.addEventListener('hashchange', this.routeChange.bind(this));

       // kui aadressireal ei ole hashi siis lisan juurde
       if(!window.location.hash){
         window.location.hash = 'home-view';
         // routechange siin ei ole vaja sest kasitsi muutmine kaivitab routechange event'i ikka
       }else{
         //esimesel kaivitamisel vaatame urli ule ja uuendame menuud
         this.routeChange();
       }

       //saan katte purgid localStorage kui on
       if(localStorage.jars){
           //votan stringi ja teen tagasi objektideks
           this.jars = JSON.parse(localStorage.jars);
           console.log('laadisin localStorageist massiiivi ' + this.jars.length);

           //tekitan loendi htmli
           this.jars.forEach(function(jar){

               var new_jar = new Jar(jar.id, jar.title, jar.repeats, jar.trainD);
				
				//uuendad trenniplaani id'd et hiljem jatkata kus pooleli jai
				Trenniplaan.instance.jar_id = jar.id;

               var li = new_jar.createHtmlElement();
               document.querySelector('.list-of-jars').appendChild(li);

           });
		   
		   //fix suurendame id'd jargmise plaani jaoks uhe vorra
		   //kui eelmine oli 2 siis jargmine oleks 3
			this.jar_id++;
       }


       // esimene loogika oleks see, et kuulame hiireklikki nupul
       this.bindEvents();

     },

     bindEvents: function(){
       document.querySelector('.add-new-jar').addEventListener('click', this.addNewClick.bind(this));

       //kuulan trukkimist otsikastis
       document.querySelector('#search').addEventListener('keyup', this.search.bind(this));

     },
	 
	 deleteJar: function(event){
		
		//li element
		console.log(event.target.parentNode);
		//id (data-id vaartus)
		console.log(event.target.dataset.id);
		
		var c = confirm('kustuta?');
		
		//kui ei olnud nous katkestame
		if(!c){ return; }
		
		//kustutame HTMList
		var clicked_li = event.target.parentNode;
		document.querySelector('.list-of-jars').removeChild(clicked_li);
		
		//kustutan massiivist
		this.jars.forEach(function(jar, i){
			
			//sama id, mis vajutasime
			if(jar.id == event.target.dataset.id){
				
				//mis index ja mitu. + lisaks saab asendada vajadusel
				Trenniplaan.instance.jars.splice(i, 1);
			}
              
        });
		
		// salvesta uuesti localStorage'isse
       localStorage.setItem('jars', JSON.stringify(this.jars));
		
	 },
	 
	 changeJar: function(event){
		 console.log(event.target.parentNode);
		 console.log(event.target.dataset.id);
		 
		 var li = event.target.parentNode;
		 
		 var new_title = prompt("Uus pealkiri");
		 var new_repeats = prompt("Kordused");
		 var new_trainD = prompt("Kuupäev");
		 
		 li.querySelector(".content").innerHTML = new_title;
		 li.querySelector(".content").innerHTML = new_repeats;
		 li.querySelector(".content").innerHTML = new_trainD;

		 
		 this.jars.forEach(function(jar, i){
			 
			 if(jar.id == event.target.dataset.id){
				 
				 jar.title = new_title;
				 jar.repeats = new_repeats;
				 jar.trainD = new_trainD;
				 
				 Trenniplaan.instance.jars.splice(i, 1, jar);
			 }
		 });
		 
		 localStorage.setItem('jars', JSON.stringify(this.jars));
	 },
	 
     search: function(event){
         //otsikasti vaartus
         var needle = document.querySelector('#search').value.toLowerCase();
         console.log(needle);

         var list = document.querySelectorAll('ul.list-of-jars li');
         console.log(list);

         for(var i = 0; i < list.length; i++){

             var li = list[i];

             // uhe listitemi sisu tekst
             var stack = li.querySelector('.content').innerHTML.toLowerCase();

             //kas otsisona on sisus olemas
             if(stack.indexOf(needle) !== -1){
                 //olemas
                 li.style.display = 'list-item';

             }else{
                 //ei ole, index on -1, peidan
                 li.style.display = 'none';

             }

         }
     },

     addNewClick: function(event){
       //salvestame plaani
       //console.log(event);

       var title = document.querySelector('.title').value;
       var repeats = document.querySelector('.repeats').value;
	   var trainD = document.querySelector('.trainD').value;
	   
       //console.log(title + ' ' + repeats);
       //1) tekitan uue Jar'i
       var new_jar = new Jar(this.jar_id, title, repeats, trainD);
	   
	   //suurenda id'd
	   this.jar_id++;

       //lisan massiiivi plaani
       this.jars.push(new_jar);
       console.log(JSON.stringify(this.jars));
       // JSON'i stringina salvestan localStorage'isse
       localStorage.setItem('jars', JSON.stringify(this.jars));

       // 2) lisan selle htmli listi juurde
       var li = new_jar.createHtmlElement();
       document.querySelector('.list-of-jars').appendChild(li);


     },

     routeChange: function(event){

       //kirjutan muuutujasse lehe nime, votan maha #
       this.currentRoute = location.hash.slice(1);
       console.log(this.currentRoute);

       //kas meil on selline leht olemas?
       if(this.routes[this.currentRoute]){

         //muudan menuu lingi aktiivseks
         this.updateMenu();

         this.routes[this.currentRoute].render();


       }else{
         /// 404 - ei olnud
       }


     },

     updateMenu: function() {
       //http://stackoverflow.com/questions/195951/change-an-elements-class-with-javascript
       //1) votan maha aktiivse menuulingi kui on
       document.querySelector('.active-menu').className = document.querySelector('.active-menu').className.replace('active-menu', '');

       //2) lisan uuele juurde
       //console.log(location.hash);
       document.querySelector('.'+this.currentRoute).className += ' active-menu';

     }

   }; // TRENNIPLAANI LOPP

   var Jar = function(new_id, new_title, new_repeats, new_trainD){
	 this.id = new_id;
     this.title = new_title;
     this.repeats = new_repeats;
	 this.trainD = new_trainD
     console.log('created new jar');
   };

   Jar.prototype = {
     createHtmlElement: function(){

       // vottes title ja repeats ->
       /*
       li
        span.letter
          M <- title esimene taht
        span.content
          title | repeats
       */

       var li = document.createElement('li');

       var span = document.createElement('span');
       span.className = 'letter';

       var letter = document.createTextNode(this.trainD.charAt(0));
       span.appendChild(letter);

       li.appendChild(span);

       var span_with_content = document.createElement('span');
       span_with_content.className = 'content';

       var content = document.createTextNode(this.trainD + ' | ' + this.title + ' | ' + this.repeats);
       span_with_content.appendChild(content);

       li.appendChild(span_with_content);
	   
	   // tekitan delete nupu
	   
	   var delete_span = document.createElement('span');
	   delete_span.appendChild(document.createTextNode(' kustuta'));
	   var change_span = document.createElement('span');
	   change_span.appendChild(document.createTextNode(' muuda'));
		
	   delete_span.style.color = 'red';
	   delete_span.style.cursor = 'pointer';
	   change_span.style.color = 'green';
	   change_span.style.cursor = 'pointer';
	   
	   //panen kulge id
	   delete_span.setAttribute('data-id', this.id);
	   change_span.setAttribute('data-id', this.id);
	   
	   delete_span.addEventListener('click', Trenniplaan.instance.deleteJar.bind(Trenniplaan.instance));
	   change_span.addEventListener('click', Trenniplaan.instance.changeJar.bind(Trenniplaan.instance));
	   
	   li.appendChild(delete_span);
	   li.appendChild(change_span);

       return li;

     }
   };

   // kui leht laetud kaivitan Trenniplaani rakenduse
   window.onload = function(){
     var app = new Trenniplaan();
   };

})();