<?php
// Returns false if nothig found
function sterilizeDataInput($str){
	$allowed = array("bearers", "easy-base", "coritec", "guttering", "waterbutt");
	return array_search($str, $allowed);
}
if(isset($_GET['size'])){
	$size = $_GET['size'];
	$data = $_GET['data'];
	if(!sterilizeDataInput($data)){
		die(json_encode('Not this time mate!'));
	}
	// Db connection
	require_once('../connection/db-conn-others.php');
	mysqli_report(MYSQLI_REPORT_STRICT);
	try {
		$connection = new mysqli($host, $db_user, $db_password, $db_name);
		// Catch connection errors
		if ($connection->connect_errno != 0) {
			throw new Exception(mysqli_connect_errno());
		} else {
			// Get extras names
			$stmt = $connection->prepare("SELECT * FROM `$data` WHERE `size` = ?");
			$stmt->bind_param('s', $size);
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