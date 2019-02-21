<?php
function sterilizeRangeInput($str){
	$allowed = array("heavy-duty", "pop-apex", "pop-pent", "ryton", "sup-apex", "sup-pent");
	return array_search($str, $allowed);
}
if(isset($_GET['range'])){
	$str = $_GET['range'];
	if(!sterilizeRangeInput($str)){
		die(json_encode('Not this time mate!'));
	}
	// Db connection
	require_once('../connection/db-conn-sheds.php');
	mysqli_report(MYSQLI_REPORT_STRICT);
	try {
		$connection = new mysqli($host, $db_user, $db_password, $db_name);
		// Catch connection errors
		if ($connection->connect_errno != 0) {
			throw new Exception(mysqli_connect_errno());
		} else {
			// Get all sizes for chosen range
			$stmt = $connection->prepare("SELECT * FROM `$str` WHERE 1");
			$stmt->execute();
			$result = $stmt->get_result();
			$row = mysqli_fetch_all($result,MYSQLI_ASSOC);
			$connection->close();
			echo json_encode($row);
			exit;
		}
	} catch (Exception $e) {
		echo 'server error'.'<br/>';
		// Development use only
		echo $e;
	}
}else {
	$json = json_encode('error');
	echo $json;
	exit;
}
?>