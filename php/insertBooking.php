<?php
include 'db_connect.php';
if($con){

	$reply = array();
$reply['status'] = 'Fail';

$uId = $_GET['uId'];
$hId = $_GET['hId'];
$roomNo = $_GET['roomNo'];
$bookingDate = $_GET['bookingDate'];
$checkInDate = $_GET['checkInDate'];
$duration = $_GET['duration'];
$guests = $_GET['guests'];
$status = $_GET['status'];



$stmt = mysqli_prepare($con, "select bId from booking where uId = ? AND hId = ? AND roomNo = ? AND checkInDate = ?");

mysqli_stmt_bind_param($stmt, 'ssss', $uId, $hId, $roomNo, $checkInDate);
mysqli_stmt_execute($stmt);
mysqli_stmt_bind_result($stmt, $bId);
mysqli_stmt_fetch($stmt);

    if($bId == null ){

    	//$sql =  mysqli_prepare($con, "INSERT INTO booking (uId, hId, roomNo, bookingDate, checkInDate, duration, guests, status)  
    		//VALUES ('7', '1', '2', '2014-12-07', '2014-12-10', '2', '2', 'confirm')");
    	$sql = mysqli_prepare($con, "INSERT INTO booking (uId, hId, roomNo, bookingDate, checkInDate, duration, guests, status) 
    		VALUES (?,?,?,?,?,?,?,?)");
    	
    	mysqli_stmt_bind_param($sql, 'ssssssss', $uId, $hId, $roomNo, $bookingDate, $checkInDate, $duration, $guests, $status);
		mysqli_stmt_execute($sql);

       		$reply['status'] = 'Success';

    }
    else{
       		$reply['status'] = 'Exist';
    }

   


}
print json_encode($reply);
?>



