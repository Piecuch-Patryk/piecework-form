<?php
if(isset($_POST['username'])){
	session_start();
	$login = $_POST['username'];
	$password = $_POST['password'];
	$flag = true;
	
	$_SESSION['temp_email'] = $login;
	// Remove unwanted characters from email;
	$emailSafety = filter_var($login, FILTER_SANITIZE_EMAIL);
	// check email format and compare with safety email;
	if((!filter_var($emailSafety, FILTER_VALIDATE_EMAIL)) || ($emailSafety != $login)){
		$flag = false;
		$_SESSION['e_email'] = 'Enter correct e-mail adress.';
	}
	
	if($flag){
		require './connection/db-conn-users.php';
		mysqli_report(MYSQLI_REPORT_STRICT);
		try{
			$connection = new mysqli($host, $db_user, $db_password, $db_name);
            if($connection->connect_errno != 0){
				// Throw error if connection failed;
                throw new Exception(mysqli_errno());
            }else {
				// Check if given email exist;
				$result = $connection->query(sprintf("SELECT * from `users` WHERE `email` = '%s'", mysqli_real_escape_string($connection, $emailSafety)));
				if(!$result){
					// Error;
					throw new Exception($connection->error);
				}else{
					$numberRows = $result->num_rows;
					if($numberRows > 0){
						$row = $result->fetch_assoc();
						// verify password;
						if(password_verify($password, $row[password])){
							// LOGGED;
							$connection->close();
							$_SESSION['logged'] = true;
							$_SESSION['name'] = $row['name'];
							$_SESSION['surname'] = $row['surname'];
							$_SESSION['email'] = $row['email'];
							header('Location: ../private/');							
						}else{
							$_SESSION['e_login_pass'] = 'Wrong pair email /	password';
							header('Location: ../login/index.php');
						}
					}else{
						$_SESSION['e_login_pass'] = 'Wrong pair email/	password';
						header('Location: ../login/index.php');
					}
				}
				
			}
		}
		catch(Exception $e){
			// Connection error;
			echo 'Server connection error!';
			echo '<br/>Error: '.$e;
		}
	}else{
		header('Location: ./');
	}
}else {
	header('Location: ./');
}
?>