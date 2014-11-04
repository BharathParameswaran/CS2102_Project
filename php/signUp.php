<?php
include 'db_connect.php';
if($con){

	$reply = array();
$reply['status'] = 'Fail';
$Name = $_GET['name'];
$Email = $_GET['email'];
$Dob = $_GET['dob'];
$Username = $_GET['username'];
$Password = $_GET['password'];
$UnitNo = $_GET['unitNo'];
$Street = $_GET['street'];
$Country = $_GET['country'];
$Postal = $_GET['postal'];
$Contact = $_GET['contact'];


//$stmt = mysqli_prepare($con, "select uId from user where username = ?");
$stmt = mysqli_prepare($con, "select uId from user where userName = ?");

mysqli_stmt_bind_param($stmt, 's', $Username);
mysqli_stmt_execute($stmt);
mysqli_stmt_bind_result($stmt, $uId);
mysqli_stmt_fetch($stmt);

    if($uId == null ){

    	//$sql = mysqli_prepare($con, "INSERT INTO user (name, email, DOB, userName, password, unitNumber, streetName, country, postalCode, contact) 
    	//	VALUES ('Celia', 'celia_tio@hotmail.com', '1992-10-07', 'celia', '123', '135', 'Serangoon', 'Singapore', '350135', '8385')");
    	$sql = mysqli_prepare($con, "INSERT INTO user (name, email, DOB, userName, password, unitNumber, streetName, country, postalCode, contact) 
    		VALUES (?,?,?,?,?,?,?,?,?,?)");
    	
    	mysqli_stmt_bind_param($sql, 'ssssssssss', $Name, $Email, $Dob, $Username, $Password, $UnitNo, $Street, $Country, $Postal, $Contact);
		mysqli_stmt_execute($sql);

       		$reply['status'] = 'Success';
       		$reply['name'] = $Name;
	

    }
    else{
       		$reply['status'] = 'Exist';
    }

   


}
print json_encode($reply);
?>



