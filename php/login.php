<?php
include 'db_connect.php';
if($con){

	$reply = array();
$reply['status'] = 'Fail';
$Username = $_GET['username'];
$Password = $_GET['pass'];


$stmt = mysqli_prepare($con, "select uId, name from user where userName = ? and password = ?");

mysqli_stmt_bind_param($stmt, 'ss', $Username, $Password);
mysqli_stmt_execute($stmt);
mysqli_stmt_bind_result($stmt, $uId, $name);
mysqli_stmt_fetch($stmt);

    if($name != null ){
       $reply['status'] = 'Success';
		$reply['name'] = $name;
		$reply['uId'] = $uId;
    }
   


}
print json_encode($reply);
?>