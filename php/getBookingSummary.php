<?php
include 'db_connect.php';
if($con){

	$reply = array();
$reply['status'] = 'Fail';
$hId = $_GET['hId'];
$cId = $_GET['cId'];


$stmt = mysqli_prepare($con, "SELECT c.cname, min(r.price)
FROM room r, category c
WHERE r.hId=? AND r.cId=? AND r.cId = c.cId;");

mysqli_stmt_bind_param($stmt, 'ss', $hId, $cId);
mysqli_stmt_execute($stmt);
mysqli_stmt_bind_result($stmt, $cName, $price);
mysqli_stmt_fetch($stmt);

    if($cName != null ){
       $reply['status'] = 'Success';
		$reply['cName'] = $cName;
		$reply['price'] = $price;
    }
   

$hotel = array();
$hotel['status'] = 'Fail';
$statement = mysqli_prepare($con, "select * from hotel WHERE hId = ?");
mysqli_stmt_bind_param($statement, 's', $hId);
mysqli_stmt_execute($statement);
mysqli_stmt_bind_result($statement, $hId, $hName, $unitNo, $street, $country, $postal, $contact, $rating);
mysqli_stmt_fetch($statement);

	$result = array();

    if($hId != null ){
    	$hotel = array();
       
		$hotel['hName'] = $hName;
		$hotel['unitNo'] = $unitNo;
		$hotel['street'] = $street;
		$hotel['country'] = $country;
		$hotel['postal'] = $postal;
		$hotel['contact'] = $contact;
		$hotel['rating'] = $rating;
		array_push($result, $hotel);
    }
    $reply['answer'] = $result;

   

}
print json_encode($reply);
?>