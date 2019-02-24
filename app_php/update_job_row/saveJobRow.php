<?php
if(isset($_POST['invoice'])){
	session_start();
	require_once '../connection/db-conn-users.php';
	mysqli_report(MYSQLI_REPORT_STRICT);
	try{
		$connection = new mysqli($host, $db_user, $db_password, $db_name);
		if($connection->connect_errno != 0){
			throw new exception(mysqli_connect_error());
		}else{
			$stmt = $connection->prepare("INSERT INTO `jobs`(`id`,
			`userId`,
			`date`,
			`invoice`,
			`rangeType`,
			`size`,
			`price`,
			`extras`,
			`shelvesChecked`,
			`base`,
			`guttering`,
			`waterbutt`,
			`coritec`,
			`shelves`) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
			$stmt->bind_param('isissiiisssss',
												$_SESSION['userId'],
												$_POST['date'],
												$_POST['invoice'],
												$_POST['range'],
												$_POST['size'],
												$_POST['price'],
												$_POST['extras'],
												$_POST['shelvesChecked'],
												$_POST['base'],
												$_POST['guttering'],
												$_POST['waterbutt'],
												$_POST['coritec'],
												$_POST['shelves']);
			$stmt->execute();
			
			echo $stmt->error;
			
			$connection->close();
		}
	}catch(Exception $e){
		die('Error: ' . $e);
	}
}else {
	header('Location: ../../private/');
}
?>