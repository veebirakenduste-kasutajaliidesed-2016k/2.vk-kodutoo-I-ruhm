setTimeout(function(){
	$(document).ready(function(){
		$(".first").hover(function(){
			$(this).toggleClass("green");
		});
		$("body").on("hover", "span.match0", function(e){
			$(".match0").toggleClass("blue");
		});
		$("body").on("hover", "span.match1", function(e){
			$(".match1").toggleClass("blue");
		});
		$("body").on("hover", "span.match2", function(e){
			$(".match2").toggleClass("blue");
		});
		$("body").on("hover", "span.match3", function(e){
			$(".match3").toggleClass("blue");
		});
		$("body").on("hover", "span.match4", function(e){
			$(".match4").toggleClass("blue");
		});
		$("body").on("hover", "span.match5", function(e){
			$(".match5").toggleClass("blue");
		});
		$("body").on("hover", "span.match6", function(e){
			$(".match6").toggleClass("blue");
		});
		$("body").on("hover", "span.match7", function(e){
			$(".match7").toggleClass("blue");
		});
		$("body").on("hover", "span.match8", function(e){
			$(".match8").toggleClass("blue");
		});
		$("body").on("hover", "span.match9", function(e){
			$(".match9").toggleClass("blue");
		});
		$("body").on("hover", "span.match10", function(e){
			$(".match10").toggleClass("blue");
		});
		$(".section_en").css("pointerEvents","initial");
		$(".section_et").css("pointerEvents","initial");
		console.log("JQUERY saab valmis setTimeout-iga");
	});
}, 1000);