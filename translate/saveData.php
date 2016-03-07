<?php
	$file_name = "christmas.txt";
	
	//faili sisu
	$entries_from_file = file_get_contents($file_name);
	//echo $entries_from_file;
	
	//string objektideks
	$entries = json_decode($entries_from_file);
	//var_dump($entries);
	//[{"en":"The First"}]
	
	//?en=The first&et=Esimene
	if(isset($_GET["en"]) && isset($_GET["et"])){
		//ei ole t??d
		if(!empty($_GET["en"]) && !empty($_GET["et"])){
			//lihtne objekt
			$object = new StdClass();
			$object -> en = $_GET["en"];
			$object -> et = $_GET["et"];
			
			//lisan objekti massiivi
			array_push($entries, $object);
			
			//salvestan faili ?? salvestan massiivi stringi kujul
			//siin v??olla ka andmebaasi salvestus
			file_put_contents($file_name, json_encode($entries));
		}
	}
	//tr?? v?a stringi kujul massiivi ( v??olla lisas midagi juurde );
	echo(json_encode($entries));
?>