<?php
include 'db_connect.php';
if($con){
	$reply = array();
$reply['status'] = 'ok';
$city = '%'.$_GET['string'].'%';
$in = $_GET['checkInDate'];
$pMin = $_GET['pMin'];
$pMax = $_GET['pMax'];
$rMin = $_GET['rMin'];
$rMax = $_GET['rMax'];
$fac = $_GET['fac'];
$cat = $_GET['cat'];
$numF = $_GET['numF'];

$query = "SELECT T.Hid,
       hname,
       streetName,
       country,
       rating,
       t.count
FROM hotel h,

  (SELECT room.hid,
          count(*) AS COUNT
   FROM room
   WHERE roomNo NOT IN
       (SELECT roomNo
        FROM booking b
        WHERE (b.hid = room.hid
               AND b.roomNo = room.roomNo)
          AND ((b.checkInDate <= ?
                AND DATE_ADD(b.checkInDate,INTERVAL b.duration DAY) >= ?)
               OR (b.checkInDate >= ?
                   AND b.checkInDate <= ?)))
     AND price >= ?
     AND price <= ?
     AND cId = ?
   GROUP BY hid) AS T
WHERE T.hid = h.hid
  AND t.COUNT >0
  AND (hname LIKE ?
       OR streetName LIKE ?
       OR country LIKE ?)
  AND rating >= ?
  AND rating <= ?
  AND T.hid IN
    (SELECT hotel.hid
     FROM facilitymapping f
     INNER JOIN hotel ON hotel.hid = f.hid
     INNER JOIN facilities fac ON fac.fid = f.fid ";
     
     if($numF > 0){
      $query .=  "WHERE f.fid REGEXP '" . $fac 
      . "' GROUP BY hotel.hid HAVING COUNT(*) = " . $numF;
     }
     $query .= ");" ;

    
$stmt = mysqli_prepare($con, $query);
mysqli_stmt_bind_param($stmt, 'ssssiiisssii', $in, $in, $in, $out,$pMin,$pMax,$cat, $city, $city, $city,$rMin,$rMax);
mysqli_stmt_execute($stmt);
mysqli_stmt_bind_result($stmt, $id, $name, $street,$country, $rating, $count);

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