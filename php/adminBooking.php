<?php
	
	include 'db_connect.php';

	$action = $_GET["action"];
	// Check connection
	if ($con) {
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
				where B1.roomNo = " . $roomNo . " AND B1.hId = (select B2.hId from booking B2 where B2.bId = " . $bookingId . ") AND ((B1.checkInDate <= '" . $checkInDate . "' AND date_add(B1.checkInDate, interval B1.duration day) >= '" . $checkInDate . "')
					OR (B1.checkInDate <= date_add('" . $checkInDate . "', interval " . $duration . " day) 
						AND date_add(B1.checkInDate, interval B1.duration day) >= date_add('" . $checkInDate . "', interval " . $duration . " day)))");
				$row = mysqli_fetch_array($result);

				if ($row['noBooking'] == 0) {
					mysqli_query($con,"UPDATE booking SET roomNo = " . $roomNo . ", checkInDate='" . $checkInDate . "', duration = " . $duration . " WHERE bId = " . $bookingId . " AND uId = " . $userId . " AND '" . $checkInDate . "' > date_add(now(), interval 1 day)");
				}
			}
			
			if ($action == "sort") {
				$attr = $_GET["attr"];
				if ($attr == "1") {
					$sortAttr = "B.bId";
				} else if ($attr == "2") {
					$sortAttr = "U.name";
				} else if ($attr == "3") {
					$sortAttr = "H.hName";
				} else {
					$sortAttr = "B.checkInDate";
				}
   
				$result = mysqli_query($con,"SELECT B.bId, B.uId, U.name, H.hName, R.roomNo, C.cId, C.cname, B.bookingDate, B.checkInDate, B.duration, B.guests, B.status FROM booking B, hotel H, room R, category C, user U WHERE H.hId = B.hId AND B.roomNo = R.roomNo AND R.hId = B.hId AND R.cId = C.cId and U.uId = B.uId ORDER BY " . $sortAttr);
				while ($row = mysqli_fetch_array($result)) {
					$booking = array("bId" => $row['bId'], "uId" => $row['uId'], "name" => $row['name'], "hName" => $row['hName'], "roomNo" => $row['roomNo'], "roomCatId" => $row['cId'], "roomCat" => $row['cname'], "bookingDate" => $row['bookingDate'], "checkInDate" => $row['checkInDate'], "duration" => $row['duration'], "guests" => $row['guests'], "status" => $row['status']);
					array_push($resultArray, $booking);
				}	
			} else {
				$result = mysqli_query($con,"SELECT B.bId, B.uId, U.name, H.hName, R.roomNo, C.cId, C.cname, B.bookingDate, B.checkInDate, B.duration, B.guests, B.status FROM booking B, hotel H, room R, category C, user U WHERE H.hId = B.hId AND B.roomNo = R.roomNo AND R.hId = B.hId AND R.cId = C.cId and U.uId = B.uId ORDER BY B.bId");
				while ($row = mysqli_fetch_array($result)) {
					$booking = array("bId" => $row['bId'], "uId" => $row['uId'], "name" => $row['name'], "hName" => $row['hName'], "roomNo" => $row['roomNo'], "roomCatId" => $row['cId'], "roomCat" => $row['cname'], "bookingDate" => $row['bookingDate'], "checkInDate" => $row['checkInDate'], "duration" => $row['duration'], "guests" => $row['guests'], "status" => $row['status']);
					array_push($resultArray, $booking);
				}	
			}
		}

		echo json_encode($resultArray);
	}
?>