<?php
include 'db_connect.php';
if($con){
	$reply = array();
$reply['status'] = 'ok';
$id = $_GET['id'];


$stmt = mysqli_prepare($con, "select fid from facilitymapping where hid = ?");
mysqli_stmt_bind_param($stmt, 'i', $id);
mysqli_stmt_execute($stmt);
mysqli_stmt_bind_result($stmt, $fid);

    $result = array();
    $num_rows =0;

    while (mysqli_stmt_fetch($stmt)) {
        $num_rows ++;
    	array_push($result, $fid);
    }
        json_encode($result);
        $reply['facilities'] = $result;



$stmt = mysqli_prepare($con, "select * from hotel where hid = ?");
mysqli_stmt_bind_param($stmt, 'i', $id);
mysqli_stmt_execute($stmt);
mysqli_stmt_bind_result($stmt, $id, $name,$unit, $street,$country, $postal,$contact, $rating);
 $returnedHotel = array();

while (mysqli_stmt_fetch($stmt)) {
       
        $returnedHotel[0] = $id;
        $returnedHotel[1] = $name;
        $returnedHotel[2] = $unit;
        $returnedHotel[3] = $street;
        $returnedHotel[4] = $country;
        $returnedHotel[5] = $postal;
        $returnedHotel[6] = $contact;
        $returnedHotel[7] = $rating;      
    }
    json_encode($returnedHotel); 
        $reply['details'] = $returnedHotel; 
}
print json_encode($reply);
?>