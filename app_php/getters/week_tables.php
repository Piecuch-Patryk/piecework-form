<?php
function getArrayReversed(){
	$array = $_GET['weekDates'];
	$newArray = array();
	foreach($array as $value){
		$exploded = explode('-', $value);
		$newStr = join(array_reverse($exploded), '-');
		array_push($newArray, $newStr);
	}	
	return $newArray;
}
if(isset($_GET['weekDates'])) {
	session_start();
	require_once '../connection/db-conn-users.php';
	mysqli_report(MYSQLI_REPORT_STRICT);
	try {
		$connection = new mysqli($host, $db_user, $db_password, $db_name);
		// Catch connection errors
		if ($connection->connect_errno != 0) {
			throw new Exception(mysqli_connect_errno());
		} else {
			$array = getArrayReversed();
			$jobs = array();
			$stmt = $connection->prepare("SELECT * FROM `jobs` WHERE `userId` = ? AND `date` = ?");
			foreach($array as $value) {
				$stmt->bind_param('is', $_SESSION['userId'], $value);
				$stmt->execute();
				$result = $stmt->get_result();
				$row = mysqli_fetch_all($result,MYSQLI_ASSOC);
				array_push($jobs, $row);

			}
			echo json_encode($jobs);
			$connection->close();
			exit;
		}
	} catch (Exception $e) {
		echo 'server error'.'<br/>';
		// Development use only
		echo $e;
	}
}else {
	header('Location: ../../private/');
}
?>