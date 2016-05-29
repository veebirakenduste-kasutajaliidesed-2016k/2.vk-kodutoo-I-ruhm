(function(){
   "use strict";

   var movies = function(){

     // SEE ON SINGLETON PATTERN
     if(movies.instance){
       return movies.instance;
     }
     //this viitab movies fn
     movies.instance = this;

     this.routes = movies.routes;
     // this.routes['home-view'].render()

     console.log('moosipurgi sees');

     // KÕIK muuutujad, mida muudetakse ja on rakendusega seotud defineeritakse siin
     this.click_count = 0;
     this.currentRoute = null;
     console.log(this);

	 //id, mis läheb purgile kaasa
	 this.jar_id = 0;

     // hakkan hoidma kõiki purke
     this.jars = [];

     // Kui tahan Moosipurgile referenci siis kasutan THIS = MOOSIPURGI RAKENDUS ISE
     this.init();
   };

   window.movies = movies; // Paneme muuutja külge

   movies.routes = {
     'home-view': {
       'render': function(){
         // käivitame siis kui lehte laeme
         console.log('>>>>avaleht');
       }
     },
     'list-view': {
       'render': function(){
         // käivitame siis kui lehte laeme
         console.log('>>>>loend');

         //simulatsioon laeb kaua
         window.setTimeout(function(){
           document.querySelector('.loading').innerHTML = 'laetud!';
         }, 3000);

       }
     },
     'manage-view': {
       'render': function(){
         // käivitame siis kui lehte laeme
       }
     }
   };

   // Kõik funktsioonid lähevad Moosipurgi külge
   movies.prototype = {

     init: function(){
       console.log('Rakendus läks tööle');

       //kuulan aadressirea vahetust
       window.addEventListener('hashchange', this.routeChange.bind(this));

       // kui aadressireal ei ole hashi siis lisan juurde
       if(!window.location.hash){
         window.location.hash = 'home-view';
         // routechange siin ei ole vaja sest käsitsi muutmine käivitab routechange event'i ikka
       }else{
         //esimesel käivitamisel vaatame urli üle ja uuendame menüüd
         this.routeChange();
       }

       //saan kätte purgid localStorage kui on
       if(localStorage.jars){
           //võtan stringi ja teen tagasi objektideks
           this.jars = JSON.parse(localStorage.jars);
           console.log('laadisin localStorageist massiiivi ' + this.jars.length);

           //tekitan loendi htmli
           this.jars.forEach(function(jar){

               var new_jar = new Jar(jar.id, jar.title, jar.website, jar.watched);

				//uuendad moosipurgi id'd et hiljem jätkata kus pooleli jäi
				movies.instance.jar_id = jar.id;

               var li = new_jar.createHtmlElement();
               document.querySelector('.list-of-jars').appendChild(li);

           });

		   //fix suurendame id'd järgmise purgi jaoks ühe võrra
		   //kui eelmine oli 2 siis järgmine oleks 3
			this.jar_id++;
       }


       // esimene loogika oleks see, et kuulame hiireklikki nupul
       this.bindEvents();

     },

     bindEvents: function(){
       document.querySelector('.add-new-jar').addEventListener('click', this.addNewClick.bind(this));
       //kuulan trükkimist otsikastis
       document.querySelector('#search').addEventListener('keyup', this.search.bind(this));

     },

     deleteJar: function(event){

       //li element
       console.log(event.target.parentNode);
       //id (data-id väärtus)
       console.log(event.target.dataset.id);



       //kustutame HTMList
       var clicked_li = event.target.parentNode;
       document.querySelector('.list-of-jars').removeChild(clicked_li);

       //kustutan massiivist
       this.jars.forEach(function(jar, i){

           //sama id, mis vajutasime
           if(jar.id == event.target.dataset.id){
             //mis index ja mitu + lisaks saab asendada
             movies.instance.jars.splice(i, 1);
           }

       });

       //salvestan uuesti localStorageist
       localStorage.setItem('jars', JSON.stringify(this.jars));

     },



     search: function(event){
         //otsikasti väärtus
         var needle = document.querySelector('#search').value.toLowerCase();
         console.log(needle);

         var list = document.querySelectorAll('ul.list-of-jars li');
         console.log(list);

         for(var i = 0; i < list.length; i++){

             var li = list[i];

             // ühe listitemi sisu tekst
             var stack = li.querySelector('.content').innerHTML.toLowerCase();

             //kas otsisõna on sisus olemas
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
       //salvestame purgi
       //console.log(event);

       var title = document.querySelector('.title').value;
       var website = document.querySelector('.website').value;
       var watched = document.querySelector('.watched').value;

       //console.log(title + ' ' + ingredients);
       //1) tekitan uue Jar'i
       var new_jar = new Jar(this.jar_id, title, website, watched);

	   //suurenda id'd
	   this.jar_id++;

       //lisan massiiivi purgi
       this.jars.push(new_jar);
       console.log(JSON.stringify(this.jars));
       // JSON'i stringina salvestan localStorage'isse
       localStorage.setItem('jars', JSON.stringify(this.jars));

       // 2) lisan selle htmli listi juurde
       var li = new_jar.createHtmlElement();
       document.querySelector('.list-of-jars').appendChild(li);



       var watched = 0;
       var willwatch = 0;
       for(var j = 0; j < this.jars.length; ++j){
         if(this.jars[j].watched == "YES" || this.jars[j].watched == "yes" || this.jars[j].watched == "Yes" || this.jars[j].watched == "+"){
           watched++;
         }if(this.jars[j].watched == "NO" || this.jars[j].watched == "no" || this.jars[j].watched == "No" ||  this.jars[j].watched == "-"){
           willwatch++;
         }
       }

       document.querySelector('#mlist').innerHTML = "List Of movies: " + this.jars.length;
       document.querySelector('#watched').innerHTML = "Watched: " + watched;
       document.querySelector('#nwatch').innerHTML = "Need watched: " + willwatch;


     },
     deleteClick: function(event){

       var json = localStorage.getItem("jars");
       var json2 = JSON.parse(json);
       json2.pop();
       listOfjar.removeChild(listOfjars.lastChild);
       console.log("Viimane element kustutatud!");
       localStorage.setItem('jars', JSON.stringify(json2));
       //localStorage.clear(); // See teeb terve localStorage tühjaks

       var watched = 0;
       var willwatch = 0;
       for(var j = 0; j < json2.length; ++j){
         if(json2[j].watched == "YES" || json2[j].watched == "Yes" || json2[j].watched == "yes" || json2[j].watched == "+"){
           watched++;
         }if(json2[j].watched == "NO" || json2[j].watched == "No" || json2[j].watched == "no" || json2[j].watched == "-"){
           willwatch++;
         }
       }

       document.querySelector('#mlist').innerHTML = "List Of movies: " + json2.length;
       document.querySelector('#watched').innerHTML = "Watched: " + watched;
       document.querySelector('#nwatch').innerHTML = "Need watched: " + willwatch;


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
         /// 404 - ei olnud
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

   }; // MOOSIPURGI LÕPP

   var Jar = function(new_id, new_title, new_website, new_watched){
	 this.id = new_id;
     this.title = new_title;
     this.website = new_website;
     this.watched = new_watched;
     console.log('created new jar');
   };

   Jar.prototype = {
     createHtmlElement: function(){

       // võttes title ja ingredients ->
       /*
       li
        span.letter
          M <- title esimene täht
        span.content
          title | ingredients
       */

       var li = document.createElement('li');

       var span = document.createElement('span');
       span.className = 'letter';

       var letter = document.createTextNode(this.watched.charAt(0));
       if(this.watched.charAt(0) == "Y" || this.watched.charAt(0) == "y" || this.watched.charAt(0) == "+"){
         //console.log("green");
         span.style.color = "#1FCF3F";
         span.style.borderColor = "#1FCF3F";
       }else if(this.watched.charAt(0) == "N" || this.watched.charAt(0) == "n" || this.watched.charAt(0) == "-"){
         //console.log("red");
         span.style.color =  "#F50C33";
         span.style.borderColor =  "#F50C33";
       }
       span.appendChild(letter);

       li.appendChild(span);

       var span_with_content = document.createElement('span');
       span_with_content.className = 'content';

       var content = document.createTextNode(this.title + ' | ' + this.website + ' | ' + this.watched);
       span_with_content.appendChild(content);

       li.appendChild(span_with_content);

       //tekitan delete nuppu

       var delete_span = document.createElement('span');
       delete_span.appendChild(document.createTextNode(' kustuta'));

       delete_span.style.color = 'red';
       delete_span.style.cursor = 'pointer';

       // panen külge id
       delete_span.setAttribute('data-id', this.id);
       li.appendChild(delete_span);

       delete_span.addEventListener('click', movies.instance.deleteJar.bind(movies.instance));

       li.appendChild(delete_span);

       return li;

     }
   };

   // kui leht laetud käivitan Moosipurgi rakenduse
   window.onload = function(){
     var app = new movies();
   };

})();
