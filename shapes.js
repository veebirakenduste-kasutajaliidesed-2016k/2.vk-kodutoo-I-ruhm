(function(){
	"use strict";
	var List = function(){
		if(List.instance){
			return List.instance;
		}
		List.instance = this;
		this.routes = List.routes;
		console.log('List opened');

		this.click_count = 0;
		this.currenRoute = null;
		console.log(this);

		this.item_id = 0;
		this.items = [];
		this.init();

	};
	window.List = List;
	List.routes = {
		'list-view': {
			'render': function(){
				console.log("List view");
				window.setTimeout(function(){
					document.querySelector('.Loading...').innerHTML = 'Done!';
				}, 3000);
			}
		},
		'manage-view': {
			'render': function(){

			}
		}
	};
	List.prototype = {
		init: function(){
			console.log("Init started");

			window.addEventListener('hashchange', this.routeChange.bind(this));

			if(!window.location.hash){
				window.location.hash = 'list-view';
			}else{
				this.routeChange();
			}
			if(localStorage.items){
				this.items = JSON.parse(localStorage.items);
				this.items.forEach(function(item){
					var new_item = new Item(item.id, item.shape, item.color, item.size);

					List.instance.item_id = item.id;
					var li = new_item.createHtmlElement();
					document.querySelector('.list-of-items').appendChild(li);
				});
				this.item_id++;
			}
			this.bindEvents();
		},
		bindEvents: function(){
			document.querySelector('.new_shape').addEventListener('click', this.addNewClick.bind(this));
		},
		deleteItem: function(event){
			console.log(event.target.parentNode);
			console.log(event.target.dataset.id);

			var clicked_li = event.target.parentNode;
			document.querySelector('.list-of-items').removeChild(clicked_li);
			this.items.forEach(function(item, i){
				if(item.id == event.target.dataset.id){
					List.instance.items.splice(i, 1);
				}
			});
			localStorage.setItem('items', JSON.stringify(this.items));
		},
		addNewClick: function(event){
			var shape = document.querySelector('.shape').value;
			var color = document.querySelector('.color').value;
			var size = document.querySelector('.size').value;
			var new_item = new Item(this.item_id, shape, color, size);
			this.item_id++;
			this.items.push(new_item);
			console.log(JSON.stringify(this.items));
			localStorage.setItem("items", JSON.stringify(this.items));
			var li = new_item.createHtmlElement();
			document.querySelector('.list-of-items').appendChild(li);
		},
		routeChange: function(event){
			this.currentRoute = location.hash.slice(1);
			console.log(this.currentRoute);
			if(this.routes[this.currentroute]){
				this.updateMenu();
				this.routes[this.currentRoute].render();
			}
			else{
				console.log("404");
			}
		},
		updateMenu: function(){
			document.querySelector('.active-menu').className = document.querySelector('.active-menu').className.replace('active-menu', '');
			document.querySelector('.'+this.currentRoute).className += ' active-menu';

		}
	};
	//End of list
	var Item = function(new_id, new_shape, new_color, new_size){
		this.id = new_id;
		this.shape = new_shape;
		this.color = new_color;
		this.size = new_size;
		console.log('New shape created');

	};

	Item.prototype = {
		createHtmlElement: function(){
			function randomInt(min,max){
    			return Math.floor(Math.random()*(max-min+1)+min);
			}
			
			var li = document.createElement('li');
			/*var span = document.createElement('span');
			li.appendChild(span);
			var span_with_content = document.createElement('span');
			span_with_content.className = 'content';
			var content = document.createTextNode(this.activity + ' | ' + this.time);
			span_with_content.appendChild(content);
			li.appendChild(span_with_content);
			*/
			var shape = document.createElement("img");
			shape.src=(this.shape).toString()+".png";
			shape.style.opacity=".5";
			shape.style.background=this.color;
			var imageSize = 100/this.size
			shape.style.width=imageSize.toString() + "%";
			shape.style.height=imageSize.toString() + "%";
			shape.style.position="relative";
			shape.style.position="LEFT: "+/*randomInt(100, 1000).toString()*/ 500+"px";
			shape.style.position="TOP: "+randomInt(100, 1000).toString()+"px";
			/*TOP:"+randomInt()+"px; LEFT:"+randomInt()+"px";*/
			//li.appendChild(shape);
			//delete
			/*var delete_span = document.createElement('span');
			delete_span.appendChild(document.createTextNode(' Delete'));

			delete_span.style.color = 'red';
			delete_span.style.cursor = 'pointer';

			//panen külge id
			delete_span.setAttribute('data-id', this.id);

			delete_span.addEventListener('click', List.instance.deleteItem.bind(List.instance));

			li.appendChild(delete_span);*/

			return shape;

		}
	};

	window.onload = function(){
		var app = new List();
	};
})();
