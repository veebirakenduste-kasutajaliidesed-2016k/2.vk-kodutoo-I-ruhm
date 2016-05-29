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

    this.memoArray = [];

    this.run();

    };

    window.App = App;
    App.routes = {
        'home-view':{
            'render': function(){
            }
        },
        'list-view':{
            'render': function(){
            }
        },
        'manage-view': {
            'render': function(){
            }
        }
    };

    App.prototype = {
        run: function(){

            window.addEventListener('hashchange', this.routeChange.bind(this));
            if(!window.location.hash){
                window.location.hash = 'home-view';
            }else{
                this.routeChange();
            }
                if(localStorage.memoArray){
                    this.createList(JSON.parse(localStorage.memoArray));
                    console.log('Laadisin localstoragest');
                }else{
                    console.log('tühi');
                }
            this.bindEvents();
        },

    createList: function(objectmemoArray){
        this.memoArray = objectmemoArray;
        this.memoArray.forEach(function(memoObject2){
            var newmemo = new memoObject(memoObject2.id, memoObject2.name, memoObject2.type, memoObject2.origin);
        var li = newmemo.createHtmlElement();
        document.querySelector('.memo-list').appendChild(li);
    });
    },
        bindEvents: function(){

            document.querySelector('.add-new-memo').addEventListener('click', this.addNewmemo.bind(this));

            document.querySelector('#search').addEventListener('keyup', this.search.bind(this));

        },

    deletememo: function(event){

        console.log(event.target.parentNode);
        console.log(event.target.dataset.id);

        // kas kasutaja tegelikult tahab kustutada
        var c = confirm('Kas soovid kustutada?');

        // juhul kui kasutaja kinnitas kustutamise, lähen edasi funktsiooniga
        if(!c){ return; }
        var clicked_li = event.target.parentNode;

        //kustutan memo-listist clicked_li ehk millisele objektile klõpsati (see kustutab ainult n.ö veebilehelt, kuid mitte storagest)
        document.querySelector('.memo-list').removeChild(clicked_li);

        //kontrollin, millisele objektile klõpsati ning kui klõpsatud objekti id = memoobjecti id, siis  splicen ehk kustutan memoArrays vastaval kohal oleva objekti
        this.memoArray.forEach(function(memoObject , i){
            if(memoObject.id == event.target.dataset.id){
                App.instance.memoArray.splice(i, 1);
            }
        });

        // salvestan uue memoarray localstorage'sse
        localStorage.setItem('memoArray', JSON.stringify(this.memoArray));
    },

    changememo: function(event){
        var  c = confirm('Kas soovid muuta?');

        // juhul kui kasutaja kinnitab muutmist, liigun edasi funktsiooniga
        if(!c){ return; }

        // promptid uute väärtuste saamiseks
        var name = window.prompt("Palun sisesta uus nimi");
        var type = window.prompt("Palun sisesta uus tüüp");
        var origin = window.prompt("palun sisesta uus päritolu");

        // uus memoobject
        var newmemo = new memoObject(guid(), name, type, origin);

        // vaatan üle kõik arrays olevad objektid ning kui objekti id on target id, siis asendan splicega
        this.memoArray.forEach(function(memoObject, i){
          if(memoObject.id == event.target.dataset.id){
            console.log(newmemo);

            App.instance.memoArray.splice(i, 1, newmemo);

          }
        });

        // salvestan localstorage
        localStorage.setItem('memoArray', JSON.stringify(this.memoArray));

        // laen akna uuesti
        location.reload();

    },


    search: function(event){
        var search = document.querySelector('#search').value.toLowerCase();
        console.log(search);
        var list = document.querySelectorAll('ul.memo-list li');
        console.log(list);

        for(var i = 0; i < list.length; i++){
            var li = list[i];
            var stack = li.querySelector('.content').innerHTML.toLowerCase();

            if(stack.indexOf(search) !== -1){
                li.style.display = 'list-item';
            }else{
                li.style.display = 'none';
            }
        }
    },

    addNewmemo: function(event){
        console.log(event);

        var name = document.querySelector('.name').value;
        var type = document.querySelector('.type').value;
        var origin = document.querySelector('.origin').value;

        var newmemo = new memoObject(guid(), name, type, origin);
        console.log(JSON.stringify(this.memoArray));
        this.memoArray.push(newmemo);
        localStorage.setItem('memoArray', JSON.stringify(this.memoArray));
        var li = newmemo.createHtmlElement();
        document.querySelector('.memo-list').appendChild(li);
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


    var memoObject = function(newId, newName, newType, newOrigin){
        this.id = newId;
        this.name = newName;
        this.type = newType;
        this.origin = newOrigin;
    };

    memoObject.prototype = {
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

       //kustutamise nupp
       var delete_span = document.createElement('span');
    	   delete_span.appendChild(document.createTextNode(' kustuta'));

    	   delete_span.style.color = 'red';
    	   delete_span.style.cursor = 'pointer';

    	   delete_span.setAttribute('data-id', this.id);

    	   delete_span.addEventListener('click', App.instance.deletememo.bind(App.instance));

	   li.appendChild(delete_span);

     // muutmise nupuke
       var change_span = document.createElement('span');
    	   change_span.appendChild(document.createTextNode(' muuda'));

         change_span.style.color = 'blue';
         change_span.style.cursor = 'pointer';

         change_span.setAttribute('data-id', this.id);

    	   change_span.addEventListener('click', App.instance.changememo.bind(App.instance));

	   li.appendChild(change_span);


       return li;
        }
    };

       // ID loomine
  	function guid() {
  	  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
  		s4() + '-' + s4() + s4() + s4();
  	}

  	function s4() {
  	  return Math.floor((1 + Math.random()) * 0x10000)
  		.toString(16)
  		.substring(1);
  	}
    //ID loomise lõpp

    window.onload = function(){
        var t = new App();
        };

})();
