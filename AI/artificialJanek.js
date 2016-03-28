(function(){
   "use strict";

   var AI = function(){

     if(AI.instance){
       return AI.instance;
     }
     AI.instance = this;

     //console.log('AI sees');

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
				var new_kys = new Kys(ykskys.kysimus, ykskys.answer, ykskys.id);
				
				AI.instance.kys_id = ykskys.id;
				console.log(ykskys.answer);

				var li = new_kys.createHtmlElement();
				document.querySelector('.list_of_kysd').appendChild(li);
        });
		
		this.kys_id++;
		 
       }

       // esimene loogika oleks see, et kuulame hiireklikki nupul
		this.animate(0);
		/*setTimeout(function(){
			AI.instance.animate(0);
		}, 5000);*/
		
		//document.getElementById('textio').innerHTML = "Tere tulemast!";
		
	   
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
				AI.instance.paneChange(5, 0);
			}
		})
		
		document.getElementById('question_btn_n').addEventListener('click', function(){
		    if(AI.instance.kysd[AI.instance.count].answer === "Ei"){
				AI.instance.count++;
				AI.instance.paneChange(1, AI.instance.count);
		    }else{
				AI.instance.paneChange(5, 0);
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
		   AI.instance.animate(3);
		})
		
		document.getElementById('mein').addEventListener('mousemove', function(event){
			
			var y=(0-(event.clientY-90));
			
			document.getElementById('ai5_1').style.transform = 'rotate('+y+'deg)';
		})

     },
	 
	 animate: function(par){
		 
		document.getElementById('ai1').style.display = "none";
		document.getElementById('ai2').style.display = "none";
		document.getElementById('ai3').style.display = "none";
		document.getElementById('ai4').style.display = "none";
		document.getElementById('ai5').style.display = "none";
		document.getElementById('ai5_1').style.display = "none";
		document.getElementById('ai6').style.display = "none";
		document.getElementById('textio').innerHTML ="";
		 
		 if(par === 0){
			 
			 document.getElementById('ai1').style.display = "block";
			 
			 setTimeout(function(){
				 
				 document.getElementById('ai1').style.display = "none";
				 
			     document.getElementById('ai2').style.display = "block";
				 
				 setTimeout(function(){
					 
					 document.getElementById('ai2').style.display = "none";
					 
					 document.getElementById('ai3').style.display = "block";
					 
					 setTimeout(function(){
					 
						 document.getElementById('ai3').style.display = "none";
					 
						 document.getElementById('ai4').style.display = "block";
						 
						 document.getElementById('textio').innerHTML ="Tere tulemast";
							 
						 setTimeout(function(){
							 
							 document.getElementById('textio').innerHTML ="";
							 document.getElementById('ai4').style.display = "none";
							 
							 document.getElementById('textio').innerHTML ="Tehke oma valik.";
							 document.getElementById('ai5').style.display = "block";
							 document.getElementById('ai5_1').style.display = "block";
							 
						 }, 2000);
					 
					 }, 500);
					 
				 }, 500);
				 
			 }, 500);
			 
		 }else if(par === 1){
			 
			 document.getElementById('ai6').style.display = "block";
			 document.getElementById('textio').innerHTML ="Vabandust, ma ei tea mida küsida. Lisage ehk ise mõni küsimus?";
			 
		 }else if(par === 2){
			 
			 document.getElementById('textio').innerHTML ="Olgu, siis ma uuendan lehte niisama.";
			 document.getElementById('ai4').style.display = "block";
			 
			 setTimeout(function(){
				 AI.instance.restart();
			 }, 4000);
			 
		 }else if(par === 3){
			 document.getElementById('textio').innerHTML ="Siin saate küsimusi muuta või kustutada.";
			 document.getElementById('ai4').style.display = "block";
		 }else if(par === 4){
			 document.getElementById('textio').innerHTML ="Kahjuks vale vastus. Proovige uuesti!";
			 document.getElementById('ai4').style.display = "block";
			 
			 setTimeout(function(){
				 AI.instance.restart();
			 }, 4000);
		 }
		 
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
			 this.animate(2);
			
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
			
			AI.instance.animate(1);
			
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
		 }else if(nr === 5){
			 
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
			 
			 this.animate(4);
		 }
	 },
	 //otsustab mis küsimust näidata
	 logik: function(count){
		
		if(AI.instance.kysd[count] !== undefined){

			this.kysd = JSON.parse(localStorage.kysd);

			var q = AI.instance.kysd[count].kysimus;
			document.getElementById('question_span').innerHTML = q;
			
			if(q === 'aylmao'){
				document.body.style.backgroundImage = "url('pics/aylmao.gif')";
				document.body.style.backgroundSize = "cover";
				document.body.style.backgroundRepeat = "no-repeat";
			}
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
		 
		 var k = prompt('Mis oleks uus küsimus?');
		 if(!k){return;}
		 
		 var b = prompt('Selle küsimuse vastus (Jah/Ei)?');
		 if(!b){return;}
		 
		 var kysi_id = event.target.dataset.id;
		 
		 var clicked_li = event.target.parentNode.parentNode;
		 console.log(clicked_li)
		// document.querySelector('.list_of_kysd').removeChild(clicked_li);
		 
		 this.kysd.forEach(function(kys, i){
			 
			 if(kys.id == event.target.dataset.id){
				 //mis index ja mitu. + lisaks saab asendada vajadusel
				 AI.instance.kysd.splice(i, 1);
			 }
			 
		 });
		 
		 var new_kys = new Kys(k, b, kysi_id);

		 AI.instance.kysd.push(new_kys);
		 // AI.instance.kysd.splice(i, 1, '{"kysimus":"'+k+'","answer":"'+b+'","id":"'+kysi_id+'"}');
		 
		 localStorage.setItem('kysd', JSON.stringify(this.kysd));
		 
		 this.restart();
		 
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
		 console.log(kysimus);
		 this.kys_id++;
		 
         document.querySelector('.list_of_kysd').appendChild(new_kys.createHtmlElement());

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
     createHtmlElement: function(){
	   
       var li = document.createElement('li');

       var span1 = document.createElement('span');
       span1.className = 'content';
	   
	   var change = document.createElement('span');
       change.appendChild(document.createTextNode('Muuda  /  '));
	   change.style.color = 'purple';
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
	   }else if(this.answer === 1){
		   this.answer = "Jah";
	   }

       var content = document.createTextNode(this.kysimus + '  /  ' + this.answer + '  /  ');
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
