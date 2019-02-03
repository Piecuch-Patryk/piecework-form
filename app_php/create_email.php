<?php
if(isset($PDFcontent)){
	require 'C:/Users/patrykowo/vendor/phpmailer/phpmailer/src/PHPMailer.php';
	require 'C:/Users/patrykowo/vendor/phpmailer/phpmailer/src/SMTP.php';
	require 'C:/Users/patrykowo/vendor/phpmailer/phpmailer/src/Exception.php';
	
	require_once './connection/PRIVATE_DATA.php';		// email username and password;
	
	$mail = new PHPMailer\PHPMailer\PHPMailer();

	$mail->isSMTP();                             		// Set mailer to use SMTP
	$mail->Host = 'smtp.gmail.com';  								// Specify main and backup SMTP servers
	$mail->Port = 587;
	$mail->SMTPAuth = true;                        	// Enable SMTP authentication
	$mail->Username = $email_username;              // SMTP username
	$mail->Password = $email_password;              // SMTP password
	$mail->SMTPSecure = 'tls';                      // Enable encryption, 'ssl' also accepted
	$mail->SMTPKeepAlive = true;

	$mail->From = $_SESSION['email'];
	$mail->FromName = $fullname;
	$mail->addAddress($email_username);             // Send to..
	$mail->addReplyTo($_SESSION['email'], $fullname);

	$mail->WordWrap = 50;
	$mail->addAttachment($pdfPath);        					// Add attachments
	$mail->isHTML(true);                   					// Set email format to HTML

	$mail->Subject = 'Piecework form w/c ' . $weekDates[0];
	$mail->Body    = 'Email text message here...';

	if(!$mail->send()) {
		echo json_encode("Fail - " . $mail->ErrorInfo);
	} else {
		echo json_encode(true);
	}
}
?>