(function()){
  "use strict";

  var Warehouse = function(){

    if(Warehouse.instance){
      return Warehouse.instance;
    }
    Warehouse.instance = this;

    this.routes = Warehouse.routes;

    this.click_count = 0;
    this.currentRoute = null;

    this.Games = [];

    this.init();
  };

  window.Warehouse = Warehouse;

  Warehouse.routes = {
    'home-view': {
      'render': function(){
        console.log('homepage');
      }
    },
    'list-view': {
      'render': function(){
        console.log('list');

        window.setTimeout(function(){
          document.querySelector('.loading').innerHTML = 'Done!';}, 4000);
        }
      },
      'manage-view': {
        'render': function(){

        }
      }
    };


  }
