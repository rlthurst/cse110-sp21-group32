<?php
echo "<b>Query String:</b> " . $_SERVER["QUERY_STRING"] . "<br />\n";
parse_str($_SERVER['QUERY_STRING'], $params);
echo '<pre>';
print_r($params);
echo '</pre>';

?>
