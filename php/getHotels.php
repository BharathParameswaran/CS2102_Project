<?php
$reply = array();
$reply['status'] = 'ok';
$city = $_GET['string'];
$in = $_GET['checkInDate'];
$out = $_GET['checkOutDate'];


print json_encode($reply);
?>