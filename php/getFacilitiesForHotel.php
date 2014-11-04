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