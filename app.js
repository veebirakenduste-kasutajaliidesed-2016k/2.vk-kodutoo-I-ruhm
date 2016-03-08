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
	 this.jar_id = 0;	
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

               var new_jar = new Jar(jar.id, jar.title);
			   
			   CheckList.instance.jar_id = jar.id;

               var li = new_jar.createHtmlElement();
               document.querySelector('.list-of-jars').appendChild(li);

           });
		   this.jar_id++;

       }

        this.bindMouseEvents();

     },

     bindMouseEvents: function(){
       document.querySelector('.add-new-jar').addEventListener('click', this.addNewClick.bind(this));
     },
	 
	 deleteJar: function(event){
		
		console.log(event.target.parentNode);
		console.log(event.target.dataset.id);
		
		var c = confirm('kustuta?');
		if(!c){ return; }
		
		var clicked_li = event.target.parentNode;
		document.querySelector('.list-of-jars').removeChild(clicked_li);
		
		this.jars.forEach(function(jar, i){

			if(jar.id == event.target.dataset.id){
				CheckList.instance.jars.splice(i, 1);
			}
              
        });
		
       localStorage.setItem('jars', JSON.stringify(this.jars));
		
	 },

     addNewClick: function(event){
       //salvestame purgi
       //console.log(event);

       var title = document.querySelector('.title').value;

       //1) tekitan uue Jar'i
       var new_jar = new Jar(this.jar_id, title);
	   this.jar_id++;

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
   
   var Jar = function(new_id, new_title){
	 this.id = new_id;
     this.title = new_title;
     console.log('created new jar');
   };

   Jar.prototype = {
     createHtmlElement: function(){

       var li = document.createElement('li');
       var content = document.createTextNode(this.title);
       li.appendChild(content);
	  
	   var delete_span = document.createElement('span');
	   delete_span.appendChild(document.createTextNode(' x'));		
	   delete_span.style.color = 'red';
	   delete_span.style.cursor = 'pointer';
	   delete_span.setAttribute('data-id', this.id);	   
	   delete_span.addEventListener('click', CheckList.instance.deleteJar.bind(CheckList.instance));	   
	   li.appendChild(delete_span);
	   
       return li;

     }
   };

   window.onload = function(){
     var app = new CheckList();
   };

})();
