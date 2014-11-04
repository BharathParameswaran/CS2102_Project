<?php
include 'db_connect.php';
if($con){
	$reply = array();
$reply['status'] = 'ok';
$id = $_POST['id'];
$reply['id'] = $id;
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

$stmt = mysqli_prepare($con, "update hotel set hname = ? , unitNo = ? , streetName = ? , country = ? , postalCode = ? , contact = ? , rating = ? where hid = ?");
mysqli_stmt_bind_param($stmt, 'sssssssi', $name, $unit, $street, $country, $postal, $contact, $rating, $id);
mysqli_stmt_execute($stmt);

if(mysqli_stmt_affected_rows($stmt) < 0){
	$reply['status'] = 'Update failed. Please try again later.';
}
else{

	$stmt = mysqli_prepare($con, "delete from facilitymapping where hid = ?");
	mysqli_stmt_bind_param($stmt, 'i', $id);
	mysqli_stmt_execute($stmt);
	$reply['new'] = [];
	foreach ($facs as $fac) {
		array_push($reply['new'], $fac);
	$stmt = mysqli_prepare($con, "insert into facilitymapping values(?,?)");
	mysqli_stmt_bind_param($stmt, 'ii', $id, $fac);
	mysqli_stmt_execute($stmt);
	}
}

}
print json_encode($reply);
?>

