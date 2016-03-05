(function(){
   "use strict";

   var CheckList = function(){

     if(CheckList.instance){
       return CheckList.instance;
     }
     CheckList.instance = this;

     console.log('checklist sees');

     this.click_count = 0;
	 this.currentRoute = null;
     console.log(this);
	
	 this.jars = [];
     this.init();
   };

   window.CheckList = CheckList; 

   CheckList.prototype = {
   
	init: function(){
       console.log('start');

       if(localStorage.jars){
           this.jars = JSON.parse(localStorage.jars);
           console.log('laadisin localStorageist massiiivi ' + this.jars.length);

           this.jars.forEach(function(jar){

               var new_jar = new Jar(jar.title);

               var li = new_jar.createHtmlElement();
               document.querySelector('.list-of-jars').appendChild(li);

           });

       }

        this.bindMouseEvents();

     },

     bindMouseEvents: function(){
       document.querySelector('.add-new-jar').addEventListener('click', this.addNewClick.bind(this));
     },

     addNewClick: function(event){
       //salvestame purgi
       //console.log(event);

       var title = document.querySelector('.title').value;

       //1) tekitan uue Jar'i
       var new_jar = new Jar(title);

       //lisan massiiivi
       this.jars.push(new_jar);
       console.log(JSON.stringify(this.jars));
       // JSON'i stringina salvestan localStorage'isse
       localStorage.setItem('jars', JSON.stringify(this.jars));

       // 2) lisan selle htmli listi juurde
       var li = new_jar.createHtmlElement();
       document.querySelector('.list-of-jars').appendChild(li);
	   
	   //töötav eemaldamine http://jsfiddle.net/mplungjan/f4Ex8/
	   // li.onclick = function() {this.parentNode.removeChild(this);}
	   
	   


     }

   };
   
   var Jar = function(new_title){
     this.title = new_title;
     console.log('created new jar');
   };

   Jar.prototype = {
     createHtmlElement: function(){

       var li = document.createElement('li');
	   li.onclick = function() {this.parentNode.removeChild(this);}
       var content = document.createTextNode(this.title);
       li.appendChild(content);

	  /* var DeleteButton = document.createElement('button');
       DeleteButton.innerHTML = 'X';
       DeleteButton.className = 'delete';
	   DeleteButton.onclick = function(){
	   console.log('deleet');
	   console.log('this.title');
	   console.log(this.title);
	   console.log(content.title);
	   console.log(li.title);
	   console.log(li.content);
	   console.log('content');
	   console.log(content);
	   //this.parentNode.removeChild(this);
	   li.remove(this);
	   //ülemine töötab ka eemaldamisel, eemaldab nupuna
	   
	   this.jars = JSON.parse(localStorage.jars);
	   console.log(this.jars);
	   console.log(this.jars[2]);
	   console.log('JSON.parse(localStorage.keyname).length');
	   console.log(JSON.parse(localStorage.jars).length);
	  // var id = this.getAttribute('id');
	   console.log(this.getAttribute('id'));

	   }; 
	   */
	   /*
	   if(localStorage.jars){
         //parsin JSON obj
         this.jars = JSON.parse(localStorage.jars);
		//list.innerHTML = '';
		//jars.splice(0, jars.length);
		//renderTodos();
		console.log('laadisin LS massiivi: '+this.jars.length);
		console.log(this.jars);
		
		localStorage.removeItem(this.jars);
		window.location.reload();
		}
		
		
		var json = JSON.parse(localStorage["jars]);
		for (i=0, i<json.length;i++)
		console.log(json[i]);
		
		*/	   
		
		/*
	   var i = $this.text();
	   var li = localStorage.getItem('jars');
	   var NewList = li.replace('<li>' + i + '</li>', ''); 
	   localStorage.setItem('list', newList);
		*/
		
		/*
		var li = this.parentNode;
		var ul = li.parentNode;
		ul.removeChild(li);
		*/
		
	   
	   //li.appendChild(DeleteButton);
	  
	  /*
	   var EditButton = document.createElement('button');
       EditButton.innerHTML = 'Y';
       EditButton.className = 'edit';
	   EditButton.onclick = function(){
	   console.log('edit');
	   };
	   li.appendChild(EditButton);
	   
	   */
	   
	   //li.appendChild(button);
          
	   
	  // li.appendChild(removeTask);
       return li;

     }
   };

   window.onload = function(){
     var app = new CheckList();
   };

})();
