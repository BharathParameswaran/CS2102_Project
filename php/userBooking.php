<?php
include 'db_connect.php';
if($con){

	$reply = array();
$reply['status'] = 'Fail';
$reply['rows'] = 0;
$UId = $_GET['uId'];


$stmt = mysqli_prepare($con, "SELECT DISTINCT b.bId, h.hname, h.unitNo, h.streetName, h.country, h.postalCode, h.contact, c.cname, b.bookingDate, b.checkInDate, b.duration, b.status, r.price, (b.duration*r.price) AS price
    FROM booking b, user u, hotel h, category c, room r
WHERE u.uId=? AND u.uId=b.uId AND h.hId=b.hId AND r.hId = h.hId AND c.cId = r.cId GROUP BY b.bId;");


mysqli_stmt_bind_param($stmt, 's', $UId);
mysqli_stmt_execute($stmt);
mysqli_stmt_bind_result($stmt, $bId, $hName, $unitNo, $street, $country, $postalCode, $contact, $roomName, $bookingDate, $checkInDate, $duration, $status, $roomPrice, $totalPrice);


	$result = array();
    $num_rows = 0;

    while (mysqli_stmt_fetch($stmt)) {
        $num_rows++;
    	$booking = array();
    	$booking['bId'] = $bId;
    	$booking['hName'] = $hName;
        $booking['unitNo'] = $unitNo;
        $booking['street'] = $street;
        $booking['country'] = $country;
        $booking['postalCode'] = $postalCode;
        $booking['contact'] = $contact;
        $booking['roomName'] = $roomName;
    	$booking['bookingDate'] = $bookingDate;
    	$booking['checkInDate'] = $checkInDate;
    	$booking['duration'] = $duration;
    	$booking['status'] = $status;
        $booking['roomPrice'] = $roomPrice;
        $booking['totalPrice'] = $totalPrice;
    	array_push($result, $booking);

    }
    if($num_rows == 0) {
        $reply['status'] = "Empty";
        $reply['rows'] = $num_rows;
        $reply['phpUid'] = $UId;

    }
    else {
        $reply['status'] = "Success";
        $reply['rows'] = $num_rows;
        $reply['answer'] = $result;
        $reply['phpUid'] = $UId;

    }


}

print json_encode($reply);
?>

