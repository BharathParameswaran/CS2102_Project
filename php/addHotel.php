<?php
include 'db_connect.php';
if($con){
	$reply = array();
$reply['status'] = 'ok';

$name = $_POST['name'];
$unit = $_POST['unit'];
$street = $_POST['street'];
$country = $_POST['country'];
$postal = $_POST['postal'];
$contact = $_POST['contact'];
$rating = $_POST['rating'];
$facs = json_decode($_POST['fac']);

$reply['name'] = $name;
$reply['street'] = $street;
$reply['fac'] = $facs;

$stmt = mysqli_prepare($con, "insert into hotel (hname, unitNo, streetName, country, postalCode, contact, rating) values (?, ?,?,?,?,?,?)");
mysqli_stmt_bind_param($stmt, 'sssssss', $name, $unit, $street, $country, $postal, $contact, $rating);
mysqli_stmt_execute($stmt);

if(mysqli_stmt_affected_rows($stmt) < 0){
	$reply['status'] = 'Add failed. Please try again later.';
}

}
print json_encode($reply);
?>

