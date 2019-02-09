<?php
$flag = true;
$pass_lowercase = preg_match('@[a-z]@', $pass);
$pass_uppercase = preg_match('@[A-Z]@', $pass);
$pass_digit = preg_match('@[0-9]@', $pass);
$pass_special_char = preg_match('/[()!@#$.,:_-]/', $pass);

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
?>