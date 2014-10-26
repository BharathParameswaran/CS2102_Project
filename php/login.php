<?php
include 'db_connect.php';
if($con){

	$reply = array();
$reply['status'] = 'Fail';
$Email = $_GET['email'];
$Password = $_GET['pass'];


$stmt = mysqli_prepare($con, "select uId, name from user where email = ? and password = ?");

mysqli_stmt_bind_param($stmt, 'ss', $Email, $Password);
mysqli_stmt_execute($stmt);
mysqli_stmt_bind_result($stmt, $uId, $name);
echo $count;
    $result = array();
mysqli_stmt_fetch($stmt);

    if($name == null ){
        echo "Login failed";
    }
    else{
		echo "login Success";
		$reply['status'] = 'Success';
		$reply['name'] = $name;
    }

}
print json_encode($reply);
?>