<?php
if(isset($_POST['submit'])){
	session_start();
	$name = $_POST['name'];
	$surname = $_POST['surname'];
	$email = $_POST['email'];
	$pass = $_POST['pass'];
	$pass2 = $_POST['pass2'];
	$flag = true;
	$pass_lowercase = preg_match('@[a-z]@', $pass);
	$pass_uppercase = preg_match('@[A-Z]@', $pass);
	$pass_digit = preg_match('@[0-9]@', $pass);
	$pass_special_char = preg_match('/()!@#$.,:_-/', $pass);
	
	
	$_SESSION['tempName'] = $name;
	$_SESSION['tempSurname'] = $surname;
	$_SESSION['tempEmail'] = $email;
	
	// Name characters;
	if(!ctype_alpha($name)){
		$flag = false;
		$_SESSION['e_name'] = 'Name must contains letters only.';
	}
	// Surname characters;
	if(!ctype_alpha($surname)){
		$flag = false;
		$_SESSION['e_surname'] = 'Surname must contains letters only.';
	}
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
		require './connection/db-conn-users.php';
		mysqli_report(MYSQLI_REPORT_STRICT);
		try{
				$connection = new mysqli($host, $db_user, $db_password, $db_name);
				$name = mysqli_real_escape_string($connection, $name);
				$surname = mysqli_real_escape_string($connection, $surname);
				$pass = mysqli_real_escape_string($connection, $pass);
				$pass2 = mysqli_real_escape_string($connection, $pass2);
				// Hash password;
				$pass_hash = password_hash($pass, PASSWORD_BCRYPT);
        if($connection->connect_errno != 0){
				// Throw error if connection failed;
                throw new Exception(mysqli_errno());
            }else {
				// Check if given email exist;
				$result = $connection->query(sprintf("SELECT `email` from `users` WHERE `email` = '%s'", $emailSafety));
				if(!$result){
					// Error;
					throw new Exception($connection->error);
				}else{
					$numberRows = $result->num_rows;
					if($numberRows > 0){
						// Email occurs in db;
						$_SESSION['e_email'] = 'The email you have entered is already registered.';
						$connection->close();
						header('Location ../login/register.php');
					}else{
						// Register new user;
						// Email doesn't occur in db;
						$result = $connection->query(sprintf("INSERT INTO `users` (`id`, `name`, `surname`, `email`, `password`) VALUES(NULL, '%s', '%s', '%s', '%s')", $name, $surname, $emailSafety, $pass_hash));
						if(!$result){
							// Error;
							throw new Exception($connection->error);
						}else {
							$connection->close();
							$_SESSION['logged'] = true;
							$_SESSION['name'] = $name;
							$_SESSION['surname'] = $surname;
							
							header('Location: ../private/');
						}
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
		header('Location: ../login/register.php');
	}
}else {
	header('Location: ../login/register.php');
}
?>