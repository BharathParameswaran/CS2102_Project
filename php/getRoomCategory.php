<?php
include 'db_connect.php';
if($con){

	$reply = array();
$reply['status'] = 'Fail';
$Username = $_GET['username'];
$Password = $_GET['pass'];


$stmt = mysqli_prepare($con, "SELECT h.hId, c.cId, c.cname, c.description, sum(r.roomNo) AS Count 
FROM category c, hotel h, room r WHERE h.hId=r.hId AND c.cId=r.cId 
GROUP BY h.hId, c.cId;");

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








