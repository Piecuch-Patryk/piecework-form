<?php
if(isset($_POST['invoice'])){
	session_start();
	require_once '../connection/db-conn-users.php';
	try{
		$conn = new PDO("mysql:host=$host;dbname=$db_name", $db_user, $db_password);
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$stmt = $conn->prepare("SELECT * FROM `jobs` WHERE `userId` = :userid AND `invoice` = :invoice");
		$stmt->bindParam(':userid', $_SESSION['userId']);
		$stmt->bindParam(':invoice', $_POST['invoice']);
		$stmt->execute();
		if($stmt->rowCount() > 0){
			$stmt = $conn->prepare("DELETE FROM `jobs` WHERE `userId` = :userid AND `invoice` = :invoice");
			$stmt->bindParam(':userid', $_SESSION['userId']);
			$stmt->bindParam(':invoice', $_POST['invoice']);
			$stmt->execute();
		}
	}catch(PDOException $e){
		die(json_encode('Error: ' . $e));
	}
}else{
	header('Location: ../../private/');
}
?>