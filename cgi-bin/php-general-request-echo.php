<?php

echo "<b>Request Method:</b> " . $_SERVER['REQUEST_METHOD'] . "<br />\n";

echo "<b>Protocol:</b> " . $_SERVER['SERVER_PROTOCOL'] . "<br />\n";

echo "<b>Query String:</b><br />\n";
parse_str($_SERVER['QUERY_STRING'], $params);
echo '<pre>';
print_r($params);
echo '</pre>';

$json = file_get_contents("php://input");
parse_str($json, $params);
echo "<b>Message Body:</b><br />\n";
echo '<pre>';
print_r($params);
echo '</pre>';
?>
