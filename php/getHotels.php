<?php
include 'db_connect.php';
if($con){
	$reply = array();
$reply['status'] = 'ok';
$city = '%'.$_GET['string'].'%';
$in = $_GET['checkInDate'];
$out = $_GET['checkOutDate'];

$stmt = mysqli_prepare($con, "SELECT hname, streetName, rating FROM hotel h WHERE (hname LIKE ? OR streetName LIKE ? 
	OR country LIKE ?) AND EXISTS (SELECT * FROM room r WHERE r.hid= h.hid AND roomNo NOT IN 
	(SELECT roomNo FROM booking b WHERE b.hid=h.hid AND ((b.checkInDate <= ? 
		AND DATE_ADD(b.checkInDate,INTERVAL b.duration DAY) >= ?) 
		OR (b.checkInDate >= ? AND b.checkInDate <= ?))))");
mysqli_stmt_bind_param($stmt, 'sssssss', $city, $city, $city, $in, $in, $in, $out);
mysqli_stmt_execute($stmt);
mysqli_stmt_bind_result($stmt, $name, $street, $rating);
echo $name;
    $result = array();

    while (mysqli_stmt_fetch($stmt)) {
    	$returnedHotel = array();
    	$returnedHotel['name'] = $name;
    	$returnedHotel['street'] = $street;
    	$returnedHotel['rating'] = $rating;
    	array_push($result, $returnedHotel);
    }
    json_encode($result);

$reply['answer'] = $result;
}
print json_encode($reply);
?>