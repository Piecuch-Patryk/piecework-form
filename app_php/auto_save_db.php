<?php
if(isset($_POST['date'])){
	session_start();
	$date = $_POST['date'];
	$textHtml = $_POST['text'];
	$userId = $_SESSION['userId'];
	$null = NULL;

	require_once './connection/db-conn-users.php';
	$connect = new mysqli($host, $db_user, $db_password, $db_name);
	mysqli_report(MYSQLI_REPORT_STRICT);
	try {
		if($connect->connect_error) {
			throw new Exception($connect->error);
		}else {
			$stmt = $connect->prepare("SELECT `date` FROM `autosavetables` WHERE `userId` = ?");
			$stmt->bind_param('i', $userId);
			$stmt->execute();
			$result = $stmt->get_result();
			if($stmt->error) {
				throw new Exception($query->error);
			}else {
				// Found some rows
				if($result->num_rows > 0){
					while($row = $result->fetch_assoc()){
						// Delete row to don't repeat the same week
						if($row['date'] == $date){
							$stmt = $connect->prepare("DELETE FROM `autosavetables` WHERE `userId` = ? AND `date` = ?");
							$stmt->bind_param('is', $userId, $date);
							$stmt->execute();							
							if($stmt->error){
								throw new Exception($stmt->error);
							}
						}
					}
				}
					// Insert new week-row with it's beginning date
					$stmt = $connect->prepare("INSERT INTO `autosavetables` (`id`, `userId`, `date`, `tableHTML`) VALUES (?,?,?,?)");
					$stmt->bind_param('siss', $null, $userId, $date, $textHtml);
					$stmt->execute();
					if($stmt->error){
						throw new Exception($stmt->error);
					}else {
						echo json_encode('Row inserted.');
						exit;
					}
				}
			}
		}
	catch(Exception $e){
		die('Error: ' . $e);
	}
}else {
	header('Location: ../private/');
}
?>