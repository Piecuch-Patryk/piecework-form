<?php
// Remove unwanted characters from email;
$emailSafety = filter_var($email, FILTER_SANITIZE_EMAIL);
// check email format and compare with safety email;
if((!filter_var($emailSafety, FILTER_VALIDATE_EMAIL)) || ($emailSafety != $email)){
	$flag = false;
	$_SESSION['e_email'] = 'Enter correct e-mail adress.';
}
?>