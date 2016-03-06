//alert("todo.js");
(function(){
	var todoList = function(){
		if(todoList.instance){
			return todoList.instance;
		}
		todoList.instance = this;
		this.routes = todoList.routes;
		
		console.log("todoList activated")
		this.currentRoute = null;
		this.items = [];
		this.init();
	};
	window.todoList = todoList;
	todoList.routes = {
		'list-view':{
			'render': function(){
			window.setTimeout(function(){
				document.querySelector('.loading').innerHTML = 'Done';
			}, 3000);
			console.log('List')
			}
		},
		'manage-view': {
		'render': function(){
        console.log('manage');
       }
     }
	};
	todoList.prototype = {
		init: function(){
			console.log("Application started");
			window.addEventListener('hashchange', this.routeChange.bind(this));
		   if(!window.location.hash){
			 window.location.hash = 'list-view';
			 // routechange siin ei ole vaja sest käsitsi muutmine käivitab routechange event'i ikka
		   }else{
			 //esimesel käivitamisel vaatame urli üle ja uuendame menüüd
			 this.routeChange();
		   }
		 if(localStorage.items){
         //Võtan stringi ja teen tagasi objektideks.
         this.items = JSON.parse(localStorage.items);
         console.log("Laadisin localStorage'ist massiivi " + this.items.length);
         //Tekitan loendi htmli
         this.items.forEach(function(item){
           var new_item = new Item(item.activity, item.time);
           var li = new_item.createHtmlElement();
           var buttons = document.getElementsByClassName('remove');
           for (var i=0; i < buttons.length; i++) {
              buttons[i].addEventListener('click', remove);
            };
           document.querySelector('.list-of-items').appendChild(li);
         });
       }
	   this.bindEvents();
		},
		/////////////////////////////////77777
		bindEvents: function(){
       document.querySelector('.add-new-item').addEventListener('click', this.addNewClick.bind(this));
       document.querySelector('#search').addEventListener('keyup', this.search.bind(this));
     },
     search: function(event){
       //Otsikasti väärtus
       var needle = document.querySelector('#search').value;
       console.log(needle);
       var list= document.querySelectorAll('.list-of-items li');
       //list.forEach(function(li){
       for(var i = 0; i < list.length; i++){
         var li= list[i];
         //Ühe listiitemi sisu tekst
         var stack = li.querySelector('.content').innerHTML;
         //Kas otsisõna on sisus olemas)
         if(stack.indexOf(needle) !== -1){
           //olemas
           li.style.display = 'list-item';
         }
         else{
           //Ei ole, index on -1
           li.style.display = 'none';
         }
       }
     },

     addNewClick: function(event){
       //salvestame purgi
       //console.log(event);

       var activity = document.querySelector('.activity').value;
       var time = document.querySelector('.time').value;
       //console.log(title + ' ' + ingredients);
       //1) tekitan uue item'i
       var new_item = new Item(activity, time);
       //Lisan massiivi purgi
       this.items.push(new_item);
       console.log(JSON.stringify(this.items));
       //JSONi stringina salvestan local storage'isse
       localStorage.setItem("items", JSON.stringify(this.items));

       // 2) lisan selle htmli listi juurde
       var li = new_item.createHtmlElement();
       document.querySelector('.list-of-items').appendChild(li);


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

     },
     remove: function(){
       var id = this.getAttribute('id');

     }

   }; //Listi lõpp
	var Iar = function(new_activity, new_time){
     this.action = new_action;
     this.time = new_time;
     console.log('New list item created');
	};
	/////////
	Item.prototype = {
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

       var letter = document.createTextNode(this.title.charAt(0));
       span.appendChild(letter);

       li.appendChild(span);

       var span_with_content = document.createElement('span');
       span_with_content.className = 'content';

       var content = document.createTextNode(this.activity + ' | ' + this.time);
       span_with_content.appendChild(content);

       li.appendChild(span_with_content);

       return li;
//
     }
   };

   // kui leht laetud käivitan Moosipurgi rakenduse
   window.onload = function(){
     var app = new todoList();
   };
})();