<?php
$json = file_get_contents("php://input");
parse_str($json, $params);
echo '<pre>';
print_r($params);
echo '</pre>';
?>
