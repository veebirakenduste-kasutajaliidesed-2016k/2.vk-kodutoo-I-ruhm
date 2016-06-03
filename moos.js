(function(){
   "use strict";

   var Notification = function(){

     // SEE ON SINGLETON PATTERN
     if(Notification.instance){
       return Notification.instance;
     }
     //this viitab Moosipurk fn
     Notification.instance = this;

     this.routes = Notification.routes;
     // this.routes['home-view'].render()

     console.log('moosipurgi sees');

     // KÃ•IK muuutujad, mida muudetakse ja on rakendusega seotud defineeritakse siin
     this.click_count = 0;
     this.currentRoute = null;
     console.log(this);

     //id, mis läheb purgile kaasa
     this.jar_id = 0;

     // hakkan hoidma kÃµiki purke
     this.jars = [];

     // Kui tahan Moosipurgile referenci siis kasutan THIS = MOOSIPURGI RAKENDUS ISE
     this.init();
   };

   window.Notification = Notification; // Paneme muuutja kÃ¼lge

   Notification.routes = {
     'home-view': {
       'render': function(){
         // kÃ¤ivitame siis kui lehte laeme
         console.log('>>>>avaleht');
       }
     },
     'list-view': {
       'render': function(){
         // kÃ¤ivitame siis kui lehte laeme
         console.log('>>>>loend');

         //simulatsioon laeb kaua
         window.setTimeout(function(){
           document.querySelector('.loading').innerHTML = 'laetud!';
         }, 3000);

       }
     },
     'manage-view': {
       'render': function(){
         // kÃ¤ivitame siis kui lehte laeme
       }
     }
   };

   // KÃµik funktsioonid lÃ¤hevad Moosipurgi kÃ¼lge
   Notification.prototype = {

     init: function(){
       console.log('Rakendus lÃ¤ks tÃ¶Ã¶le');

       //kuulan aadressirea vahetust
       window.addEventListener('hashchange', this.routeChange.bind(this));

       // kui aadressireal ei ole hashi siis lisan juurde
       if(!window.location.hash){
         window.location.hash = 'home-view';
         // routechange siin ei ole vaja sest kÃ¤sitsi muutmine kÃ¤ivitab routechange event'i ikka
       }else{
         //esimesel kÃ¤ivitamisel vaatame urli Ã¼le ja uuendame menÃ¼Ã¼d
         this.routeChange();
       }

       //saan kÃ¤tte purgid localStorage kui on
       if(localStorage.jars){
           //vÃµtan stringi ja teen tagasi objektideks
           this.jars = JSON.parse(localStorage.jars);
           console.log('laadisin localStorageist massiiivi ' + this.jars.length);

           //tekitan loendi htmli
           this.jars.forEach(function(jar){

               var new_jar = new Jar(jar.id, jar.description, jar.priority);

               //uuendad moosipurgi id'd et hiljem jätkata kus pooleli jäi
               Notification.instance.jar_id = jar.id;

               var li = new_jar.createHtmlElement();
               document.querySelector('.list-of-jars').appendChild(li);

           });

           //suurendame id'd järgmise purgi jaoks ühe võrra
           this.jar_id++;

       }


       // esimene loogika oleks see, et kuulame hiireklikki nupul
       this.bindEvents();

     },

     bindEvents: function(){
       document.querySelector('.add-new-notification').addEventListener('click', this.addNewClick.bind(this));

       //kuulan trÃ¼kkimist otsikastis
       document.querySelector('#search').addEventListener('keyup', this.search.bind(this));

     },

	 deleteJar: function(event){

		//li element
		console.log(event.target.parentNode);
		//id (data-id vÃ¤Ã¤rtus)
		console.log(event.target.dataset.id);

		var c = confirm('kustuta?');

		//kui ei olnud nÃµus katkestame
		if(!c){ return; }

		//kustutame HTMList
		var clicked_li = event.target.parentNode;
		document.querySelector('.list-of-jars').removeChild(clicked_li);

		//kustutan massiivist
		this.jars.forEach(function(jar, i){

			//sama id, mis vajutasime
			if(jar.id == event.target.dataset.id){

				//mis index ja mitu. + lisaks saab asendada vajadusel
				//http://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_splice1
				Notification.instance.jars.splice(i, 1);
			}

        });

		// salvesta uuesti localStorage'isse
       localStorage.setItem('jars', JSON.stringify(this.jars));

	 },
     search: function(event){
         //otsikasti vÃ¤Ã¤rtus
         var needle = document.querySelector('#search').value.toLowerCase();
         console.log(needle);

         var list = document.querySelectorAll('ul.list-of-jars li');
         console.log(list);

         for(var i = 0; i < list.length; i++){

             var li = list[i];

             // Ã¼he listitemi sisu tekst
             var stack = li.querySelector('.content').innerHTML.toLowerCase();

             //kas otsisÃµna on sisus olemas
             if(stack.indexOf(needle) !== -1){
                 //olemas
                 li.style.display = 'list-item';

             }else{
                 //ei ole, index on -1, peidan
                 li.style.display = 'none';

             }

         }
     },

     changeJar: function(event){
       var li = event.target.parentNode;
       var new_description = prompt("Uus teade");
       var new_priority = prompt("Uus prioriteet");

       li.querySelector(".content").innerHTML = new_description;
       li.querySelector(".content").innerHTML = new_priority;

       this.jars.forEach(function(jar, i){
         if(jar.id == event.target.dataset.id){
           jar.description = new_description;
           jar.priority = new_priority;
           Notification.instance.jars.splice(i, 1, jar);
         }
       });
       localStorage.setItem('jars', JSON.stringify(this.jars));
     },

     addNewClick: function(event){
       //salvestame purgi
       //console.log(event);

       var description = document.querySelector('.description').value;
       var priority = document.querySelector('.priority').value;

       //console.log(time + ' ' + description);
       //1) tekitan uue Jar'i
       var new_jar = new Jar(this.jar_id, description, priority);

        this.jar_id++;
       //lisan massiiivi purgi
       this.jars.push(new_jar);
       console.log(JSON.stringify(this.jars));
       // JSON'i stringina salvestan localStorage'isse
       localStorage.setItem('jars', JSON.stringify(this.jars));

       // 2) lisan selle htmli listi juurde
       var li = new_jar.createHtmlElement();
       document.querySelector('.list-of-jars').appendChild(li);

       var high = 0;
       var medium = 0;
       var low = 0;
       for(var j = 0; j < this.jars.length; j++){
         if(this.jars[j].priority == "3"){
           high++;
         }if(this.jars[j].priority == "2"){
           medium++;
         }if(this.jars[j].priority == "1"){
           low++;
         }
       }

       document.querySelector('#highPriority').innerHTML = "Kõrge prioriteet: " + high;
       document.querySelector('#mediumPriority').innerHTML = "Keskmine prioriteet: " + medium;
       document.querySelector('#lowPriority').innerHTML = "Madal prioriteet: " + low;


     },

     routeChange: function(event){

       //kirjutan muuutujasse lehe nime, vÃµtan maha #
       this.currentRoute = location.hash.slice(1);
       console.log(this.currentRoute);

       //kas meil on selline leht olemas?
       if(this.routes[this.currentRoute]){

         //muudan menÃ¼Ã¼ lingi aktiivseks
         this.updateMenu();

         this.routes[this.currentRoute].render();


       }else{
         /// 404 - ei olnud
       }


     },

     updateMenu: function() {
       //http://stackoverflow.com/questions/195951/change-an-elements-class-with-javascript
       //1) vÃµtan maha aktiivse menÃ¼Ã¼lingi kui on
       document.querySelector('.active-menu').className = document.querySelector('.active-menu').className.replace('active-menu', '');

       //2) lisan uuele juurde
       //console.log(location.hash);
       document.querySelector('.'+this.currentRoute).className += ' active-menu';

     }

   }; // MOOSIPURGI LÃ•PP

   var Jar = function(new_id, new_description, new_priority){
	    this.id = new_id;
     this.description = new_description;
     this.priority = new_priority;
     console.log('created new jar');
   };

   Jar.prototype = {
     createHtmlElement: function(){

       // vÃµttes time ja description ->
       /*
       li
        span.letter
          M <- time esimene tÃ¤ht
        span.content
          time | description
       */

       var li = document.createElement('li');

       var span = document.createElement('span');
       span.className = 'letter';

       var letter = document.createTextNode(this.priority.charAt(0));
       if(this.priority.charAt(0) == "3"){
         span.style.color = "#FF0000"; //punane
         span.style.borderColor = "#FF0000";
       }else if(this.priority.charAt(0) == "2"){
         span.style.color = "#FFFF00"; //kollane
         span.style.borderColor = "#FFFF00";
       }else{
         span.style.color = "#00FF00"; //roheline
         span.style.borderColor = "#00FF00";
       }
       span.appendChild(letter);

       li.appendChild(span);

       var span_with_content = document.createElement('span');
       span_with_content.className = 'content';

       var content = document.createTextNode(this.description);
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

	   //panen kÃ¼lge id
	   delete_span.setAttribute('data-id', this.id);
     change_span.setAttribute('data-id', this.id);

	   delete_span.addEventListener('click', Notification.instance.deleteJar.bind(Notification.instance));
     change_span.addEventListener('click', Notification.instance.changeJar.bind(Notification.instance));

     li.appendChild(delete_span);
     li.appendChild(change_span);

       return li;

     }
   };



   // kui leht laetud kÃ¤ivitan Moosipurgi rakenduse
   window.onload = function(){
     var app = new Notification();
   };

})();
