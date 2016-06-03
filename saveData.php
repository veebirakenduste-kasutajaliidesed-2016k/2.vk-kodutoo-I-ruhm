<?php
  $file_name = "data.txt";
  //faili sisu
  $entries_from_file = file_get_contents($file_name);
  //echo $entries_from_file;
  //string objektideks
  $entries = json_decode($entries_from_file);
  //var_dump($entries);
  // {"name":"romil"}
  //?name=nimi&ingridients=koostis
  if(isset($_GET["time"]) && isset($_GET["description"])){
    //ei ole tühjad
    if(!empty($_GET["time"]) && !empty($_GET["description"])){
        //lihtne objekt
        $object = new StdClass();
        $object->time = $_GET["time"];
        $object->description = $_GET["description"];
        //lisan objekti massiivi
        array_push($entries, $object);
        //TEEN STRINGIKS
        $json_string = json_encode($entries);
        //salvestan faili üle, salvestan massiivi stringi kujul
        file_put_contents($file_name, $json_string);
    }
  }
  //trükin välja stringi kuju massiivi (võib-olla lisas midagi juurde)
  echo(json_encode($entries));
?>
