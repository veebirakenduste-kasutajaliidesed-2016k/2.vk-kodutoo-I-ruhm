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
				document.querySelector('.list_of_kysd').appendChild(li);
        });
		
		//this.kys_id++;
		 
       }

       // esimene loogika oleks see, et kuulame hiireklikki nupul
       this.bindEvents();

     },

     bindEvents: function(){
		
		document.getElementById('init_btn_y').addEventListener('click', function(){
		   
		    if(localStorage.getItem("kysd") === null){
				AI.instance.paneChange(2, 0);
		    }else{
				AI.instance.paneChange(1, 0);

			}
		})
		
		document.getElementById('init_btn_n').addEventListener('click', function(){
		   AI.instance.paneChange(0, 0);
		})
		
		document.getElementById('question_btn_y').addEventListener('click', function(){
			
			if(AI.instance.kysd[AI.instance.count].answer === "Jah"){
				AI.instance.count++;
				AI.instance.paneChange(1, AI.instance.count);
		    }else{
				AI.instance.paneChange(2, 0);
			}
		})
		
		document.getElementById('question_btn_n').addEventListener('click', function(){
		    if(AI.instance.kysd[AI.instance.count].answer === "Ei"){
				AI.instance.count++;
				AI.instance.paneChange(1, AI.instance.count);
		    }else{
				AI.instance.paneChange(2, 0);
			}
		})
		
		document.getElementById('new_question_btn').addEventListener('click', function(){
		   AI.instance.addNewClick();
		   AI.instance.restart();
		})
		
		document.querySelector('.restart').addEventListener('click', function(){
		   AI.instance.restart();
		})
		
		document.querySelector('.settings').addEventListener('click', function(){
		   AI.instance.paneChange(4,0);
		})

     },
	 
	 paneChange: function(nr, count){
		 
		var init_seg = document.querySelectorAll(".init");
		var kys_seg = document.querySelectorAll(".question");
		var new_kys_seg = document.querySelectorAll(".newq");
		var list_seg = document.querySelectorAll(".list_of_kysd");
		
		/*
		###################################################
		####HEA KRDI MEELEGA KASUTAKS SEDA AGA EI TÖÖTA####
		###################################################
		
		
			for (var i = 0; i < 7; i++) {
				try{
				list_seg[i].style.display = "none";
				init_seg[i].style.display = "none";
				list_seg[i].style.display = "none";	
				new_kys_seg[i].style.display = "block";
				}catch(err){}
			}
		
		*/
		 
		 if(nr == 0){
			 //console.log("ei");
			
		 }else if(nr === 1){
			 //console.log("jah");
			//kui on local storage
			/*
			###########################
			####KÜSIMUSTE KULGEMINE####
			###########################
			*/
			
			for (var i = 0; i < init_seg.length; i++) {
				init_seg[i].style.display = "none";
			}
			
			for (var i = 0; i < kys_seg.length; i++) {
				new_kys_seg[i].style.display = "none";	
			}
			
			for (var i = 0; i < list_seg.length; i++) {
				list_seg[i].style.display = "none";	
			}
			
			for (var i = 0; i < kys_seg.length; i++) {
				kys_seg[i].style.display = "block";	
			}
			
			document.getElementById('question_list').style.display = "none";
			
			this.logik(AI.instance.count);
			
		 }else if(nr === 2){
			/*
			################################
			####UUE KÜSIMUSE SISESTAMINE####
			################################
			
			*/
			
			for (var i = 0; i < init_seg.length; i++) {
				init_seg[i].style.display = "none";
			}
			
			for (var i = 0; i < kys_seg.length; i++) {
				kys_seg[i].style.display = "none";	
			}
			
			for (var i = 0; i < list_seg.length; i++) {
				list_seg[i].style.display = "none";	
			}
			
			for (var i = 0; i < new_kys_seg.length; i++) {
				new_kys_seg[i].style.display = "block";
			}
			
			document.getElementById('question_list').style.display = "none";
			
		 }else if(nr === 3){
			
			for (var i = 0; i < init_seg.length; i++) {
				init_seg[i].style.display = "none";
			}
			
			for (var i = 0; i < kys_seg.length; i++) {
				kys_seg[i].style.display = "none";	
			}
			
			for (var i = 0; i < new_kys_seg.length; i++) {
				new_kys_seg[i].style.display = "none";	
			}
			
			for (var i = 0; i < list_seg.length; i++) {
				list_seg[i].style.display = "none";	
			}
			
			document.getElementById('question_list').style.display = "none";
			
		 }else if(nr === 4){
			
			for (var i = 0; i < init_seg.length; i++) {
				init_seg[i].style.display = "none";
			}
			
			for (var i = 0; i < kys_seg.length; i++) {
				kys_seg[i].style.display = "none";	
			}
			
			for (var i = 0; i < new_kys_seg.length; i++) {
				new_kys_seg[i].style.display = "none";	
			}
			
			for (var i = 0; i < list_seg.length; i++) {
				list_seg[i].style.display = "block";	
			}

			document.getElementById('question_list').style.display = "block";
		 }
	 },
	 //otsustab mis küsimust näidata
	 logik: function(count){
		
		if(AI.instance.kysd[count] !== undefined){

			this.kysd = JSON.parse(localStorage.kysd);

			var q = AI.instance.kysd[count].kysimus;
			document.getElementById('question_span').innerHTML = q;

		}else{
			console.log("vsjo");
			this.paneChange(2, 0);
		}
	 },
	 
	 deleteKys: function(){
	
		 var c = confirm('Kustuta?');
		 if(!c){return;}
		 
		 var clicked_li = event.target.parentNode.parentNode;
		 console.log(clicked_li)
		 document.querySelector('.list_of_kysd').removeChild(clicked_li);
		 
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
		 
		 var c = prompt('Muuda?');
		 if(!c){return;}
		 
		 var clicked_li = event.target.parentNode.parentNode;
		 console.log(clicked_li)
		 document.querySelector('.list_of_kysd').removeChild(clicked_li);
		 
		 this.kysd.forEach(function(kys, i){
			 
			 if(kys.id == event.target.dataset.id){
				 //mis index ja mitu. + lisaks saab asendada vajadusel
				 AI.instance.kysd.splice(i, 1);
			 }
			 
		 });
		 
		 localStorage.setItem('kysd', JSON.stringify(this.kysd));
		 
	 },

     addNewClick: function(event){

       var kysimus = document.getElementById('new_question').value;
	   
	   if(document.getElementById('new_question_btn_y').checked){
			var answer = 1;
	   }else if(document.getElementById('new_question_btn_n').checked){
			var answer = 0;
	   }
	   
       if(!kysimus){
         alert('Lisage palun küsimus.');
       }else{
         var new_kys = new Kys(kysimus, answer, this.kys_id);
		 this.kys_id++;
		 
         document.querySelector('.list_of_kysd').appendChild(new_kys.createHtmlElement(this.kys_id));

         this.kysd.push(new_kys);
         console.log(JSON.stringify(this.kysd));
         localStorage.setItem('kysd',JSON.stringify(this.kysd));
       }

     },
	 
	 restart: function(){
		 location.reload();
	 }

   };

   var Kys = function(kysimus, answer, id){
     this.kysimus = kysimus;
     this.answer = answer;
	 this.id = id;
   };

   Kys.prototype = {
     createHtmlElement: function(nr){
	   
       var li = document.createElement('li');

       var span1 = document.createElement('span');
       span1.className = 'content';
	   
	   var change = document.createElement('span');
       change.appendChild(document.createTextNode('Muuda  /  '));
	   change.style.color = 'green';
	   change.style.cursor = 'pointer';
       change.setAttribute('data-id', this.id);
	   
	   change.addEventListener("click", AI.instance.changeKys.bind(AI.instance));

       var del = document.createElement('span');
       del.appendChild(document.createTextNode('Kustuta'));
	   del.style.color = 'red';
	   del.style.cursor = 'pointer';
       del.setAttribute('data-id', this.id);
	   
	   del.addEventListener("click", AI.instance.deleteKys.bind(AI.instance));
	   
	   if(this.answer === 0){
		   this.answer = "Ei";
	   }else{
		   this.answer = "Jah";
	   }

       var content = document.createTextNode(AI.instance.kysd[nr].kysimus + '  /  ' + this.answer + '  /  ');
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
