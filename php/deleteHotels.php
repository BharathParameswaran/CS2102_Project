<?php
include 'db_connect.php';
if($con){
	$reply = array();
$reply['status'] = 'ok';
$ids = $_POST['ids'];
$reply['ids'] = $ids;
$stmt = mysqli_prepare($con, "delete from hotel where hid REGEXP ?");
mysqli_stmt_bind_param($stmt, 's', $ids);
mysqli_stmt_execute($stmt);

if(mysqli_stmt_affected_rows($stmt) < 0){
	$reply['status'] = 'Some of the hotels could not be deleted. Please try again later!';
}
}
print json_encode($reply);
?>

