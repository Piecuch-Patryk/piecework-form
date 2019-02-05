<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Wages app v.5</title>
	<!-- fontawesome -->
	<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" />
	<link rel="stylesheet" href="../styles/main.css">
	<link rel="stylesheet" href="../styles/private.css">
	<link rel="stylesheet" href="../styles/register.css">
</head>
<body class="register-bg">
	<main>
		<form class="form-wrap" action="../app_php/register.php" method="POST">
			<h1>Register new account here!</h1>
			<!--name-->
			<div class="flex-wrap">
				<label for="name">Name</label>
				<div>
					<input id="name" type="text" name="name" autofill="name" required value=<?php
						if(isset($_SESSION['tempName'])){
							echo $_SESSION['tempName'];
							unset($_SESSION['tempName']);
						}
					?>>
					<p class="error-field"><?php
							if(isset($_SESSION['e_name'])){
								echo $_SESSION['e_name'];
								unset($_SESSION['e_name']);
							}
						?></p>
				</div>
			</div>
			<!--surname-->
			<div class="flex-wrap">
				<label for="surname">Surname</label>			
				<div>
					<input id="surname" type="text" name="surname" autofill="surname" required value=<?php
						if(isset($_SESSION['tempSurname'])){
							echo $_SESSION['tempSurname'];
							unset($_SESSION['tempSurname']);
						}
					?>>
					<p class="error-field"><?php
							if(isset($_SESSION['e_surname'])){
								echo $_SESSION['e_surname'];
								unset($_SESSION['e_surname']);
							}
						?></p>
				</div>
			</div>
			<!--email-->
			<div class="flex-wrap">
				<label id="email">E-mail</label>			
				<div>
					<input id="email" type="email" name="email" autofill="email" required value=<?php
						if(isset($_SESSION['tempEmail'])){
							echo $_SESSION['tempEmail'];
							unset($_SESSION['tempEmail']);
						}
					?>>
					<p class="error-field"><?php
							if(isset($_SESSION['e_email'])){
								echo $_SESSION['e_email'];
								unset($_SESSION['e_email']);
							}
						?></p>
				</div>
			</div>
			<!--pass-->
			<div class="flex-wrap password-info">
				<label id="pass">Password</label>
				<div>
					<input id="pass" type="password" name="pass" autofill="password" required>
					<p class="error-field"><?php
							if(isset($_SESSION['e_password'])){
								echo $_SESSION['e_password'];
								unset($_SESSION['e_password']);
							}
						?></p>
				</div>
				<i id="pass-info" class="fas fa-info"></i>
				<!--password tips-->
				<div id="pass-tip-wrap" class="pass-tip hidden">
					<ul>Password must contains:
						<li>- one upper case letter;</li>
						<li>- one lower case letter;</li>
						<li>- one digit;</li>
						<li>- one special character;</li>
						<li>- between 8 and 30 characters;</li>
					</ul>
				</div>
			</div>
			<!--pass2-->
			<div class="flex-wrap">
				<label id="pass2">Repeat password</label>
				<div>
					<input id="pass2" type="password" name="pass2" autofill="password" required>
					<p class="error-field"><?php
							if(isset($_SESSION['e_password2'])){
								echo $_SESSION['e_password2'];
								unset($_SESSION['e_password2']);
							}
						?></p>
				</div>
			</div>
			<!--submit-->
			<div class="btn-wrap">
				<button class="submit-btn" name="submit">Register</button>
			</div>
			<!--back to login page-->
			<div class="btn-wrap">
				<a href="./index.php">Back to login site</a>
			</div>
		</form>
	</main>
	<!-- jQuery -->
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
	<script>
		// toggle password info;
		$('#pass-info').on('click', () => $('#pass-tip-wrap').toggle('fold'));
	</script>
</body>
</html>