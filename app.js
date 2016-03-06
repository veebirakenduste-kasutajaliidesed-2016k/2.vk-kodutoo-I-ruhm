(function(){
   "use strict";

   var Trenniplaan = function(){

     // SEE ON SINGLETON PATTERN
     if(Trenniplaan.instance){
       return Tranniplaan.instance;
     }
     //this viitab Trenniplaan fn
     Trenniplaan.instance = this;

     this.routes = Trenniplaan.routes;
     // this.routes['home-view'].render()

     console.log('trenniplaani sees');

     // KÕIK muuutujad, mida muudetakse ja on rakendusega seotud defineeritakse siin
     this.click_count = 0;
     this.currentRoute = null;
     console.log(this);

     // hakkan hoidma plaane
     this.jars = [];

     // Kui tahan Trenniplaanile referenci siis kasutan THIS = TRENNIPLAAN RAKENDUS ISE
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
		 console.log('>>>>haldus');
       }
     }
   };

   // Kõik funktsioonid lähevad Tranniplaani külge
   Trenniplaan.prototype = {

     init: function(){
       console.log('Rakendus läks tööle');
       window.addEventListener('hashchange', this.routeChange.bind(this));
       if(!window.location.hash){
         window.location.hash = 'home-view';
       }else{
         this.routeChange();
       }
	   
       if(localStorage.jars){
           this.createListFromArray(JSON.parse(localStorage.jars));
           console.log('laadisin localStorageist');
       }else{
         var xhttp = new XMLHttpRequest();
         xhttp.onreadystatechange = function() {
           if (xhttp.readyState == 4 && xhttp.status == 200) {
			   
             var result =JSON.parse(xhttp.responseText);
             Trenniplaan.instance.createListFromArray(result);
             console.log('laadisin serverist');
           }
         };
         xhttp.open("GET", "saveData.php", true);
         xhttp.send();
       }
	   
	   window.addEventListener('keydown', this.newKeyPress.bind(this));
	   this.show();
	   this.clickOnButton_1();
     },
	 
	 show: function(){
      while(this.list_of_events.firstChild){
        this.list_of_events.removeChild(this.list_of_events.firstChild);
      }
      if(localStorage.events){
        this.events = JSON.parse(localStorage.events);
        for(var i = 0; i < this.events.length; i++){
          var new_event = new Event(this.events[i].event_date, this.events[i].event_description);
          var li = new_event.createHtmlElement();
          var item = this.list_of_events.appendChild(li);
          item.innerHTML += " <button class='remove' id='" + i + "'>&#10540</button>";
          item.innerHTML += " <button class='change' id='" + i + "'>&#10227</button>";
        }
      }
    },
	
	newKeyPress: function(event){
      if(event.keyCode === 32){
        this.to_hide.style.visibility = "visible";
        this.menu.style.visibility = "visible";
        document.querySelector('#insert-view').style.visibility = "visible";
        document.querySelector('#list-view').style.visibility = "visible";
        document.body.style.backgroundColor = "white";
        event_message.innerHTML = "";
      }
    },

     createListFromArray: function(arrayOfObjects){

       this.jars = arrayOfObjects;

       //tekitan loendi htmli
       this.jars.forEach(function(jar){

           var new_jar = new Jar(jar.title, jar.repeats);

           var li = new_jar.createHtmlElement();
           document.querySelector('.list-of-jars').appendChild(li);

       });


      // esimene loogika oleks see, et kuulame hiireklikki nupul
      this.bindEvents();

     },
	 
	 clickOnButton_1: function(){
      document.querySelector('#add_new_event').addEventListener('click', this.newClick.bind(this));
      this.clickOnButton_2();
    },
	 
	 clickOnButton_2: function(){
      var buttons_remove = document.getElementsByClassName('remove');
      var buttons_change = document.getElementsByClassName('change');
      for(var i = 0; i < buttons_remove.length; i++) {
        buttons_remove[i].addEventListener('click', this.remove.bind(this));
        buttons_change[i].addEventListener('click', this.change.bind(this));
      }
    },
	
	remove: function(event){
      var index = event.target.id;
      this.events = JSON.parse(localStorage.events);
      this.events.splice(index, 1);
      localStorage.setItem('events', JSON.stringify(this.events));
      this.show();
      this.clickOnButton_2();
    },
	
	change: function(event){
      var index = event.target.id;
      this.events = JSON.parse(localStorage.events);
      this.events[index].event_description = prompt("Muuda");
      localStorage.setItem('events', JSON.stringify(this.events));
      this.show();
      this.clickOnButton_2();
    },
	
	
     bindEvents: function(){
       document.querySelector('.add-new-jar').addEventListener('click', this.addNewClick.bind(this));

       //kuulan trükkimist otsikastis
       document.querySelector('#search').addEventListener('keyup', this.search.bind(this));

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
	 
	 newClick: function(event){
      var title = document.querySelector('#title').value;
      var repeats = document.querySelector('#repeats').value;

      if(title && repeats && Date.parse(title) > Date.parse(Date())){
        var new_event = new Event(title, repeats);
        this.events.push(new_event);
        console.log(JSON.stringify(this.events));
        localStorage.setItem('events', JSON.stringify(this.events));
        var li = new_event.createHtmlElement();
        var item = this.list_of_events.appendChild(li);
        item.innerHTML += " <button class='remove' id='" + (this.events.length - 1) + "'>&#10540</button>";
        item.innerHTML += " <button class='change' id='" + (this.events.length - 1) + "'>&#10227</button>";
        var buttons_remove = document.getElementsByClassName('remove');
        var buttons_change = document.getElementsByClassName('change');
        buttons_remove[this.events.length - 1].addEventListener('click', this.remove.bind(this));
        buttons_change[this.events.length - 1].addEventListener('click', this.change.bind(this));
        error.innerHTML = "";
      }else if(Date.parse(title) < Date.parse(Date())){
        error.innerHTML = "<br>Kuupäev peab olema tulevikus!";
      }else{
        error.innerHTML = "<br>Tekst või kuupäev puudub!";
      }
    },

     addNewClick: function(event){
       var title = document.querySelector('.title').value;
       var repeats = document.querySelector('.repeats').value;


       var new_jar = new Jar(title, repeats);

       this.jars.push(new_jar);
       console.log(JSON.stringify(this.jars));
	   
       localStorage.setItem('jars', JSON.stringify(this.jars));

       var xhttp = new XMLHttpRequest();
       xhttp.onreadystatechange = function() {
         if (xhttp.readyState == 4 && xhttp.status == 200) {

           console.log('salvestas serverisse');

         }
       };
       console.log("saveData.php?title="+title+"&repeats=" +repeats);
       xhttp.open("GET", "saveData.php?title="+title+"&repeats=" +repeats, true);
       xhttp.send();




       // 2) lisan selle htmli listi juurde
       var li = new_jar.createHtmlElement();
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
         // 404 - ei olnud
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

   }; // TRENNIPLAANI LÕPP

   var Jar = function(new_title, new_repeats){
     this.title = new_title;
     this.repeats = new_repeats;
     console.log('created new jar');
   };

   Jar.prototype = {
     createHtmlElement: function(){

       // võttes title ja repeats ->
       /*
       li
        span.letter
          M <- title esimene täht
        span.content
          title | repeats
       */

       var li = document.createElement('li');

       var span = document.createElement('span');
       span.className = 'letter';

       var letter = document.createTextNode(this.title.charAt(0));
       span.appendChild(letter);

       li.appendChild(span);

       var span_with_content = document.createElement('span');
       span_with_content.className = 'content';

       var content = document.createTextNode(this.title + ' | ' + this.repeats);
       span_with_content.appendChild(content);

       li.appendChild(span_with_content);

       return li;

     }
   };

   // kui leht laetud käivitan Trenniplaani rakenduse
   window.onload = function(){
     var app = new Trenniplaan();
   };

})();