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
   
   
   
	//lehe laadimisel moosipurk
	window.onload = function(){
		var app = new Moosipurk();
	};
   
})();