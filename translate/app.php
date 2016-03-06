<?php
	session_start();
	include "../../../php/db.php";
	include "../../2.tund-I-ruhm/functions.php";
?>
<!doctype html>
<html>
	<head>
		<meta charset="UTF-8">
		<title></title>
		<link rel="stylesheet" href="style.css" />
	</head>
	<body>
		<i style="color:lightcoral;">See on tõlkerakendus. Siin saab siduda omavahel inglise keelseid sõnu ja eestikeelseid sõnu.</i>
		<?php
			$result=$connection->query("SELECT id, en, et FROM translations");
				while($row=$result->fetchObject()){
					echo"
						
						<p>".$row->en."</p>
							
					";
					echo "
						<form action='?' method='POST'>
							<p style='font-weight:bold;'>Tõlgi siia:</p>
							<div contenteditable='true'>
								<p class='editable'>".stripslashes($row->et)."</p>
							</div>
							<textarea type='text' name='et' class='target'>".stripslashes($row->et)."</textarea>
							<input type='hidden' value='".$row->id."' name='id' />
							<input type='submit' value='salvesta' name='update_et' class='save flat' />
						</form>
					";
				}
		?>
		
		<p class="split_here"></p>
		<p class="array_here"></p>
		<p style="font-weight:bold;">Vali paarid siin:</p>
		<div onclick="select_en(event);" class="value_en"></div>
		<div onclick="select_et(event);" class="value_et"></div>
		
		<form id="equals">
			<input type="text" class="en" /> </br>
			<input type="text" class="et" />
		</form>
		<button class="add-new-jar pull-right flat">Lisa uus Tõlge</button>
		<div class="section_en" style="pointer-events:none;"></div>
		<div class="section_et" style="pointer-events:none;"></div>
		<script>
			
			<?php
				$result=$connection->query("SELECT id, en, et FROM translations");
				while($row=$result->fetchObject()){
					echo "var text_en = '".$row->en."';";
					echo "var text_et = '".stripslashes($row->et)."';";
				}
			?>
			
			var text_en_split = text_en.replace(/\./g, ""); //splits sentences on dot. Not necessary to use
			var word_en_split = text_en.split(" "); //Splits sentence into words
			var text_et_split = text_et.replace(/\./g, "");
			var word_et_split = text_et.split(" ");
			var word_array = [word_en_split]; //creates an array of split words
			var array = JSON.stringify(word_en_split); // creates a stringified array
			
			//document.querySelector(".split_here").innerHTML = text_split;
			//document.querySelector(".array_here").innerHTML = word_split;
			
			console.log(text_en);
			console.log(text_et);
			console.log(text_en_split);
			console.log(text_et_split);
			
			console.log(word_array);
			console.log(word_en_split);
			console.log(array);
			
			var i; //counter of times gone through the array
			var value_en = document.querySelector(".value_en"); //element where split words are written seperately <span>word</span>
			var value_et = document.querySelector(".value_et");
			for(i=0; i<word_en_split.length; i++){ 
				
				// Goes through the array of words and writes them seperately into a <div>
				
				console.log(word_en_split[i]);
				value_en.innerHTML += "<span class='first'>"+word_en_split[i]+" </span>"
				
			}
			
			for(i=0; i<word_et_split.length; i++){
				
				// Goes through the array of words and writes them seperately into a <div>
				
				console.log(word_et_split[i]);
				value_et.innerHTML += "<span class='first'>"+word_et_split[i]+" </span>"
				
			}
			
			function select_en(event) {
				
				//Function to allow selection of words seperately
				
				var to_click = event.target;
				
				if(to_click.className == "in"){ //just a test to see if double clicking would remove word from input. NOT
					console.log("should remove from input");
					var en = event.target.innerHTML;
					//document.querySelector(".en").value -= en; //see ei toimi
				}
				else{
					event.target.style.color = "green";
					var en = event.target.innerHTML;
					to_click.className = "in";
					document.querySelector(".en").value += en;
				}
				
				
			}
			
			function select_et(event) {
				
				//Function to allow selection of words seperately
				
				event.target.style.color = "green";
				var et = event.target.innerHTML;
				document.querySelector(".et").value += et;
				
			}
		</script>
		<script src="app.js"></script>
		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js" type="text/javascript"></script>
		<script src="script.js"></script>
	</body>
</html>