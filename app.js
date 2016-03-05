// to-do list
//********************************
// add remove, modify options
// let the user add price
// currency changing
// d̶i̶s̶p̶l̶a̶y̶ ̶p̶l̶a̶t̶f̶o̶r̶m̶ ̶n̶a̶m̶e̶s̶ ̶v̶i̶a̶ ̶C̶S̶S̶ ̶p̶r̶o̶p̶e̶r̶l̶y̶ ̶[̶P̶S̶4̶]̶,̶ ̶[̶P̶C̶]̶ ̶e̶t̶c̶
// modify CSS a bit
//*******************************

(function(){
   "use strict";

   var Warehouse = function(){

     if(Warehouse.instance){
       return Warehouse.instance;
     }

     Warehouse.instance = this;

     this.routes = Warehouse.routes;

     this.click_count = 0;
     this.currentRoute = null;

     this.games = [];

     this.init();
   };

   window.Warehouse = Warehouse;

   Warehouse.routes = {
     'home-view': {
       'render': function(){
       }
     },
     'list-view': {
       'render': function(){

         window.setTimeout(function(){
           document.querySelector('.loading').innerHTML = 'Done!';
         }, 3000);

       }
     },
     'manage-view': {
       'render': function(){
       }
     }
   };

   Warehouse.prototype = {

     init: function(){

       window.addEventListener('hashchange', this.routeChange.bind(this));

       if(!window.location.hash){
         window.location.hash = 'home-view';
       }else{
         this.routeChange();
       }

       if(localStorage.games){
           this.games = JSON.parse(localStorage.games);

           this.games.forEach(function(game){

               var new_game = new Game(game.title, game.platform);

               var li = new_game.createHtmlElement();
               document.querySelector('.list-of-games').appendChild(li);

           });

       }

       this.bindEvents();

     },

     bindEvents: function(){
       document.querySelector('.add-new-game').addEventListener('click', this.addNewClick.bind(this));

       document.querySelector('#search').addEventListener('keyup', this.search.bind(this));

     },

     search: function(event){
         var needle = document.querySelector('#search').value.toLowerCase();
         console.log(needle);

         var list = document.querySelectorAll('ul.list-of-games li');
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
       var platform = document.querySelector('.platform').value;

       var new_game = new Game(title, platform);

       this.games.push(new_game);
       console.log(JSON.stringify(this.games));
       localStorage.setItem('games', JSON.stringify(this.games));

       var li = new_game.createHtmlElement();
       document.querySelector('.list-of-games').appendChild(li);
     },

     routeChange: function(event){

       this.currentRoute = location.hash.slice(1);
       console.log(this.currentRoute);

       if(this.routes[this.currentRoute]){

         this.updateMenu();

         this.routes[this.currentRoute].render();
       }else{
         console.log("Something went wrong");
       }
     },

     updateMenu: function() {

       document.querySelector('.active-menu').className = document.querySelector('.active-menu').className.replace('active-menu', '');

       document.querySelector('.'+this.currentRoute).className += ' active-menu';

     }

   };

   var Game = function(new_title, new_platform){
     this.title = new_title;
     this.platform = new_platform;
   };

   Game.prototype = {
     createHtmlElement: function(){

       var li = document.createElement('li');

       var span = document.createElement('span');
       span.className = 'letter';

       var letter = document.createTextNode(this.platform.charAt(0)+this.platform.charAt(1)+this.platform.charAt(2));
       span.appendChild(letter);

       li.appendChild(span);

       var span_with_content = document.createElement('span');
       span_with_content.className = 'content';

       var content = document.createTextNode(this.title + ' | ' + this.platform);
       span_with_content.appendChild(content);

       li.appendChild(span_with_content);

       return li;

     }
   };

   window.onload = function(){
     var app = new Warehouse();
   };

})();
