// to-do list
//********************************
// add remove, modify options (Just got to make them work now)
// l̶e̶t̶ ̶t̶h̶e̶ ̶u̶s̶e̶r̶ ̶a̶d̶d̶ ̶p̶r̶i̶c̶e̶
// currency changing
// d̶i̶s̶p̶l̶a̶y̶ ̶p̶l̶a̶t̶f̶o̶r̶m̶ ̶n̶a̶m̶e̶s̶ ̶v̶i̶a̶ ̶C̶S̶S̶ ̶p̶r̶o̶p̶e̶r̶l̶y̶ ̶[̶P̶S̶4̶]̶,̶ ̶[̶P̶C̶]̶ ̶e̶t̶c̶
// m̶o̶d̶i̶f̶y̶ ̶C̶S̶S̶ ̶a̶ ̶b̶i̶t̶
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

   $("#success-alert").hide();

   window.Warehouse = Warehouse;

   Warehouse.routes = {
     'home-view': {
       'render': function(){
       }
     },
     'list-view': {
       'render': function(){
       }
     },
     'manage-view': {
       'render': function(){
       }
     },
     // Tahtsin testida täiesti uue tab tegemist
     'credits-view': {
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

               var new_game = new Game(game.id, game.title, game.platform, game.price);

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

     modifyGame: function(event) {

       $("#ModalModify").modal({backdrop: true});

       $(document).on("click", "#mod_close", function(event){
        return;
      });

       $(document).on("click", "#save", function(event){

       var clicked_li = event.target.parentNode;
       document.querySelector('.list-of-games').removeChild(clicked_li);

       this.games.forEach(function(game,i){

         Warehouse.instance.games.splice(i, 1);
       })

       var title = document.querySelector('.title').value;
       var platform = document.querySelector('.platform').value;
       var price = document.querySelector('.price').value;

       this.games.push(new_game);
       var li = new_game.createHtmlElement();
       document.querySelector('.list-of-games').appendChild(li);

      });
     },

     deleteGame: function(event) {

       $("#deleteConfirm").modal({backdrop: true});

       $(document).on("click", "#close", function(event){
        return;
      });

       $(document).on("click", "#confirm", function(event){


       var clicked_li = event.target.parentNode;
       document.querySelector('.list-of-games').removeChild(clicked_li);

       this.games.forEach(function(game,i){

         if(game.id == event.target.dataset.id){

           Warehouse.instance.games.splice(i, 1);
         }
       });
     });
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
       var price = document.querySelector('.price').value;

       if (title === "" || platform === "" || price === ""){
         $("#ModalError").modal({backdrop: true});
       }else{
       var new_game = new Game(guid, title, platform, price);

       this.games.push(new_game);
       console.log(JSON.stringify(this.games));
       localStorage.setItem('games', JSON.stringify(this.games));

       var li = new_game.createHtmlElement();
       document.querySelector('.list-of-games').appendChild(li);
       }
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

   var Game = function(new_guid, new_title, new_platform, new_price){
     this.id = new_guid;
     this.title = new_title;
     this.platform = new_platform;
     this.price = new_price;
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

       var modify_span = document.createElement('button');
       modify_span.appendChild(document.createTextNode('Modify'));
       modify_span.className = 'modify';

       modify_span.setAttribute('data-id', this.id);
       modify_span.addEventListener('click', Warehouse.instance.modifyGame.bind(Warehouse.instance));


       var delete_span = document.createElement('button');
       delete_span.appendChild(document.createTextNode('x'));
       delete_span.className = 'delete';

       delete_span.setAttribute('data-id', this.id);
       delete_span.addEventListener('click', Warehouse.instance.deleteGame.bind(Warehouse.instance));


       var content = document.createTextNode(this.title + ' | ' + this.platform + ' | ' + this.price + '€' + ' |  ');
       span_with_content.appendChild(content);

       li.appendChild(span_with_content);
       li.appendChild(delete_span);
       li.appendChild(modify_span);

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

   window.onload = function(){
     var app = new Warehouse();
   };

})();
