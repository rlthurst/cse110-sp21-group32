<?php
$date = date("Y-m-d");
$address = $_SERVER['REMOTE_ADDR'];

$myObj->message = "Hello World from PHP IM RUDY!";
$myObj->date = $date;
$myObj->ipAddress = $address;

$myJSON = json_encode($myObj);

echo $myJSON;
?>
