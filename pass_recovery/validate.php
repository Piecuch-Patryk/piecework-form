<?php
if(isset($_GET['token'])){
	session_start();
	$token = $_GET['token'];
	$email = $_GET['email'];
	require '../app_php/connection/db-conn-users.php';
	mysqli_report(MYSQLI_REPORT_STRICT);
	try{
			$connection = new mysqli($host, $db_user, $db_password, $db_name);

			if($connection->connect_errno != 0){
				// Throw error if connection failed;
				throw new Exception(mysqli_errno());
			}else {
			// Check if given email exist;
			$result = $connection->query(sprintf("SELECT * from `passrecovery` WHERE `email` = '%s'", $email));
			if(!$result){
				// Error;
				throw new Exception($connection->error);
			}else{
				$numberRows = $result->num_rows;
				if($numberRows > 0){
					// Email found;
					$flag = true;
					$row = $result->fetch_assoc();
					$current_timestamp = date('U');
					if($current_timestamp > $row['expiry']){
						$flag = false;
						$_SESSION['e_expiry'] = 'Token expired. Try again.';
					}
					if(!password_verify($token, $row['token'])){
						$flag = false;
					}
					if($flag){
						$_SESSION['email'] = $email;
						$_SESSION['newpass'] = true;
						header('Location: ./index.php');
						exit;
					}else {
						header('Location: ./recovery.php');
						exit;
					}
				}else{
					$_SESSION['retrive_pass'] = 'Something went wrong, please try again.';
					header('Location: ./recovery.php');	
					exit;
					}
				}
			}
		}
	catch(Exception $e){
		// Connection error;
		echo 'Server connection error!';
		echo '<br/>Error: '.$e;
	}	
}else {
	header('Location: ./recovery.php');
}
?>