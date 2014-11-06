<?php
	include 'db_connect.php';

	$userId = $_GET["userId"];
	$bookingId = $_GET["bookingId"];
	$action = $_GET["action"];

	// Check connection
	
if($con){
		if ($action == "cancel") {
			mysqli_query($con,"UPDATE booking SET status = 'cancelled' WHERE bId = " . $bookingId . " AND uId = " . $userId);
		}

		if ($action == "edit") {	
//			select R.roomNo from room R, hotel H where R.hId = H.hId and H.hId = 1 and R.cId = 2 and not exists (select * from booking B1 where B1.hId = 1 and B1.roomNo = R.roomNo and ((B1.checkInDate <= '2014-10-27' AND date_add(B1.checkInDate, interval B1.duration day) >= '2014-10-27')
//	OR (B1.checkInDate <= date_add('2014-10-27', interval 2 day) AND date_add(B1.checkInDate, interval B1.duration day) >= date_add('2014-10-27', interval 2 day)))) ORDER BY RAND() LIMIT 1
			$checkInDate = $_GET["checkInDate"];
			$duration = $_GET["duration"];
			$roomType = $_GET["roomType"];

		$result = mysqli_query($con,"select count(*) as noBooking from booking B1, booking B2 
			where B2.bId = " . $bookingId . " and B1.hId = B2.hId and B1.roomNo = B2.roomNo and B1.bId <> B2.bId 
			AND ((B1.checkInDate <= '" . $checkInDate . "' AND date_add(B1.checkInDate, interval B1.duration day) >= '" . $checkInDate . "')
				OR (B1.checkInDate <= date_add('" . $checkInDate . "', interval " . $duration . " day) 
					AND date_add(B1.checkInDate, interval B1.duration day) >= date_add('" . $checkInDate . "', interval " . $duration . " day)))");
//			$result = mysqli_query($con,"select count(*) as noBooking from booking where hId = " . $hotelId . "and roomNo = " . $roomNo . " AND ((checkInDate <= '" . $checkInDate . "' AND date_add(checkInDate, interval duration day) >= '" . $checkInDate ."')
//	OR (checkInDate <= date_add('" . $checkInDate . "', interval " . $duration . " day) AND date_add(checkInDate, interval duration day) >= date_add('" . $checkInDate . "', interval " . $duration . " day)))");
			$row = mysqli_fetch_array($result);

			if ($row['noBooking'] == 0 && $roomType == -1) {
				mysqli_query($con,"UPDATE booking SET checkInDate='" . $checkInDate . "', duration = " . $duration . " WHERE bId = " . $bookingId . " AND uId = " . $userId);
			} else {
				if ($roomType != -1) 
					$result = mysqli_query($con,"select room.roomNo, category.maxGuests from room, category where room.cId = " . $roomType . " and room.hId = (select hId from booking where bId = " . $bookingId . ") and room.cId = category.cId  and room.roomNo not in 
					(select B1.roomNo from booking B1 where B1.hId = (select hId from booking where bId = " . $bookingId . ") and ((B1.checkInDate <= '" . $checkInDate . "' AND date_add(B1.checkInDate, interval B1.duration day) >= '" . $checkInDate . "')
					OR (B1.checkInDate <= date_add('" . $checkInDate . "', interval " . $duration . " day) AND  date_add(B1.checkInDate, interval B1.duration day) >= date_add('" . $checkInDate . "', interval " . $duration . " day)))) order by rand() limit 1");
				else
					$result = mysqli_query($con,"select room.roomNo, category.maxGuests from room, category where room.cId = (select distinct R.cId from room R, booking B where B.bId = " . $bookingId . " and B.roomNo = R.roomNo) and room.hId = (select hId from booking where bId = " . $bookingId . ") and room.cId = category.cId  and room.roomNo not in 
					(select B1.roomNo from booking B1 where B1.hId = (select hId from booking where bId = " . $bookingId . ") and ((B1.checkInDate <= '" . $checkInDate . "' AND date_add(B1.checkInDate, interval B1.duration day) >= '" . $checkInDate . "')
					OR (B1.checkInDate <= date_add('" . $checkInDate . "', interval " . $duration . " day) AND  date_add(B1.checkInDate, interval B1.duration day) >= date_add('" . $checkInDate . "', interval " . $duration . " day)))) order by rand() limit 1");
				$row = mysqli_fetch_array($result);
				$newRoom = $row['roomNo'];
				$maxGuests = $row['maxGuests'];
				mysqli_query($con,"UPDATE booking SET roomNo = '" . $newRoom . "', guests = " . $maxGuests . ", checkInDate='" . $checkInDate . "', duration = " . $duration . " WHERE bId = " . $bookingId . " AND uId = " . $userId);
			}
		}

		$resultArray = array();
		if ($action == "getRoomType") {
			$result = mysqli_query($con,"SELECT cId, cname FROM category");
			while ($row = mysqli_fetch_array($result)) {
				$cate = array("cId" => $row['cId'], "cname" => $row['cname']);
				array_push($resultArray, $cate);
			}
		} else {
			$result = mysqli_query($con,"SELECT DISTINCT B.bId, H.hName, C.cId, C.cname, B.bookingDate, B.checkInDate, B.duration, B.guests, B.status FROM booking B, hotel H, room R, category C WHERE H.hId = B.hId AND B.roomNo = R.roomNo AND R.cId = C.cId AND B.uId = " . $userId . " ORDER BY B.bookingDate");
			while ($row = mysqli_fetch_array($result)) {
				$booking = array("bId" => $row['bId'], "hName" => $row['hName'], "roomCatId" => $row['cId'], "roomCat" => $row['cname'], "bookingDate" => $row['bookingDate'], "checkInDate" => $row['checkInDate'], "duration" => $row['duration'], "guests" => $row['guests'], "status" => $row['status']);
				array_push($resultArray, $booking);
			}
		}

		echo json_encode($resultArray);
	}
?>