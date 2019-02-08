<?php
if(isset($_POST['email'])){
	session_start();
	$email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
	$flag = true;
	// validate email;
	if($email != $_POST['email']){
		$flag = false;
		$_SESSION['temp_email'] = 'Typed email is incorrect.';
	}
	if($flag){
		require '../app_php/connection/db-conn-users.php';
		mysqli_report(MYSQLI_REPORT_STRICT);
		try{
				$connection = new mysqli($host, $db_user, $db_password, $db_name);
				
        if($connection->connect_errno != 0){
					// Throw error if connection failed;
					throw new Exception(mysqli_errno());
        }else {
				// Check if given email exist;
				$result = $connection->query(sprintf("SELECT `email` from `users` WHERE `email` = '%s'", $email));
				if(!$result){
					// Error;
					throw new Exception($connection->error);
				}else{
					$numberRows = $result->num_rows;
					if($numberRows == 0){
						// Email not found;
						$_SESSION['e_email'] = 'Email address does not exist.';
						$connection->close();
						header('Location: ./recovery.php');
					}else{
						// delete old token;
						$result = $connection->query(sprintf("DELETE FROM `passrecovery` WHERE `email` = '%s'", $email));
						if(!$result){
							throw new Exception($connection->error);
						}else {
							// Email occurs in db;
							$token = bin2hex(openssl_random_pseudo_bytes(16));
							$token_hash = password_hash($token, PASSWORD_BCRYPT);
							$created = date('U');
							// token valid for one hour only;
							$expiry = date('U') + 3600;						

							$result = $connection->query(sprintf("INSERT INTO `passrecovery` (`id`, `email`, `token`, `created`, `expiry`) VALUES(NULL, '%s', '%s', '%s', '%s')", $email, $token_hash, $created, $expiry));
							if(!$result){
								// Error;
								throw new Exception($connection->error);
							}else {
								$connection->close();

								$to = $email;
								$subject = 'Password recovery. NO REPLY';
								$header = 'From: piecework-calculator.com';
								$message = 'Hi, click the link below to reset your password. Ignore this email if you did not request it.</br>' .  
									'<a href="../pass_recovery/validate.php?token=' . $token . '&email=' . $email . '">recovery password link</a>';

								$message = wordwrap($message, 70);

								// OFF for LOCALHOST;
	//							mail($to, $subject, $message, $header);

								// localhost usage;
								echo $message;
								exit;

								$_SESSION['retrive_pass'] = 'Check your mail box';
								header('Location: ./recovery.php');
							}
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
		header('Location: ./recovery.php');
	}
}
?>