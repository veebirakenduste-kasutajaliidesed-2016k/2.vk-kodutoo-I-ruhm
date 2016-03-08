(function(){
    "use strict";
    
    var App = function(){
        
        if(App.instance){
        return App.instance;
    }
    
    App.instance = this;
    
    this.routes = App.routes;
    console.log(this);
    
    this.currentRoute = null;
    
    this.cheeseArray = [];
    
    this.run();
        
    };
    
    window.App = App;
    App.routes = {
        'aabits':{
            'render': function(){
            }
        },
        'juustud':{
            'render': function(){
            }
        },
        'lisa': {
            'render': function(){
            }
        }
    };
    
    App.prototype = {
        run: function(){
          
            window.addEventListener('hashchange', this.routeChange.bind(this));
            if(!window.location.hash){
                window.location.hash = 'aabits';
            }else{
                this.routeChange();
            }
                if(localStorage.cheeseArray){
                    this.createList(JSON.parse(localStorage.cheeseArray));
                    console.log('Laadisin localstoragest');
                }else{
                    console.log('midagi');
                }
            this.bindEvents();
        },
    
    createList: function(objectCheeseArray){
        this.cheeseArray = objectCheeseArray;
        this.cheeseArray.forEach(function(cheeseObject2){
            var newCheese = new cheeseObject(cheeseObject2.id, cheeseObject2.name, cheeseObject2.type, cheeseObject2.origin);
        var li = newCheese.createHtmlElement();
        document.querySelector('.cheese-list').appendChild(li);
    });
    },
        bindEvents: function(){
            
            document.querySelector('.add-new-cheese').addEventListener('click', this.addNewCheese.bind(this));
            
            document.querySelector('#search').addEventListener('keyup', this.search.bind(this));
            
        },
            
    deleteCheese: function(event){
            
        console.log(event.target.parentNode);
        console.log(event.target.dataset.id);
        var c = confirm('Kas soovid kustutada?');

        if(!c){ return; }
        var clicked_li = event.target.parentNode;
        document.querySelector('.cheese-list').removeChild(clicked_li);
        this.cheeseArray.forEach(function(cheeseObject , i){
            if(cheeseObject.id == event.target.dataset.id){
                App.instance.cheeseArray.splice(i, 1);
            }
        });
        
        localStorage.setItem('cheeseArray', JSON.stringify(this.cheeseArray));
    },
    
    changeCheese: function(event){
        var  c = confirm('Kas soovid muuta?');

        if(!c){ return; }
        var li = document.createElement('li');

       var span = document.createElement('span');
       span.className = 'letter';

        var mi = document.createElement("input");
        mi.setAttribute('type', 'text');
        span.appendChild(mi);

       li.appendChild(span);


       return li;
        
    },
        
    
    search: function(event){
        var needle = document.querySelector('#search').value.toLowerCase();
        console.log(needle);
        var list = document.querySelectorAll('ul.cheese-list li');
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
    
    addNewCheese: function(event){
        console.log(event);
        
        var name = document.querySelector('.name').value;
        var type = document.querySelector('.type').value;
        var origin = document.querySelector('.origin').value;
        
        var newCheese = new cheeseObject(guid(), name, type, origin);
        console.log(JSON.stringify(this.cheeseArray));
        this.cheeseArray.push(newCheese);
        localStorage.setItem('cheeseArray', JSON.stringify(this.cheeseArray));
        var li = newCheese.createHtmlElement();
        document.querySelector('.cheese-list').appendChild(li);
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
                                                                                

    var cheeseObject = function(newId, newName, newType, newOrigin){
        this.id = newId;
        this.name = newName;
        this.type = newType;
        this.origin = newOrigin;
    };

    cheeseObject.prototype = {
        createHtmlElement: function(){
       var li = document.createElement('li');

       var span = document.createElement('span');
       span.className = 'letter';

       var letter = document.createTextNode(this.name.charAt(0));
       span.appendChild(letter);

       li.appendChild(span);

       var span_with_content = document.createElement('span');
       span_with_content.className = 'content';

       var content = document.createTextNode(this.name + ' | ' + this.type+ ' | ' + this.origin);
       span_with_content.appendChild(content);

       li.appendChild(span_with_content);
            
       var delete_span = document.createElement('span');
	   delete_span.appendChild(document.createTextNode(' kustuta'));
		
	   delete_span.style.color = 'red';
	   delete_span.style.cursor = 'pointer';
	   
	   delete_span.setAttribute('data-id', this.id);
	   
	   delete_span.addEventListener('click', App.instance.deleteCheese.bind(App.instance));
	   
	   li.appendChild(delete_span);
            
       var change_span = document.createElement('span');
	   change_span.appendChild(document.createTextNode(' muuda'));
            
       change_span.style.color = 'blue';
       change_span.style.cursor = 'pointer';
	   change_span.addEventListener('click', App.instance.changeCheese.bind(App.instance));
	   
	   li.appendChild(change_span);


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
        var t = new App()
        };

})();