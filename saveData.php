<?php

$file_title = "data.txt";

//faili sisu
$entries_from_file = file_get_contents($file_title);
//echo $entries_from_file
//string objektideks
$entries = json_decode($entries_from_file);
//var_dump($entries); {"title":"janek"}
//?title=nimi&ingredients=koostis

if(isset($_GET["name"]) && isset($_GET["surname"]) && isset($_GET["age"]) && isset($_GET["address"]) && isset($_GET["creditcard"]) && isset($_GET["security"])){
  if(!empty($_GET["name"]) && !empty($_GET["surname"]) && !empty($_GET["age"]) && !empty($_GET["address"]) && !empty($_GET["creditcard"]) && !empty($_GET["security"])){
    //lihtne objekt
    $object = new stdClass();
    $object->name = $_GET["name"];
    $object->surname = $_GET["surname"];
    $object->age = $_GET["age"];
    $object->address = $_GET["address"];
    $object->creditcard = $_GET["creditcard"];
    $object->security = $_GET["security"];

    //lisan objekti massiivi
    array_push($entries, $object);

    //Teen stringiks
    $json_string = json_encode($entries);

    //salvestan faili üle
    file_put_contents($file_title, $json_string);
  }
}
//trükin välja stringi kujul massiivi (võib olla lisas midagi juurde)
echo(json_encode($entries));

?>
