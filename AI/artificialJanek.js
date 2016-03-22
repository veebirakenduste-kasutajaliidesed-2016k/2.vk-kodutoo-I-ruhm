(function(){
   "use strict";

   var AI = function(){

     if(AI.instance){
       return AI.instance;
     }
     AI.instance = this;

     console.log('AI sees');

     console.log(this);
	 this.kys_id = 0;
     this.kysd = [];
	 this.count = 0;

     this.init();
   };

   window.AI = AI;
   
   AI.prototype = {

     init: function(){
       console.log('Rakendus läks tööle');
	   
	    var init_seg = document.querySelectorAll(".init");
		for (var i = 0; i < init_seg.length; i++) {
			init_seg[i].style.display = "block";
	    }

        if(localStorage.kysd){

			this.kysd = JSON.parse(localStorage.kysd);
			console.log('laadisin localStoragest massiivi ' + this.kysd.length);

			 //tekitan loendi htmli
			this.kysd.forEach(function(ykskys){
				var new_kys = new Kys(ykskys.title, ykskys.answer, ykskys.id);
				
				AI.instance.kys_id = ykskys.id;

				var li = new_kys.createHtmlElement();
				document.querySelector('.list-of-kysd').appendChild(li);
        });
		
		this.kys_id++;
		 
       }

       // esimene loogika oleks see, et kuulame hiireklikki nupul
       this.bindEvents();

     },

     bindEvents: function(){
		
		document.getElementById('init_btn_y').addEventListener('click', function(){
		   AI.instance.paneChange(1, 0);
		})
		
		document.getElementById('init_btn_n').addEventListener('click', function(){
		   AI.instance.paneChange(0, 0);
		})

     },
	 
	 paneChange: function(nr, count){
		 
		 if(nr == 0){
			 //console.log("ei");
			
		 }else if(nr == 1){
			 //console.log("jah");
			var init_seg = document.querySelectorAll(".init");
			for (var i = 0; i < init_seg.length; i++) {
				init_seg[i].style.display = "none";
			}
			
			var init_seg = document.querySelectorAll(".question");
			for (var i = 0; i < init_seg.length; i++) {
				init_seg[i].style.display = "block";
			}
			
			this.logik();
			
		 }else if(nr == 2){
			 
		 }else if(nr == 3){
			 
		 }
		 
	 },
	 
	 logik: function(){
		
		if(localStorage.kysd){

				this.kysd = JSON.parse(localStorage.kysd);
				console.log('laadisin localStoragest massiivi ' + this.kysd.length);
				
				if(){
					document.getElementById('question_span').appendChild();
				}
				 //tekitan loendi htmli
				this.kysd.forEach(function(ykskys){
					var new_kys = new Kys(ykskys.title, ykskys.answer, ykskys.id);

					var li = new_kys.createHtmlElement();
					document.querySelector('.list-of-kysd').appendChild(li);
				});
			}
	 },
	 
	 deleteKys: function(){
		 
		 //li element
		 console.log(event.target.parentNode);
		 //id
		 console.log(event.target.dataset.id);
		 
		 var c = confirm('Kustuta?');
		 if(!c){return;}
		 
		 var clicked_li = event.target.parentNode.parentNode;
		 console.log(clicked_li)
		 document.querySelector('.list-of-kysd').removeChild(clicked_li);
		 
		 this.kysd.forEach(function(kys, i){
			 
			 if(kys.id == event.target.dataset.id){
				 //mis index ja mitu. + lisaks saab asendada vajadusel
				 AI.instance.kysd.splice(i, 1);
			 }
			 
		 });
		 
		 localStorage.setItem('kysd', JSON.stringify(this.kysd));
		 
	 },
	 
	 changeKys: function(){
		 
		 //li element
		 console.log(event.target.parentNode);
		 //id
		 console.log(event.target.dataset.id);
		 
		 var c = confirm('Muuda?');
		 if(!c){return;}
		 
		 var clicked_li = event.target.parentNode;
		 console.log(clicked_li)
		 document.querySelector('.list-of-kysd').removeChild(clicked_li);
		 
		 this.kysd.forEach(function(kys, i){
			 
			 if(kys.id == event.target.dataset.id){
				 //mis index ja mitu. + lisaks saab asendada vajadusel
				 AI.instance.kysd.splice(i, 1);
			 }
			 
		 });
		 
		 localStorage.setItem('kysd', JSON.stringify(this.kysd));
		 
	 },

     addNewClick: function(event){

       var kysimus = document.querySelector('.kysimus').value;
	   
       if(!kysimus){
         alert('Lisage palun küsimus.');
       }else{
         var new_kys = new Kys(kysimus, answer, this.kys_id);
		 this.kys_id++;
		 
         document.querySelector('.list-of-kysd').appendChild(new_kys.createHtmlElement());

         this.kysd.push(new_kys);
         console.log(JSON.stringify(this.kysd));
         localStorage.setItem('kysd',JSON.stringify(this.kysd));
       }

     }

   };

   var Kys = function(kysimus, answer, id){
     this.kysimus = kysimus;
     this.answer = answer;
	 this.id = id;
     console.log('created new Kys');
   };

   Kys.prototype = {
     createHtmlElement: function(){

       var li = document.createElement('li');

       var span1 = document.createElement('span');
       span1.className = 'content';
	   
	   var change = document.createElement('span');
       change.appendChild(document.createTextNode('Muuda '));
	   change.style.color = 'yellow';
	   change.style.cursor = 'pointer';
       change.setAttribute('data-id', this.id);
	   
	   change.addEventListener("click", AI.instance.changeKys.bind(AI.instance));

       var del = document.createElement('span');
       del.appendChild(document.createTextNode('Kustuta'));
	   del.style.color = 'red';
	   del.style.cursor = 'pointer';
       del.setAttribute('data-id', this.id);
	   
	   del.addEventListener("click", AI.instance.deleteKys.bind(AI.instance));
	   

       var content = document.createTextNode(this.kysimus + '   ' + this.answer + '   ');
       span1.appendChild(content);
	   span1.appendChild(change);
       span1.appendChild(del);

       li.appendChild(span1);

       return li;

     },
   };
   // kui leht laetud käivitan Moosipurgi rakenduse
   window.onload = function(){
     var app = new AI();
   };

})();
