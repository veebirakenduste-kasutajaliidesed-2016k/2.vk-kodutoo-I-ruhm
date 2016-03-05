<?php
  $file_name = "data.txt";

  $entries_from_file = file_get_contents("$file_name");
  //echo $entries_from_file;
  //String objektideks
  $entries = json_decode($entries_from_file);

  if(isset($_GET["title"]) && isset($_GET["memo"])){
    if(!empty($_GET["title"]) && !empty($_GET["memo"])){
      $object = new stdClass();
      $object->title = $_GET["title"];
      $object->memo = $_GET["memo"];
      $object->dateTime = $_GET["dateTime"]
      //lisan objekti massiivi;
      array_push($entries, $object);

      //salvestan faili üle;
      file_put_contents($file_name, json_encode($entries));
    }
  }
  //trykin välja stringi kujul massiivi
  echo(json_encode($entries));


?>
