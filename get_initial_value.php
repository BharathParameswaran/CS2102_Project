<?php
	$url="localhost";
	$user_name="root";
	$db_password="password";
	$db_name="cs2102";
	$con=mysqli_connect($url, $user_name, $db_password, $db_name);

	// Check connection
	if (mysqli_connect_errno()) {
	  echo "Failed to connect to MySQL: " . mysqli_connect_error();
	// Create connection
	$url="localhost";
	} else {
		$result_array= array();

		$country_array = array();
		$result = mysqli_query($con,"select distinct country from hotel");
		while($row = mysqli_fetch_array($result)) {
			$country = $row['country'];
			array_push($country_array, $country);
		}
//		array_push($result_array, array("country" => $country_array));

		$facility_array = array();
		$result = mysqli_query($con,"select * from facilities");
		while($row = mysqli_fetch_array($result)) {
			$facility = $row['fname'];
			array_push($facility_array, $facility);
		}
//		array_push($result_array, array("facility" => $facility_array));

		$category_array = array();
		$result = mysqli_query($con,"select * from category");
		while($row = mysqli_fetch_array($result)) {
			$category = $row['cname'];
			array_push($category_array, $category);
		}
//		array_push($result_array, array("category" => $category_array));
		$result_array= array("country" => $country_array, "facility" => $facility_array, "category" => $category_array);

		echo json_encode($result_array);
	}
?>