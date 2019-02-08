<?php
session_start();
// redirect if logged;
if(isset($_SESSION['logged'])){
	header('Location: ../private/');
	exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wages app v5.0</title>
	<link rel="stylesheet" href="../styles/main.css">
	<link rel="stylesheet" href="../styles/login.css">
</head>
<body class="login-bg">
	<main class="form-wrap">
		<!-- Login form -->
		<form method="POST" action="../app_php/login.php">
			<h1><?php
				if(isset($_SESSION['pass_updated'])){
					echo $_SESSION['pass_updated'];
					unset($_SESSION['pass_updated']);
				}else {
					echo 'Piecework form sheet';
				}
				
				?></h1>
			<div class="form-row">
				<input id="login" class="input" type="email" name="username" autofill="email" required placeholder="E-mail" value=<?php
							 if(isset($_SESSION['temp_email'])){
								 echo $_SESSION['temp_email'];
								 unset($_SESSION['temp_email']);
							 }
							 ?>>
				<label for="login">E-mail</label>
			</div>
			<div class="form-row">
				<input id="password" class="input" type="password" name="password" autofill="password" required placeholder="Password">
				<label for="password">Password</label>
			</div>
			<p class="error-field"><?php
				if(isset($_SESSION['e_login_pass'])){
					echo $_SESSION['e_login_pass'];
				}
			?></p>
			<div class="form-row">
				<button>Submit</button>
			</div>
			<div class="form-row">
				<a href="../pass_recovery/recovery.php">Password recovery</a>
			</div>
			<div class="form-row">
				<a href="./register.php">Create free account</a>
			</div>
		</form>
	</main>
	<footer class="login-footer">
		<p>WagesApp@2019. Copyrights &copy; Patryk Piecuch </p>
	</footer>
	<?php $_SESSION = array(); ?>
	<!-- jQuery -->
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
	<script>
		// Toggle placeholder;
		if(!$('#login').is(':invalid')){
			$('#login').next().css('display', 'block').animate({
				opacity: 1
			});
		}
		$('.input').on('focus', function(){
			const text = this.placeholder;
			// show label;
			$(this.nextElementSibling).css('display', 'block').animate({
				opacity: 1
			});
			this.placeholder = '';
			$(this).on('blur', function(){
				if($(this).is(':invalid')) {
					this.placeholder = text;
					// hide label
					$(this.nextElementSibling).css({
						opacity: 0,
						display: 'none'
					});
				}
			});
		});
	</script>
</body>
</html>