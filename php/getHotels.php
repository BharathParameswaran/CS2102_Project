<?php
include 'db_connect.php';
if($con){
	$reply = array();
$reply['status'] = 'ok';
$city = '%'.$_GET['string'].'%';
$in = $_GET['checkInDate'];
$out = $_GET['checkOutDate'];

$stmt = mysqli_prepare($con, "SELECT T.Hid, hname, streetName, country, rating, t.count FROM hotel h,  
(SELECT room.hid, COUNT(*) AS count FROM room WHERE roomNo NOT IN 
(SELECT roomNo FROM booking b WHERE (b.hid = room.hid AND b.roomNo = room.roomNo) AND ((b.checkInDate <= ? AND DATE_ADD(b.checkInDate,INTERVAL b.duration DAY) >= ?) 
OR (b.checkInDate >= ? AND b.checkInDate <= ?))) 
GROUP BY hid) 
AS T WHERE T.hid = h.hid AND t.count >0
AND (hname LIKE ? OR streetName LIKE ?  OR country LIKE ?)");
mysqli_stmt_bind_param($stmt, 'sssssss', $in, $in, $in, $out, $city, $city, $city);
mysqli_stmt_execute($stmt);
mysqli_stmt_bind_result($stmt, $id, $name, $street,$country, $rating, $count);
echo $name;
    $result = array();
    $num_rows =0;

    while (mysqli_stmt_fetch($stmt)) {
        $num_rows ++;
    	$returnedHotel = array();
    	$returnedHotel['id'] = $id;
    	$returnedHotel['name'] = $name;
    	$returnedHotel['street'] = $street;
    	$returnedHotel['country'] = $country;
    	$returnedHotel['rating'] = $rating;
    	$returnedHotel['emptyRooms'] = $count;
    	array_push($result, $returnedHotel);
    }
    if($num_rows == 0){
        $reply['status'] = "empty";
    }
    else{
        json_encode($result);
        $reply['answer'] = $result;

    }

}
print json_encode($reply);
?>