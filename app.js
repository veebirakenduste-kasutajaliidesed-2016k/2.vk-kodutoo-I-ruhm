(function(){
   "use strict";

   var Meelespea = function(){

     // SEE ON SINGLETON PATTERN
     if(Meelespea.instance){
       return Meelespea.instance;
     }
     //this viitab Meelespea fn
     Meelespea.instance = this;

     this.routes = Meelespea.routes;
     // this.routes['home-view'].render()

     console.log('meelespea sees');

     // KÕIK muuutujad, mida muudetakse ja on rakendusega seotud defineeritakse siin
     this.click_count = 0;
     this.currentRoute = null;
     console.log(this);

      this.notebook_id = 0;

	 //hakkan hoidma kõiki purke
	 this.notebooks=[];

     // Kui tahan meelespeale referenci siis kasutan THIS = meelespea RAKENDUS ISE
     this.init();
   };

   window.Meelespea = Meelespea; // Paneme muuutja külge

   Meelespea.routes = {
     'home-view': {
       'render': function(){
         // käivitame siis kui lehte laeme
         console.log('>>>>avaleht');

         window.setTimeout(function(){
           document.querySelector('.loading1').innerHTML = 'laetud!';
         }, 3000);
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

   // Kõik funktsioonid lähevad meelespea külge
   Meelespea.prototype = {

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
       if(localStorage.notebooks){
         //võtan stringi ja teen tagasi objektiks
         this.notebooks = JSON.parse(localStorage.notebooks);
         this.notebooks.sort(function(a,b){return new Date(a.reminder_date).getTime() - new Date(b.reminder_date).getTime()
         });
         console.log("laadinsin localStorage'ist massiivi " + this.notebooks.length);



         //tekitan loendi htmli
         this.notebooks.forEach(function(notebook){

           var new_notebook = new Notebook(notebook.id, notebook.reminder_date, notebook.reminder_content);
            Meelespea.instance.notebook_id = notebook.id;

           var li = new_notebook.createHtmlElement();
           document.querySelector('.list-of-notebooks').appendChild(li);

         });
          this.notebook_id++;
       }

       //saan kätte purgid localStorage kui on
       if(localStorage.notebooks){

         var i, j, k;
           var d = new Date();
           var paev = d.getDay();
           var paevad = [];
           paevad.push("Sun","Mon","Tue","Wed","Thu","Fri","Sat");

           for (i=0; i<paevad.length; i++){
             if (paev==i){
               paev=paevad[i];}
            }
           var kuu = d.getMonth();
           var kuud = [];
            kuud.push("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Now","Dec");
            for (j=0; j<kuud.length; j++){
            	if (kuu==j){
            		kuu=kuud[j];}
            }
           var kp = d.getDate();
           var aasta = d.getFullYear();
           var newdate=paev+" "+ kuu+" "+kp+" "+aasta;


         //võtan stringi ja teen tagasi objektiks
         this.notebooks = JSON.parse(localStorage.notebooks);
         console.log("laadinsin localStorage'ist massiivi " + this.notebooks.length);



             //tekitan loendi htmli
             this.notebooks.forEach(function(notebook){
               if (notebook.reminder_date==newdate){

               var new_notebook = new Notebook(notebook.id, notebook.reminder_date, notebook.reminder_content);
                Meelespea.instance.notebook_id = notebook.id;

               var li = new_notebook.createHtmlElement();
               document.querySelector('.list-of-notebooksToday').appendChild(li);

                }
             });

              this.notebook_id++;


         }




       // esimene loogika oleks see, et kuulame hiireklikki nupul
       this.bindEvents();

     },

     bindEvents: function(){
       document.querySelector('.add-new-notebook').addEventListener('click', this.addNewClick.bind(this));


     },



          deleteNotebook: function(event){

            //li element
            console.log(event.target.parentNode);
            //id (data-id)
            console.log(event.target.dataset.id);

            var c = confirm('Kas oled kindel, et tahad kustutada?');

            //kui ei ole nõus kustutama, katkestame

            if(!c){ return; }

            //kustutame HTMList
            var clicked_li = event.target.parentNode;
            if (window.location.href==("http://greeny.cs.tlu.ee/~kelllep/veebirakenduste-kasutajaliidesed/2.vk-kodutoo-I-ruhm/app.html#home-view")){
              document.querySelector('.list-of-notebooksToday').removeChild(clicked_li);

            //kustutan massiiivist
            this.notebooks.forEach(function(notebook, i){

                 //sama id mis vajutasime
                if(notebook.id == event.target.dataset.id){

                  //mis indeks ja mitu + lisaks saab asendada vajadusel
                  Meelespea.instance.notebooks.splice(i, 1);
                }
              });

            //salvestan uuesti localStorage'isse
            localStorage.setItem('notebooks', JSON.stringify(this.notebooks));

          } else{
                document.querySelector('.list-of-notebooks').removeChild(clicked_li);
                //kustutan massiiivist
                this.notebooks.forEach(function(notebook, i){

                     //sama id mis vajutasime
                    if(notebook.id == event.target.dataset.id){

                      //mis indeks ja mitu + lisaks saab asendada vajadusel
                      Meelespea.instance.notebooks.splice(i, 1);
                    }
                  });

                //salvestan uuesti localStorage'isse
                localStorage.setItem('notebooks', JSON.stringify(this.notebooks));

            }

          },

        addNewClick: function(event){
       //salvestame purgi
       //console.log(event);

       var reminder_date = document.querySelector('.reminder_date').value;
       var reminder_content = document.querySelector('.reminder_content').value;

       //console.log(reminder_date + ' ' + reminder_content);
       //1) tekitan uue Notebook'i
       var new_notebook = new Notebook(this.notebook_id, reminder_date, reminder_content);

        this.notebook_id++;

	   	//lisan massiivi purgi
		  this.notebooks.push(new_notebook);
		  console.log(JSON.stringify(this.notebooks));
      //JSON'i stringina salvestasn localStorage'isse
      localStorage.setItem("notebooks", JSON.stringify(this.notebooks));



       // 2) lisan selle htmli listi juurde
       var li = new_notebook.createHtmlElement();
       document.querySelector('.list-of-notebooks').appendChild(li);


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

   }; // MEELESPEA LÕPP

   var Notebook = function(new_id, new_reminder_date, new_reminder_content){
     this.id = new_id;
     this.reminder_date = new_reminder_date;
     this.reminder_content = new_reminder_content;
     console.log('created new notebook');
   };

   Notebook.prototype = {
     createHtmlElement: function(){

       // võttes reminder_date ja reminder_content ->
       /*
       li
        span.letter
          M <- reminder_date esimene täht
        span.content
          reminder_date | reminder_content
       */

       var li = document.createElement('li');

       var span = document.createElement('span');
       span.className = 'letter';

       var letter = document.createTextNode(this.reminder_date.charAt(8)+this.reminder_date.charAt(9));
       span.appendChild(letter);

       li.appendChild(span);

       var span_with_content = document.createElement('span');
       span_with_content.className = 'content';

       var content = document.createTextNode(this.reminder_date + ' | ' + this.reminder_content);
       span_with_content.appendChild(content);

       li.appendChild(span_with_content);

        //delete nupp

        var delete_span = document.createElement('span');
        delete_span.appendChild(document.createTextNode(' Tehtud!'));

        delete_span.style.color = 'red';
        delete_span.style.cursor = 'pointer';

        //id külge

        delete_span.setAttribute('data-id', this.id);

        delete_span.addEventListener('click', Meelespea.instance.deleteNotebook.bind(Meelespea.instance));

        li.appendChild(delete_span);

        return li;

     }
   };

   // kui leht laetud käivitan meelespea rakenduse
   window.onload = function(){
     var app = new Meelespea();

      //tänane kp: Mon Feb 01 2016 12:43:50 GMT+0200 (FLE Standard deadline)

      var clock = document.getElementById("clock");

      //enne timeouti kirjutan ühe korra ära
      writeDate();

      window.setInterval(function(){

        //iga ooteaja järel käivitatakse
          writeDate();
      }, 100);//millisekundid - 1000ms = 1 s

     };


     function writeDate(){
      var today = new Date();

      var hours = today.getHours();
      var minutes = today.getMinutes();
      var seconds = today.getSeconds();

      var day =today.getDate();
      var month = today.getMonth()+1;
      var year = today.getFullYear();

      seconds = setZeroBefore(seconds);

      date.innerHTML = setZeroBefore(day) + "." + setZeroBefore(month) + "." + (year);

      clock.innerHTML = setZeroBefore(hours) + ":" + setZeroBefore(minutes) + ":" +seconds;
     }

     //lisab nulli kui arv on 10st väiksem
     function setZeroBefore(number){
      if(number < 10){
        number= "0" + number;
      }
      return number;

   }

})();
