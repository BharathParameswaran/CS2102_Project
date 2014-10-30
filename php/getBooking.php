<?php
	$url="localhost";
	$user_name="root";
	$db_password="password";
	$db_name="cs2102";
	$con=mysqli_connect($url, $user_name, $db_password, $db_name);

	$userId = $_GET["userId"];

	// Check connection
	if (mysqli_connect_errno()) {
	  echo "Failed to connect to MySQL: " . mysqli_connect_error();
	// Create connection
	} else {
		$bookingArray = array();
		$result = mysqli_query($con,"SELECT DISTINCT B.bId, H.hName, C.cname, B.bookingDate, B.checkInDate, B.duration, B.guests, B.status FROM booking B, hotel H, room R, category C WHERE H.hId = B.hId AND B.roomNo = R.roomNo AND R.cId = C.cId AND B.uId = " . $userId . " ORDER BY B.bookingDate");
		while ($row = mysqli_fetch_array($result)) {
			$booking = array("bId" => $row['bId'], "hName" => $row['hName'], "roomCat" => $row['cname'], "bookingDate" => $row['bookingDate'], "checkInDate" => $row['checkInDate'], "duration" => $row['duration'], "guests" => $row['guests'], "status" => $row['status']);
			array_push($bookingArray, $booking);
		}

		echo json_encode($bookingArray);
	}
?>