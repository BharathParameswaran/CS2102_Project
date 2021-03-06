<?php
include 'db_connect.php';
if($con){

	$reply = array();
$reply['status'] = 'Fail';
$hId = $_GET['hId'];
$cId = $_GET['cId'];
$checkInDate = $_GET['checkInDate'];
$checkOutDate = $_GET['checkOutDate'];


$stmt = mysqli_prepare($con, "SELECT r.roomNo, r.price, c.cname FROM room r, category c WHERE r.hId=? AND r.cId=? AND r.cId = c.cId AND r.roomNo NOT IN (SELECT roomNo FROM booking b WHERE (b.hid = r.hid AND b.roomNo = r.roomNo) AND ((b.checkInDate <= ? AND DATE_ADD(b.checkInDate,INTERVAL b.duration DAY) >=?) OR (b.checkInDate >= ? AND b.checkInDate <= ?))) limit 1");

mysqli_stmt_bind_param($stmt, 'ssssss', $hId, $cId, $checkInDate, $checkInDate, $checkInDate, $checkOutDate);
mysqli_stmt_execute($stmt);
mysqli_stmt_bind_result($stmt, $roomNo, $price, $cName);


	$result = array();
    $num_rows =0;

    while (mysqli_stmt_fetch($stmt)) {
        $num_rows ++;
    	$room = array();
    	$room['roomNo'] = $roomNo;
    	$room['cName'] = $cName;
    	$room['price'] = $price;
    	array_push($result, $room);
    }
    if($num_rows == 0){
        $reply['status'] = "Empty";
    }
    else{
    	$reply['status'] = "Success";
        json_encode($result);
        $reply['rooms'] = $result;

    }

$getHotel = array();
$statement = mysqli_prepare($con, "select * from hotel WHERE hId = ?");
mysqli_stmt_bind_param($statement, 's', $hId);
mysqli_stmt_execute($statement);
mysqli_stmt_bind_result($statement, $hId, $hName, $unitNo, $street, $country, $postal, $contact, $rating);
mysqli_stmt_fetch($statement);

	$hotel = array();

    if($hId != null ){
    	$hotel['hId'] = $hId;
		$hotel['hName'] = $hName;
		$hotel['unitNo'] = $unitNo;
		$hotel['street'] = $street;
		$hotel['country'] = $country;
		$hotel['postal'] = $postal;
		$hotel['contact'] = $contact;
		$hotel['rating'] = $rating;
		array_push($getHotel, $hotel);
    }
    $reply['answer'] = $getHotel;

   

}
print json_encode($reply);
?>