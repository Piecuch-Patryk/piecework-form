<?php
// Check if current week's table exist in database
// If it does then ask user to restore it
if(isset($_POST['date'])){
	session_start();
	$date = $_POST['date'];
	$userId = $_SESSION['userId'];
	require_once '../connection/db-conn-users.php';
	$connect = new mysqli($host, $db_user, $db_password, $db_name);
	mysqli_report(MYSQLI_REPORT_STRICT);
	try {
		if($connect->error){
			throw new Exception($connect->error);
		}else {
			$stmt = $connect->prepare("SELECT `date` FROM `autosavetables` WHERE `userId` = ? AND `date` = ?");
			$stmt->bind_param('is', $userId, $date);
			$stmt->execute();
			if($stmt->error){
				throw new Exception($stmt->error);
			}else {
				$result = $stmt->get_result();
				if($result->num_rows > 0){
					die(json_encode(true));
				}else {
					die(json_encode(false));
				}
			}
		}
	}catch (Exception $e){
		die('Error: ' . $e);
	}
}
?>