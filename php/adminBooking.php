<?php
	$url="localhost";
	$user_name="root";
	$db_password="password";
	$db_name="cs2102";
	$con=mysqli_connect($url, $user_name, $db_password, $db_name);

	$action = $_GET["action"];
	// Check connection
	if (mysqli_connect_errno()) {
	  echo "Failed to connect to MySQL: " . mysqli_connect_error();
	// Create connection
	} else {
		$resultArray = array();
		if ($action == "getHotelList") {
			$result = mysqli_query($con,"select * from hotel");
			while ($row = mysqli_fetch_array($result)) {
				$hotel = array("hId" => $row['hId'], "hName" => $row['hname']);
				array_push($resultArray, $hotel);
			}


		} else {
			if ($action == "changeRoom") {
				$bookingId = $_GET["bookingId"];
				$userId = $_GET["userId"];
				$checkInDate = $_GET["checkInDate"];
				$duration = $_GET["duration"];
				$roomNo = $_GET["roomNo"];

				$result = mysqli_query($con,"select count(*) as noBooking from booking B1 
				where B1.roomNo = " . $roomNo . " AND ((B1.checkInDate <= '" . $checkInDate . "' AND date_add(B1.checkInDate, interval B1.duration day) >= '" . $checkInDate . "')
					OR (B1.checkInDate <= date_add('" . $checkInDate . "', interval " . $duration . " day) 
						AND date_add(B1.checkInDate, interval B1.duration day) >= date_add('" . $checkInDate . "', interval " . $duration . " day)))");
				$row = mysqli_fetch_array($result);

				if ($row['noBooking'] == 0) {
					mysqli_query($con,"UPDATE booking SET roomNo = " . $roomNo . ", checkInDate='" . $checkInDate . "', duration = " . $duration . " WHERE bId = " . $bookingId . " AND uId = " . $userId);
				}
			}
			
			$result = mysqli_query($con,"SELECT DISTINCT B.bId, B.uId, H.hName, R.roomNo, C.cId, C.cname, B.bookingDate, B.checkInDate, B.duration, B.guests, B.status FROM booking B, hotel H, room R, category C WHERE H.hId = B.hId AND B.roomNo = R.roomNo AND R.cId = C.cId ORDER BY B.bId");
			while ($row = mysqli_fetch_array($result)) {
				$booking = array("bId" => $row['bId'], "uId" => $row['uId'], "hName" => $row['hName'], "roomNo" => $row['roomNo'], "roomCatId" => $row['cId'], "roomCat" => $row['cname'], "bookingDate" => $row['bookingDate'], "checkInDate" => $row['checkInDate'], "duration" => $row['duration'], "guests" => $row['guests'], "status" => $row['status']);
				array_push($resultArray, $booking);
			}
		}

		echo json_encode($resultArray);
	}
?>