<?php
include 'db_connect.php';
if($con){
	$reply = array();
$reply['status'] = 'ok';


$stmt = mysqli_prepare($con, "select * from hotel");
mysqli_stmt_execute($stmt);
mysqli_stmt_bind_result($stmt, $id, $name,$unit, $street,$country, $postal,$contact, $rating);

    $result = array();
    $num_rows =0;

    while (mysqli_stmt_fetch($stmt)) {
        $num_rows ++;
        $returnedHotel = array();
        $returnedHotel[0] = $id;
        $returnedHotel[1] = $name;
    	array_push($result, $returnedHotel);
    }
    if($num_rows == 0){
        $reply['status'] = "empty";
    }
    else{
        json_encode($result);
        $reply['answer'] = $result;

    }

$facilities = array();
$result = mysqli_query($con, "select * from facilities");
while ($row = mysqli_fetch_array($result)) {
    $facility = array("id" => $row['fId'], "name" => $row['fname']);
    array_push($facilities, $facility);
}

$reply['facilities'] = $facilities;


$categories = array();
$result = mysqli_query($con, "select * from category");
while ($row = mysqli_fetch_array($result)) {
    $category = array("name" => $row['cname'], "id" => $row['cId']);
    array_push($categories, $category);
}

$reply['categories'] = $categories;

}
print json_encode($reply);
?>