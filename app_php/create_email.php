<?php

if(isset($_SESSION['pdf-path'])){
	require 'C:/Users/patrykowo/vendor/phpmailer/phpmailer/src/PHPMailer.php';
	require 'C:/Users/patrykowo/vendor/phpmailer/phpmailer/src/SMTP.php';
	require 'C:/Users/patrykowo/vendor/phpmailer/phpmailer/src/Exception.php';

	$mail = new PHPMailer\PHPMailer\PHPMailer();

	$mail->isSMTP();                                      	// Set mailer to use SMTP
	$mail->Host = 'smtp.gmail.com';  						// Specify main and backup SMTP servers
	$mail->Port = 587;
	$mail->SMTPAuth = true;                               	// Enable SMTP authentication
	$mail->Username = '';                // SMTP username
	$mail->Password = '';                      // SMTP password
	$mail->SMTPSecure = 'tls';                        	    // Enable encryption, 'ssl' also accepted
    $mail->SMTPKeepAlive = true;

	$mail->From = $_SESSION['email'];
	$mail->FromName = $_SESSION['name'] . ' ' . $_SESSION['surname'];
	// $mail->addAddress('joe@example.net', 'Joe User')     // Add a recipient
	$mail->addAddress('');               // Name is optional
	$mail->addReplyTo($_SESSION['email'], $_SESSION['name'] . ' ' . $_SESSION['surname']);
	// $mail->addCC('cc@example.com');
	// $mail->addBCC('bcc@example.com');

	$mail->WordWrap = 50;                        	   		   // Set word wrap to 50 characters
	$mail->addAttachment($_SESSION['pdf-path']);        // Add attachments
	// $mail->addAttachment('/tmp/image.jpg', 'new.jpg');    // Optional name
	$mail->isHTML(true);                                	  // Set email format to HTML

//	$mail->Subject = 'Piecework form w/c '.$_POST['dates'][0];
	$mail->Subject = 'Piecework form w/c: ' . $_SESSION['wc-date'];
	$mail->Body = 'Hello, I attached payment form to this e-mail.';
	// $mail->AltBody = 'This is the body in plain text for non-HTML mail clients';

	if(!$mail->send()) {
		echo 'Message could not be sent.';
		echo 'Mailer Error: ' . $mail->ErrorInfo;
	} else {
		$_SESSION['email_sent'] = true;
		header('Location: ../private/');
	}
}
?>