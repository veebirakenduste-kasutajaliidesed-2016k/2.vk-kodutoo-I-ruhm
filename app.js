(function(){
   "use strict";

   var ToDoList = function(){

     if(ToDoList.instance){
       return ToDoList.instance;
     }

     ToDoList.instance = this;
     this.routes = ToDoList.routes;


          //muuutujad
     this.click_count = 0;
     this.currentRoute = null;
     console.log(this);

    this.clock = document.getElementById('clock');

     this.tasks = [];
     this.init();
   };

   window.ToDoList = ToDoList;

   ToDoList.routes = {
     'home-view': {
       'render': function(){}
     },
     'list-view': {
       'render': function(){}
     },
     'manage-view': {
       'render': function(){
        }
     }
   };

   ToDoList.prototype = {

     init: function(){
       console.log('Rakendus läks tööle');
      this.writeDate();
      window.setInterval(this.writeDate.bind(this), 1000);
      window.addEventListener('hashchange', this.routeChange.bind(this));
       if(!window.location.hash){
         window.location.hash = 'home-view';
         }else{
       this.routeChange();
       }

       if(localStorage.tasks){
           this.tasks = JSON.parse(localStorage.tasks);
           console.log('laadisin localStorageist massiiivi ' + this.tasks.length);

           this.tasks.forEach(function(task){

               var new_task = new Task(task.id, task.title, task.description);

               var li = new_task.createHtmlElement();
               document.querySelector('.list-of-tasks').appendChild(li);

           });

       }
      this.bindEvents();

     },

     bindEvents: function(){
       document.querySelector('.add-new-task').addEventListener('click', this.addNewClick.bind(this));

       document.querySelector('#search').addEventListener('keyup', this.search.bind(this));

     },

     deleteTask: function(event){

  		//li element
  		console.log(event.target.parentNode);
  		//id (data-id väärtus)
  		console.log(event.target.dataset.id);

  		var c = confirm('kustuta?');

  		//kui ei olnud nõus katkestame
  		if(!c){ return; }

  		//kustutame HTMList
  		var clicked_li = event.target.parentNode;
  		document.querySelector('.list-of-tasks').removeChild(clicked_li);

  		//kustutan massiivist
  		this.tasks.forEach(function(task, i){

  			//sama id, mis vajutasime
  			if(task.id == event.target.dataset.id){

  				//mis index ja mitu. + lisaks saab asendada vajadusel
  				//http://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_splice1
  				ToDoList.instance.tasks.splice(i, 1);
  			}

          });

  		// salvesta uuesti localStorage'isse
         localStorage.setItem('tasks', JSON.stringify(this.tasks));

	},
     search: function(event){
         //otsikasti väärtus
         var needle = document.querySelector('#search').value.toLowerCase();
         console.log(needle);

         var list = document.querySelectorAll('ul.list-of-tasks li');
         console.log(list);

         for(var i = 0; i < list.length; i++){

             var li = list[i];

             var stack = li.querySelector('.content').innerHTML.toLowerCase();

             if(stack.indexOf(needle) !== -1){

                 li.style.display = 'list-item';

             }else{
                 //ei ole, index on -1, peidan
                 li.style.display = 'none';

             }

         }
     },

     addNewClick: function(event){

       var title = document.querySelector('.title').value;
       var description = document.querySelector('.description').value;

      var new_task = new Task(guid(), title, description);

       this.tasks.push(new_task);
       console.log(JSON.stringify(this.tasks));
       // JSON'i stringina salvestan localStorage'isse
       localStorage.setItem('tasks', JSON.stringify(this.tasks));

       // 2) lisan selle htmli listi juurde
       var li = new_task.createHtmlElement();
       document.querySelector('.list-of-tasks').appendChild(li);
// tühjendame pärast sisestamist lahtrid
       document.querySelector('.title').value='';
       document.querySelector('.description').value='';

// liigume pärast sisestamist halduse lehele
      window.location.hash = 'list-view';

     },



  writeDate: function(number, format){
    console.log('romil');
         var today = new Date();
         var year = today.getFullYear();
         var month = today.getMonth();
         var date = today.getDate();
         var day = today.getDay();
         var hours = today.getHours();
         var minutes = today.getMinutes();
         var seconds = today.getSeconds();
         console.log(this.clock);
         this.clock.innerHTML = ' Time:' +  setZeroBefore (hours) + ':' + setZeroBefore(minutes) +':'+ setZeroBefore(seconds) +
         ' Date:' + setZeroBefore(date) + '.' + setZeroBefore(month+1) + '.' + year;

    },

     routeChange: function(event){

       this.currentRoute = location.hash.slice(1);
       console.log(this.currentRoute);

       if(this.routes[this.currentRoute]){

         this.updateMenu();

         this.routes[this.currentRoute].render();


       }else{
         /// 404 - ei olnud
       }


     },

     updateMenu: function() {
       document.querySelector('.active-menu').className = document.querySelector('.active-menu').className.replace('active-menu', '');

       document.querySelector('.'+this.currentRoute).className += ' active-menu';

     }

   };


// ToDoListi lõpp

   var Task = function(new_id, new_title, new_description){
     this.id = new_id;
     this.title = new_title;
     this.description = new_description;
     console.log('created new task');
   };

   Task.prototype = {
     createHtmlElement: function(){

       // võttes title ja description ->
       /*
       li
        span.letter
          M <- title esimene täht
        span.content
          title | description
       */

       var li = document.createElement('li');

       var span = document.createElement('span');
       span.className = 'letter';

       var letter = document.createTextNode(this.title.charAt(0));
       span.appendChild(letter);

       li.appendChild(span);

       var span_with_content = document.createElement('span');
       span_with_content.className = 'content';

       var content = document.createTextNode(this.title + ' | ' + this.description);
       span_with_content.appendChild(content);

       li.appendChild(span_with_content);

       //kustutamine
       var delete_span = document.createElement('span');
       delete_span.appendChild(document.createTextNode(' kustuta'));

       delete_span.style.color = 'red';
       delete_span.style.cursor = 'pointer';

       //panen külge id
       delete_span.setAttribute('data-id', this.id);

       delete_span.addEventListener('click', ToDoList.instance.deleteTask.bind(ToDoList.instance));

       li.appendChild(delete_span);
       return li;

     }
   };




   /* HELPERID*/
 function guid() {
   return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
   s4() + '-' + s4() + s4() + s4();
 }

 function s4() {
   return Math.floor((1 + Math.random()) * 0x10000)
   .toString(16)
   .substring(1);
 }

function setZeroBefore(number){
   if(number < 10){
     number = '0' + number;
   }
   return number;
}




   // kui leht laetud käivitan Moosipurgi rakenduse
   window.onload = function(){
     var app = new ToDoList();
   };

})();
