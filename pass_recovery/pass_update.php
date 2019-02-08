<?php
if(isset($_POST['username'])){	
	$email = $_POST['username'];
	$pass = $_POST['password'];
	$pass2 = $_POST['password2'];
	$pass_lowercase = preg_match('@[a-z]@', $pass);
	$pass_uppercase = preg_match('@[A-Z]@', $pass);
	$pass_digit = preg_match('@[0-9]@', $pass);
	$pass_special_char = preg_match('/[()!@#$.,:_-]/', $pass);
	$flag = true;
	session_start();
	// Remove unwanted characters from email;
	$emailSafety = filter_var($email, FILTER_SANITIZE_EMAIL);
	// check email format and compare with safety email;
	if((!filter_var($emailSafety, FILTER_VALIDATE_EMAIL)) || ($emailSafety != $email)){
		$flag = false;
		$_SESSION['e_email'] = 'Enter correct e-mail adress.';
	}
	// Password must contains 8 to 30 characters;
	if((strlen($pass) < 8) || (strlen($pass) > 30)) {
		$flag = false;
		$_SESSION['e_password'] = 'Password must contain between 8 and 20 characters.';
	}
	// pass lowercase;
	else if(!$pass_lowercase){
		$flag = false;
		$_SESSION['e_password'] = 'Password must contain at least one lowercase letter.';
	}
	// pass uppercase;
	else if(!$pass_uppercase){
		$flag = false;
		$_SESSION['e_password'] = 'Password must contain at least one uppercase letter.';
	}
	// pass digit;
	else if(!$pass_digit){
		$flag = false;
		$_SESSION['e_password'] = 'Password must contain at least one digit.';
	}
	// special characters;
	else if(!$pass_special_char){
		$flag = false;
		$_SESSION['e_password'] = 'Password must contain at least one special character.';
	}
	// Password repeat;
	if($pass != $pass2){
		$all_fine = false;
		$_SESSION['e_password2'] = 'Both passwords must be the same.';		
	}
	
	if($flag){
		require '../app_php/connection/db-conn-users.php';
		mysqli_report(MYSQLI_REPORT_STRICT);
		try{
				$connection = new mysqli($host, $db_user, $db_password, $db_name);
				$pass = mysqli_real_escape_string($connection, $pass);
				// Hash password;
				$pass_hash = password_hash($pass, PASSWORD_BCRYPT);
        if($connection->connect_errno != 0){
					// Throw error if connection failed;
					throw new Exception(mysqli_errno());
				}else {
				// Check if given email exist;
				$result = $connection->query(sprintf("UPDATE `users` SET `password`='$pass_hash' WHERE `email` = '%s'", $emailSafety));
				if(!$result){
					// Error;
					throw new Exception($connection->error);
				}else{
					// Password updated;
					$_SESSION['newpass'] = true;
					$_SESSION['temp_email'] = $email;
					$_SESSION['pass_updated'] = 'Use new password to sign in.';
					header('Location: ../login/');
					exit;
					}
				}
			}
		catch(Exception $e){
			// Connection error;
			echo 'Server connection error!';
			echo '<br/>Error: '.$e;
		}
	}else {
		$_SESSION['newpass'] = true;
		header('Location: ./');
		exit;
	}
}else {
	header('Location: ./recovery.php');
}
?>