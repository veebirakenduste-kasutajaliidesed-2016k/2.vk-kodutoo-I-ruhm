(function(){
   "use strict";
   
	var Moosipurk = function(){

	if(Moosipurk.instance){
		return Moosipurk.instance;
	}
	Moosipurk.instance = this;
		this.routes = Moosipurk.routes;
		console.log('moosipurgi sees');

	this.click_count = 0;
	this.currentRoute = null;
	console.log(this);
	this.jars = [];
	this.init();
	};
   
	window.Moosipurk = Moosipurk;
   
	Moosipurk.routes = {
	 'home-view': {
	   'render': function(){
		 // run on load
		 console.log('>>>>main page');
	   }
	},
		'list-view': {
	   'render': function(){
		 console.log('>>>>list');
	   }
	},
	 'manage-view': {
	   'render': function(){
	   }
	}
	};
   
	Moosipurk.prototype = {
	
	init: function(){
       console.log('Rakendus läks tööle');
       window.addEventListener('hashchange', this.routeChange.bind(this));
       if(!window.location.hash){
         window.location.hash = 'home-view';
       }else{
         this.routeChange();
       }
       if(localStorage.jars){
           
           this.jars = JSON.parse(localStorage.jars);
           console.log('laadisin localStorageist massiiivi ' + this.jars.length);
           //list
           this.jars.forEach(function(jar){
               var new_jar = new Jar(jar.title, jar.ingredients);
               var li = new_jar.createHtmlElement();
               document.querySelector('.list-of-jars').appendChild(li);
           });
       }
       this.bindEvents();
    },

    bindEvents: function(){
       document.querySelector('.add-new-jar').addEventListener('click', this.addNewClick.bind(this));
       document.querySelector('#search').addEventListener('keyup', this.search.bind(this));

    },
	
	search: function(event){
         var needle = document.querySelector('#search').value.toLowerCase();
         console.log(needle);
         var list = document.querySelectorAll('ul.list-of-jars li');
         console.log(list);
         for(var i = 0; i < list.length; i++){
             var li = list[i];
             var stack = li.querySelector('.content').innerHTML.toLowerCase();
             if(stack.indexOf(needle) !== -1){
                 li.style.display = 'list-item';
             }else{
                 li.style.display = 'none';
             }
         }
     },
	 
	addNewClick: function(event){
       var title = document.querySelector('.title').value;
       var ingredients = document.querySelector('.ingredients').value;
       var new_jar = new Jar(title, ingredients);
       this.jars.push(new_jar);
       console.log(JSON.stringify(this.jars));
       localStorage.setItem('jars', JSON.stringify(this.jars));
       var li = new_jar.createHtmlElement();
       document.querySelector('.list-of-jars').appendChild(li);
    },
	
	routeChange: function(event){
       
       this.currentRoute = location.hash.slice(1);
       console.log(this.currentRoute);
       
       if(this.routes[this.currentRoute]){
         
         this.updateMenu();
         this.routes[this.currentRoute].render();
       }else{
         
       }
     },

     updateMenu: function() {
       document.querySelector('.active-menu').className = document.querySelector('.active-menu').className.replace('active-menu', '');
       document.querySelector('.'+this.currentRoute).className += ' active-menu';

     }

   }; 
   
   var Jar = function(new_title, new_ingredients){
     this.title = new_title;
     this.ingredients = new_ingredients;
     console.log('created new jar');
   };
   
   Jar.prototype = {
     createHtmlElement: function(){

       var li = document.createElement('li');

       var span = document.createElement('span');
       span.className = 'letter';

       var letter = document.createTextNode(this.title.charAt(-1));
       span.appendChild(letter);

       li.appendChild(span);

       var span_with_content = document.createElement('span');
       span_with_content.className = 'content';

       var content = document.createTextNode(this.title + ' | ' + this.ingredients);
       span_with_content.appendChild(content);

       li.appendChild(span_with_content);

       return li;

     }
	};
   
	//lehe laadimisel moosipurk
	window.onload = function(){
		var app = new Moosipurk();
	};
   
})();