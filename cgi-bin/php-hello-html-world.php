<?php 
Echo "<html>";
Echo "<head>";
Echo "<title>Hello, PHP!</title>";
Echo "</head>";
Echo "<body>";

Echo "<h1>Rudy was here - Hello, PHP!</h1>";
Echo "<p>Hello World!</p>";
date_default_timezone_set("America/Los_Angeles");
Echo "<p>Current Date/Time: " . date("l m/d/y H:i:s") . "</p>";

# IP Address is an environment variable when using CGI
$address = $_SERVER['REMOTE_ADDR'];
Echo "<p>Your IP Address: " . $address . "</p>";

Echo "</body>";
Echo "</html>";
?>
